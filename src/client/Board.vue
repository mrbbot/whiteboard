<template>
  <Drop class="board" @drop="handleImageDrag">
    <input
      ref="file"
      class="file-input"
      type="file"
      accept="image/*"
      @change="handleImageSelect"
    />
    <BoardCanvas
      ref="canvas"
      :colour="selectedColour"
      :eraser="eraser"
      :touch-enabled="touchEnabled"
      :size="size"
      @draw="handleDraw"
      @pen="touchEnabled = false"
      @rect="rect = $event"
    />
    <div class="overlay bottom left row">
      <CircleButton
        icon="pen"
        title="Pen"
        swap-colours
        :colour="selectedColourRGB"
        :selected="!eraser"
        @click.native="eraser = false"
      />
      <CircleButton
        icon="eraser"
        title="Rubber"
        :colour="selectedColourRGB"
        :selected="eraser"
        @click.native="eraser = true"
      />
      <CircleButton
        icon="trash"
        title="Clear"
        :colour="selectedColourRGB"
        @click.native="clear"
      />
      <CircleButton
        icon="hand-pointer"
        title="Enable Touch"
        class="mobile-hidden"
        :colour="selectedColourRGB"
        :selected="touchEnabled"
        @click.native="touchEnabled = !touchEnabled"
      />
      <CircleButton
        icon="cloud-upload-alt"
        title="Upload Image"
        class="mobile-hidden"
        :colour="selectedColourRGB"
        @click.native="openImageFileDialog"
      />
      <CircleButton
        v-if="enableScreenshots"
        icon="camera"
        title="Save Screenshot"
        class="mobile-hidden"
        swap-colours
        :colour="selectedColourRGB"
        @click.native="saveScreenshot"
      />
    </div>
    <div
      class="overlay bottom right row for-size mobile-hidden"
      :title="'Size ' + rawSize"
    >
      <!--suppress HtmlFormInputWithoutLabel -->
      <input step="4" min="4" max="48" type="range" v-model="rawSize" />
      <CircleColour
        :colour="selectedColourRGB"
        :style="{ transform: 'scale(' + (size / 40) * canvasScale + ')' }"
      />
    </div>
    <div class="overlay top right two-column">
      <CircleColour
        v-for="colour in colours"
        :key="colour"
        :colour="colourToRGB(colour)"
        :selected="selectedColour === colour"
        @click.native="selectColour(colour)"
      />
    </div>
    <div v-if="loading" class="overlay center">
      <FontAwesomeIcon :icon="['fad', 'sync-alt']" fixed-width size="8x" spin />
    </div>
    <div class="overlay top left column">
      <Timer
        v-if="timerDuration > 0"
        :seconds="timerSeconds"
        @reset="resetTimer"
      />
      <WordGenerator
        v-if="wordDifficulty !== ''"
        :difficulty="wordDifficulty"
      />
      <Metadata />
    </div>
    <canvas
      ref="iconCanvas"
      class="icon-canvas"
      :width="iconCanvasSize"
      :height="iconCanvasSize"
    />
  </Drop>
</template>

<script>
import { Drop } from "vue-drag-drop";
import BoardCanvas from "./components/BoardCanvas";
import CircleColour from "./components/CircleColour";
import { canvasSize, colourToRGB } from "../common/drawing";
import CircleButton from "./components/CircleButton";
import { DrawEvent } from "../common/proto";
import io from "socket.io-client";
import { bytesToBase64 } from "byte-base64";
import { saveAs } from "file-saver";
import Timer from "@/client/components/Timer";
import WordGenerator from "@/client/components/WordGenerator";
import Metadata from "@/client/components/Metadata";

const socketUri =
  process.env.NODE_ENV === "development"
    ? "http://" + window.location.hostname + ":9090"
    : process.env.VUE_APP_SOCKET_URI;

const colours = [
  0xf44336,
  0xff5722,
  0xffc107,
  0x4caf50,
  0x2196f3,
  0x3f51b5,
  0x9c27b0,
  0xe91e63,
  0x795548,
  0x9e9e9e,
  0x000000,
  0xffffff
];

const iconCanvasSize = 32;
let iconEraserPath, iconPenPath;

