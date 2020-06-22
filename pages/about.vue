<template>
  <default-layout>
    <template v-slot:main-header>
      <h1>About the Athena Guide</h1>
    </template>
    <template v-slot:main-content>
      <div v-if="about" v-html="about.body"/> <!-- eslint-disable-line vue/no-v-html -->
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
    const about: Article = await this.$store.dispatch('loadAbout')
    this.about = about
  },
  data () {
    return {
      about: null,
    }
  },
})
</script>
