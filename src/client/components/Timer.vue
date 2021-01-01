<template>
  <div class="row">
    <CircleButton icon="undo" title="Reset Timer" @click.native="reset" />
    <h4>{{ time }}</h4>
  </div>
</template>

<script>
import CircleButton from "@/client/components/CircleButton";

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
