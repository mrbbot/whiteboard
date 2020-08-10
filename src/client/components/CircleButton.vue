<template>
  <div class="circle-button" :class="{ selected }" :style="styles">
    <FontAwesomeIcon
      :icon="['fad', icon]"
      fixed-width
      size="lg"
      :swap-opacity="swapColours"
    />
  </div>
</template>

<script>
export default {
  name: "circle-button",
  props: {
    icon: {
      type: String,
      required: true
    },
    colour: {
      type: String,
      default: ""
    },
    selected: {
      type: Boolean,
      default: false
    },
    swapColours: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    styles() {
      return this.selected
        ? {
            ["--fa-" +
            (this.swapColours ? "primary" : "secondary") +
            "-color"]: this.colour
          }
        : {};
    }
  }
};
</script>

<style lang="sass">
.circle-button
  width: 3rem
  height: 3rem
  border-radius: 1.5rem
  display: flex
  align-items: center
  justify-content: center
  background-color: transparent
  transition: background-color 0.05s linear
  &:hover
    background-color: rgba(0, 0, 0, 0.075)
  .fa-primary, .fa-secondary
    transition: fill 0.05s linear
</style>
