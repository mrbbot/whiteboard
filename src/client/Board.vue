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
        :colour="selectedColourRGB"
        :selected="touchEnabled"
        @click.native="touchEnabled = !touchEnabled"
      />
      <CircleButton
        icon="cloud-upload-alt"
        title="Upload Image"
        :colour="selectedColourRGB"
        @click.native="openImageFileDialog"
      />
      <CircleButton
        v-if="enableScreenshots"
        icon="camera"
        title="Save Screenshot"
        swap-colours
        :colour="selectedColourRGB"
        @click.native="saveScreenshot"
      />
    </div>
    <div class="overlay bottom right row for-size" :title="'Size ' + rawSize">
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

export default {
  name: "board",
  components: { Drop, CircleButton, CircleColour, BoardCanvas },
  data() {
    return {
      eraser: false,
      touchEnabled: true,
      rawSize: "16",
      selectedColour: colours[0],
      colours,
      rect: null
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
    }
  },
  mounted() {
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
      });
    });
    this.socket.on("draw", e => {
      const drawEvent = DrawEvent.decode(new Uint8Array(e));
      this.$refs.canvas.handleDrawEvent(drawEvent);
    });
    this.socket.on("image", e => {
      this.drawImage(e);
    });
    this.socket.on("clear", () => this.$refs.canvas.clear());
  },
  beforeDestroy() {
    this.socket.disconnect();
  },
  methods: {
    colourToRGB,
    selectColour(colour) {
      this.eraser = false;
      this.selectedColour = colour;
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
    display: flex
    align-items: center
    justify-content: center
    &.top
      top: 1rem
    &.left
      left: 1rem
    &.bottom
      bottom: 1rem
    &.right
      right: 1rem
    &.row
      flex-direction: row
      > *:not(:last-child)
        margin-right: 1rem
    &.column
      flex-direction: column
      > *:not(:last-child)
        margin-bottom: 1rem
    &.two-column
      display: grid
      grid-gap: 0.75rem
      grid-template-columns: repeat(2, min-content)
      grid-auto-rows: min-content
    &.for-size
      height: 3rem
</style>
