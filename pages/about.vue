<template>
  <default-layout title="About the Athena Guide">
    <nuxt-content :document="article"/>
  </default-layout>
</template>

<script lang="ts">
import Vue from 'vue'
import {MetaInfo} from 'vue-meta'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import {loadAbout} from '~/lib/articles'

export default Vue.extend({
  components: {
    DefaultLayout,
  },
  async asyncData ({$content}) {
    return {
      article: await loadAbout($content),
    }
  },
  head (): MetaInfo {
    return {
      title: 'About',
    }
  },
})
</script>
