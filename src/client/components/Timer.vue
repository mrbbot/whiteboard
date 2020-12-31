<template>
  <div class="row">
    <CircleButton icon="undo" title="Reset Timer" @click.native="reset" />
    <p class="text">{{ time }}</p>
  </div>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import { faUndo } from "@fortawesome/pro-duotone-svg-icons";
import CircleButton from "@/client/components/CircleButton";
library.add(faUndo);

export default {
  name: "timer",
  components: {
    CircleButton
  },
  props: {
    seconds: {
      type: Number,
      required: true
    }
  },
  computed: {
    time() {
      return `${Math.floor(this.seconds / 60)
        .toString()
        .padStart(2, "0")}:${(this.seconds % 60).toString().padStart(2, "0")}`;
    }
  },
  methods: {
    reset() {
      this.$emit("reset");
    }
  }
};
</script>
