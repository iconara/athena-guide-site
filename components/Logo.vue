<template>
  <div class="logo">
    <h1 :style="{'text-align': (multiline ? 'center' : 'left'), 'cursor': (backlink ? 'pointer' : 'auto')}" @click="onClick">
      <span class="the">The</span>
      Athena<br v-if="multiline">
      Guide
    </h1>
    <h2 v-if="tagline">
      An in-depth guide to <a href="https://aws.amazon.com/athena/">Amazon Athena</a>.
    </h2>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    tagline: {
      type: Boolean,
      default: true,
    },
    multiline: {
      type: Boolean,
      default: false,
    },
    backlink: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    onClick () {
      if (this.backlink) {
        this.$router.push('/')
      }
    },
  },
})
</script>

<style lang="scss" scoped>
h1 {
  font-size: 700%;
  line-height: 0.8em;
  margin-bottom: -0.1em;
  position: relative;
  left: -0.2em;
  user-select: none;

  .the {
    font-size: 50%;
    position: absolute;
    top: -0.9em;
    left: 2.8em;
  }
}

h2 {
  font-size: 200%;
  margin-top: 0.2em;
  font-weight: 500;
  font-style: italic;
  position: relative;
}

a {
  border: none;
}
</style>
