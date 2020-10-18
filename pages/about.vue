<template>
  <default-layout
    title="About the Athena Guide"
  >
    <nuxt-content :document="article"/>
  </default-layout>
</template>

<script lang="ts">
import Vue from 'vue'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'

export default Vue.extend({
  components: {
    DefaultLayout,
  },
  async asyncData ({$content}) {
    return {
      article: await $content('about').fetch(),
    }
  },
  head () {
    return {
      title: 'About',
    }
  },
})
</script>
