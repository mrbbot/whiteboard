<template>
  <div
    class="circle-colour"
    :class="{ selected, 'selected-invert': colour === 'rgb(0,0,0)' }"
    :style="{ backgroundColor: colour }"
  ></div>
</template>

<script>
export default {
  name: "circle-colour",
  props: {
    colour: {
      type: String,
      required: true
    },
    selected: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang="sass">
.circle-colour
  width: 2.5rem
  height: 2.5rem
  border-radius: 1.5rem
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)
  border: 0.5rem solid transparent
  transform-origin: center
  transition: border-color 0.05s linear, transform 0.1s ease-out, background-color 0.05s linear
  cursor: pointer
  &.selected
    border-color: rgba(0, 0, 0, 0.25)
    &.selected-invert
      border-color: rgba(255, 255, 255, 0.25)
</style>
