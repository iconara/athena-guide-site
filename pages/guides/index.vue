<template>
  <default-layout>
    <template v-slot:main-header>
      <h1>The Athena Guide</h1>
    </template>
    <template v-slot:main-content>
      <div v-html="intro"/> <!-- eslint-disable-line vue/no-v-html -->
    </template>
  </default-layout>
</template>

<script lang="ts">
import Vue from 'vue'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'

export default Vue.extend({
  components: {
    DefaultLayout,
  },
  async fetch () {
    this.intro = await this.$store.dispatch('loadIntro')
    this.guides = await this.$store.dispatch('loadGuides')
  },
  data () {
    return {
      intro: '',
      guides: [],
    }
  },
})
</script>

<style lang="scss" scoped>
.guides {
  .guide {
    margin-bottom: 2rem;
  }
}
</style>
