const app = require("express")();
const cors = require("cors");
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const chalk = require("chalk");
const bytes = require("bytes");
const _isString = require("lodash/isString");
const { createCanvas, loadImage } = require("canvas");
const {
  canvasSize,
  handleDrawEvent,
  drawImage,
  setup
} = require("../common/drawing");
const { DrawEvent } = require("../common/proto");

app.use(cors());

const port = parseInt(process.env.PORT) || 9090;
const canvasDeleteWaitSeconds = 10;

function pad(number) {
  return number < 10 ? "0" + number.toString() : number.toString();
}

function now() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function log(socket, event, ...message) {
  console.log(
    `${chalk.blue(`[${now()}]`)} ${chalk.green(
      `[${socket.id}]`.padEnd(22, " ")
    )} ${chalk.yellow(`[${event}]`.padEnd(15, " "))}`,
    ...message
  );
}

const deleteTimeoutHandles = {};

const canvases = {};

function canvasCount() {
  const mem = process.memoryUsage();
  return `[${Object.keys(canvases).length} canvas(es), Heap: ${bytes(
    mem.heapUsed
  )}/${bytes(mem.heapTotal)}, External: ${bytes(mem.external)}, RSS: ${bytes(
    process.memoryUsage().rss
  )}]`;
}

const timerSeconds = {};
const timerTimeoutHandles = {};

function timerReset(room, duration) {
  clearTimeout(timerTimeoutHandles[room]);
  timerSeconds[room] = duration;
  timerTick(room);
}

function timerTick(room) {
  timerTimeoutHandles[room] = setTimeout(() => {
    timerSeconds[room]--;
    if (timerSeconds[room] > 0) {
      timerTick(room);
    } else {
      log(
        { id: "server" },
        "timerTick",
        `Cleaning up timer for room ${room}...`
      );
      delete timerSeconds[room];
      delete timerTimeoutHandles[room];
    }
  }, 1000);
}

io.on("connection", socket => {
  socket.on("join", (id, callback) => {
    log(socket, "join", `Joining ${id}...`);
    if (deleteTimeoutHandles[id]) {
      log(socket, "join", `Canceling ${id} scheduled deletion...`);
      clearTimeout(deleteTimeoutHandles[id]);
      delete deleteTimeoutHandles[id];
    }
    socket.join(id);
    if (id in canvases) {
      canvases[id].canvas.toBuffer((err, buffer) => {
        if (err) {
          log(socket, "join", chalk.red("Error rendering to buffer:"), err);
          return;
        }
        log(socket, "join", `Sending canvas for room ${id}...`);
        if (callback) callback(buffer);
      });
    } else {
      log(socket, "join", `No canvas to send for room ${id}`);
      if (callback) callback(false);
    }
    if (id in timerSeconds) {
      log(socket, "join", `Sending timer for room ${id}...`);
      socket.emit("timer", timerSeconds[id]);
    } else {
      log(socket, "join", `No timer to send for room ${id}`);
    }
  });

  const roomHandler = callback => event => {
    for (const room in socket.rooms) {
      if (room !== socket.id) {
        callback(room, event);
      }
    }
  };

  const ensureCanvas = room => {
    if (!(room in canvases)) {
      const canvas = createCanvas(canvasSize, canvasSize);
      const ctx = canvas.getContext("2d", { alpha: false });
      setup(ctx);
      canvases[room] = { canvas, ctx };
      log(
        socket,
        "draw",
        chalk.magenta(`Created new canvas for room ${room} ${canvasCount()}`)
      );
    }
  };

  socket.on(
    "draw",
    roomHandler((room, event) => {
      socket
        .binary(true)
        .in(room)
        .emit("draw", event);

      ensureCanvas(room);
      const drawEvent = DrawEvent.decode(new Uint8Array(event));
      handleDrawEvent(canvases[room].ctx, drawEvent);
    })
  );
  socket.on(
    "image",
    roomHandler((room, event) => {
      if (!_isString(event) || !event.startsWith("data:")) {
        log(
          socket,
          "image",
          chalk.red(
            `Error drawing image in ${room}: data URL not provided, got: ${event}`
          )
        );
        return;
      }

      socket.in(room).emit("image", event);

      ensureCanvas(room);
      loadImage(event)
        .then(img => {
          log(
            socket,
            "image",
            `Drawing ${img.width}x${img.height} image in ${room}...`
          );
          drawImage(canvases[room].ctx, img, true);
        })
        .catch(err => {
          log(
            socket,
            "image",
            chalk.red(`Error drawing image in ${room}: ${err}`)
          );
        });
    })
  );
  socket.on(
    "clear",
    roomHandler(room => {
      log(socket, "clear", `Clearing ${room}...`);
      socket.in(room).emit("clear");
      if (room in canvases) {
        delete canvases[room];
        if (global.gc) global.gc();
        log(
          socket,
          "clear",
          chalk.magenta(`Room ${room} cleared, deleted canvas ${canvasCount()}`)
        );
      }
    })
  );
  socket.on(
    "timer",
    roomHandler((room, event) => {
      log(socket, "timer", `Resetting ${room} timer to ${event}s...`);
      socket.in(room).emit("timer", event);
      timerReset(room, event);
    })
  );
  socket.on(
    "disconnecting",
    roomHandler(room => {
      log(socket, "disconnecting", `Disconnecting from ${room}...`);
      if (room in canvases) {
        const currentId = socket.id;
        const roomObject = io.sockets.adapter.rooms[room];
        if (!roomObject) return 0;
        const sockets = roomObject.sockets;
        const remainingRoomSize = sockets[currentId]
          ? roomObject.length - 1
          : roomObject.length;
        if (remainingRoomSize === 0) {
          log(
            socket,
            "disconnecting",
            `Last client in room ${room} disconnected, scheduling deletion in ${canvasDeleteWaitSeconds} second(s)...`
          );
          if (deleteTimeoutHandles[room]) {
            log(
              socket,
              "disconnecting",
              `Canceling ${room} scheduled deletion...`
            );
            clearTimeout(deleteTimeoutHandles[room]);
            delete deleteTimeoutHandles[room];
          }
          deleteTimeoutHandles[room] = setTimeout(() => {
            delete canvases[room];
            clearTimeout(timerTimeoutHandles[room]);
            delete timerSeconds[room];
            delete timerTimeoutHandles[room];
            if (global.gc) global.gc();
            log(
              socket,
              "disconnecting",
              chalk.magenta(`Deleted ${room}'s canvas & timer ${canvasCount()}`)
            );
          }, canvasDeleteWaitSeconds * 1000);
        }
      }
    })
  );
});

http.listen(port, () => {
  log({ id: "server" }, "listen", `Listening on *:${port}`);
});
