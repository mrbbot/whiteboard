<template>
  <canvas
    ref="canvas"
    :width="canvasSize"
    :height="canvasSize"
    :style="{ transform: `scale(${zoom})` }"
    @touchmove.prevent
    @pointerenter.prevent="handlePointerDown"
    @pointerdown.prevent="handlePointerDown"
    @pointermove.prevent="handlePointerMove"
    @pointerup.prevent="handlePointerUp"
    @pointerleave.prevent="handlePointerUp"
  ></canvas>
</template>

<script>
import _throttle from "lodash/throttle";
import { DrawEvent } from "../../common/proto";
import {
  canvasSize,
  setup,
  handleDrawEvent,
  drawImage,
  clear
} from "../../common/drawing";

export default {
  name: "board-canvas",
  props: {
    colour: {
      type: Number,
      default: 0
    },
    eraser: {
      type: Boolean,
      default: false
    },
    touchEnabled: {
      type: Boolean,
      default: true
    },
    size: {
      type: Number,
      default: 20
    }
  },
  data() {
    return {
      canvasSize,
      zoom: 1
    };
  },
  created() {
    this.throttledHandlePointerMove = _throttle(this._handlePointerMove, 10);
  },
  mounted() {
    this.handleResize();
    window.addEventListener("resize", this.handleResize);
    window.addEventListener("wheel", this.handleWheel);
    this.ctx = this.$refs.canvas.getContext("2d");
    setup(this.ctx);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize);
    window.removeEventListener("wheel", this.handleWheel);
  },
  methods: {
    handleResize() {
      this.rect = this.$refs.canvas.getBoundingClientRect();
      this.$emit("rect", this.rect);
    },
    canvasCoords(x, y) {
      return {
        x: ((x - this.rect.left) / this.rect.width) * this.canvasSize,
        y: ((y - this.rect.top) / this.rect.height) * this.canvasSize
      };
    },
    handlePointerDown(e) {
      this.previousCenter = this.canvasCoords(e.clientX, e.clientY);
      this.throttledHandlePointerMove(e);
    },
    handlePointerMove(e) {
      this.throttledHandlePointerMove(e);
    },
    _handlePointerMove(e) {
      if (e.pointerType === "pen") {
        this.$emit("pen");
      }
      if (
        e.buttons === 0 ||
        (e.pointerType === "touch" && !this.touchEnabled) ||
        !this.previousCenter
      ) {
        return;
      }
      const center = this.canvasCoords(e.clientX, e.clientY);
      const drawEvent = new DrawEvent();
      const eraser = this.eraser || e.buttons === 32;
      drawEvent.x1 = this.previousCenter.x;
      drawEvent.y1 = this.previousCenter.y;
      drawEvent.x2 = center.x;
      drawEvent.y2 = center.y;
      drawEvent.thickness =
        (eraser ? 2 : 1) *
        (e.pointerType === "pen" && !eraser ? e.pressure : 1) *
        this.size;
      drawEvent.colour = eraser ? -1 : this.colour;
      this.handleDrawEvent(drawEvent);
      this.$emit("draw", drawEvent);
      this.previousCenter = center;
    },
    handleDrawEvent(e) {
      handleDrawEvent(this.ctx, e);
    },
    handlePointerUp() {
      this.previousCenter = undefined;
    },
    handleWheel(e) {
      this.zoom = Math.max(0.5, Math.min(1, this.zoom + e.deltaY / 20));
      requestAnimationFrame(() => {
        requestAnimationFrame(this.handleResize);
      });
    },
    drawImage(img, fit = false) {
      drawImage(this.ctx, img, fit);
    },
    clear() {
      clear(this.ctx);
    },
    toBlob() {
      return new Promise(resolve => this.$refs.canvas.toBlob(resolve));
    }
  }
};
</script>

<style lang="sass">
canvas
  position: absolute
  top: 50%
  left: 50%
  margin-left: -50vmax
  margin-top: -50vmax
  width: 100vmax
  height: 100vmax
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)
</style>
