<template>
  <div class="row">
    <CircleButton
      icon="random"
      title="Generate Word"
      @click.native="generate"
    />
    <p class="text">{{ word }}</p>
  </div>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import { faRandom } from "@fortawesome/pro-duotone-svg-icons";
import { generateWord } from "pic-word-gen";
import CircleButton from "@/client/components/CircleButton";
library.add(faRandom);

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
