<template>
  <div class="row">
    <CircleButton
      icon="random"
      title="Generate Word"
      @click.native="generate"
    />
    <h4>{{ word }}</h4>
  </div>
</template>

<script>
import { generateWord } from "pic-word-gen";
import CircleButton from "@/client/components/CircleButton";

export default {
  name: "words",
  components: {
    CircleButton
  },
  props: {
    difficulty: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      word: null
    };
  },
  methods: {
    generate() {
      this.word = generateWord(this.difficulty);
    }
  }
};
</script>
