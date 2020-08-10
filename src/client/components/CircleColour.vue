<template>
  <div
    class="circle-colour"
    :class="{ selected }"
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
  width: 3rem
  height: 3rem
  border-radius: 1.5rem
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)
  border: 0.5rem solid transparent
  transform-origin: center
  transition: border-color 0.05s linear, transform 0.1s ease-out, background-color 0.05s linear
  &.selected
    border-color: rgba(0, 0, 0, 0.25)
</style>
