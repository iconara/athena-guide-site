<script setup>
const props = defineProps({
  tagline: {type: Boolean, default: false},
  multiline: {type: Boolean, default: true},
  backlink: {type: String, default: '/about'},
})

function click() {
  // ?
}
</script>

<template>
  <div class="logo">
    <h1 @click="click()" :style="{'text-align': (multiline ? 'center' : 'left'), 'cursor': (backlink !== null ? 'pointer' : 'auto')}">
      <span class="the">The</span>
      Athena<br v-if="multiline"><span v-else class="space"/>Guide
    </h1>
    <h2 v-if="tagline">
      An in-depth guide to <a href="https://aws.amazon.com/athena/">Amazon Athena</a>.
    </h2>
  </div>
</template>

<style scoped>
h1 {
  font-size: 700%;
  line-height: 0.8em;
  margin-bottom: -0.1em;
  position: relative;
  left: -0.2em;
  user-select: none;
  white-space: nowrap;
}

h1 .the {
  font-size: 50%;
  position: absolute;
  top: -0.9em;
  left: 2.8em;
}

h1 .space {
  display: inline-block;
  width: 0.7rem;
}

h2 {
  font-size: 200%;
  margin-top: 0.3em;
  font-weight: 500;
  font-style: italic;
  position: relative;
  white-space: nowrap;
}

a {
  border: none;
}
</style>