export default {
  name: "board",
  components: {
    Metadata,
    WordGenerator,
    Drop,
    CircleButton,
    CircleColour,
    BoardCanvas,
    Timer
  },
  data() {
    return {
      iconCanvasSize,
      loading: true,
      eraser: false,
      touchEnabled: true,
      rawSize: "16",
      selectedColour: colours[0],
      colours,
      rect: null,
      timerSeconds: 0
    };
  },
  computed: {
    selectedColourRGB() {
      return colourToRGB(this.selectedColour);
    },
    size() {
      return parseInt(this.rawSize);
    },
    canvasScale() {
      return this.rect === null ? 1 : this.rect.width / canvasSize;
    },
    enableScreenshots() {
      return !!HTMLCanvasElement.prototype.toBlob;
    },
    timerDuration() {
      return parseInt(this.$route.query.timer?.toString()) || -1;
    },
    wordDifficulty() {
      const difficulty = this.$route.query.words;
      return difficulty !== "easy" &&
        difficulty !== "medium" &&
        difficulty !== "hard"
        ? ""
        : difficulty;
    }
  },
  mounted() {
    this.iconLink = document.querySelector('link[rel="icon"]');
    this.iconCtx = this.$refs.iconCanvas.getContext("2d");
    this.updateFavicon();
    this.socket = io(socketUri);
    this.socket.on("connect", () => {
      this.socket.emit("join", this.$route.params.id, initialData => {
        if (initialData) {
          const img = new Image();
          img.onload = () => this.$refs.canvas.drawImage(img);
          img.src =
            "data:image/png;base64," +
            bytesToBase64(new Uint8Array(initialData));
        }
        this.loading = false;
      });
    });
    this.socket.on("draw", e => {
      const drawEvent = DrawEvent.decode(new Uint8Array(e));
      this.$refs.canvas.handleDrawEvent(drawEvent);
    });
    this.socket.on("image", e => this.drawImage(e));
    this.socket.on("clear", () => this.$refs.canvas.clear());
    this.socket.on("timer", e => this.handleTimerReset(e));
  },
  beforeDestroy() {
    this.socket.disconnect();
  },
  methods: {
    colourToRGB,
    selectColour(colour) {
      this.eraser = false;
      this.selectedColour = colour;
      this.updateFavicon();
    },
    handleDraw(e) {
      this.socket.binary(true).emit("draw", DrawEvent.encode(e).finish());
    },
    clear() {
      this.$refs.canvas.clear();
      this.socket.emit("clear");
    },
    openImageFileDialog() {
      this.$refs.file.click();
    },
    handleImageSelect(e) {
      const file = e.target.files[0];
      if (file) {
        this.handleImageFile(file);
      }
    },
    handleImageDrag(_data, e) {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        this.handleImageFile(file);
      }
    },
    handleImageFile(file) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        this.drawImage(reader.result);
        this.socket.emit("image", reader.result);
      });
      reader.readAsDataURL(file);
    },
    drawImage(dataURL) {
      const img = new Image();
      img.onload = () => this.$refs.canvas.drawImage(img, true);
      img.src = dataURL;
    },
    saveScreenshot() {
      this.$refs.canvas
        .toBlob()
        .then(blob => saveAs(blob, `whiteboard-${this.$route.params.id}.png`));
    },
    resetTimer() {
      this.handleTimerReset(this.timerDuration);
      this.socket.emit("timer", this.timerDuration);
    },
    handleTimerReset(duration) {
      clearTimeout(this.timerTimeout);
      this.timerSeconds = duration;
      this.handleTimerTick();
    },
    handleTimerTick() {
      this.timerTimeout = setTimeout(() => {
        this.timerSeconds--;
        if (this.timerSeconds > 0) this.handleTimerTick();
      }, 1000);
    },
    async updateFavicon() {
      // Load pen paths
      if (typeof window.Path2D === "undefined") return;
      if (iconEraserPath === undefined) {
        iconEraserPath = new Path2D(
          "M26.396 11.106l-2.432 2.43-5.5-5.5 2.43-2.43a2.062 2.062 0 012.918 0l2.584 2.582a2.062 2.062 0 010 2.917z"
        );
      }
      if (iconPenPath === undefined) {
        iconPenPath = new Path2D(
          "M5.552 20.946l-.546 4.908a1.031 1.031 0 001.139 1.138l4.903-.54 11.944-11.945-5.5-5.499z"
        );
      }
      // Clear canvas
      this.iconCtx.clearRect(0, 0, iconCanvasSize, iconCanvasSize);

      // Draw background circle
      this.iconCtx.fillStyle = "rgb(255,255,255)";
      this.iconCtx.beginPath();
      this.iconCtx.arc(
        iconCanvasSize / 2,
        iconCanvasSize / 2,
        iconCanvasSize / 2,
        0,
        2 * Math.PI
      );
      this.iconCtx.fill();

      // Draw eraser
      this.iconCtx.fillStyle = "rgb(0,0,0)";
      this.iconCtx.fill(iconEraserPath);

      // Draw pen in selected colour
      const colour = this.selectedColourRGB;
      this.iconCtx.fillStyle = `rgba(${colour.substring(
        4, // remove "rgb("
        colour.length - 1 // remove ")"
      )},0.4)`;
      this.iconCtx.fill(iconPenPath);

      // Update favicon
      this.iconLink.href = this.iconCtx.canvas.toDataURL("image/png");
    }
  }
};
</script>

<style lang="sass">
.board
  position: relative
  width: 100vw
  height: 100vh
  overflow: hidden
  background-color: #EEEEEE
  .file-input
    opacity: 0
    width: 0
    height: 0
    overflow: hidden
  .overlay
    position: fixed
    z-index: 10
    &.top
      top: 1rem
    &.left
      left: 1rem
    &.bottom
      bottom: 1rem
    &.right
      right: 1rem
    &.center
      top: 50%
      left: 50%
      transform: translate(-50%, -50%)
    &.for-size
      height: 3rem
  .row, .column
    display: flex
    align-items: center
    justify-content: center
  .row
    flex-direction: row
    > *:not(:last-child)
      margin-right: 1rem
  .column
    flex-direction: column
    align-items: flex-start
  .two-column
    display: grid
    grid-gap: 0.75rem
    grid-template-columns: repeat(2, min-content)
    grid-auto-rows: min-content
  .icon-canvas
    position: fixed
    z-index: 500
    top: 200px
    left: 200px
    width: 32px
    height: 32px
    //display: none
  @media(max-width: 700px)
    .mobile-hidden
      display: none
</style>
