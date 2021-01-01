<template>
  <div>
    <CircleButton
      icon="info-circle"
      title="Information"
      @click.native="shown = true"
    />
    <transition>
      <div v-if="shown" class="metadata-dialog" @click="shown = false">
        <div @click.stop>
          <p>
            Developed by
            <a href="https://github.com/mrbbot">Brendan Coll</a>
          </p>
          <p>
            Whiteboard is currently a free service.<br />
            Unfortunately, server hosting is not.<br />
            If you find it useful or fun, consider buying me a coffee to support
            ongoing development.
          </p>
          <p>
            <a
              href="https://www.buymeacoffee.com/mrbbot"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="../assets/bmc.svg"
                width="136"
                height="38"
                alt="Buy Me A Coffee"
              />
            </a>
          </p>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import CircleButton from "@/client/components/CircleButton";

export default {
  name: "metadata",
  components: {
    CircleButton
  },
  data() {
    return {
      shown: false
    };
  }
};
</script>

<style lang="sass">
.metadata-dialog
  position: fixed
  z-index: 20
  top: 0
  left: 0
  bottom: 0
  right: 0
  padding: 1rem
  background-color: rgba(0, 0, 0, 0.5)
  display: flex
  align-items: center
  justify-content: center
  transition: opacity 300ms ease
  cursor: pointer
  div
    width: 100%
    max-width: 25rem
    margin: 0 auto
    padding: 2rem
    background-color: white
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)
    transition: transform 300ms ease
    text-align: center
    cursor: auto
    > p
      line-height: 1.5
      a
        color: inherit
      &:first-child
        margin-top: 0
      &:last-child
        margin-bottom: 0
  &.v-enter, &.v-leave-to
    opacity: 0
    div
      transform: scale(0.5)
</style>
