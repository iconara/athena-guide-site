<template>
  <default-layout
    title="About the Athena Guide"
  >
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div v-if="about" class="body" v-html="about.body"/>
  </default-layout>
</template>

<script lang="ts">
import Vue from 'vue'
import {Article} from '@/lib/articles'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'

export default Vue.extend({
  components: {
    DefaultLayout,
  },
  async fetch () {
    const about: Article = await this.$store.dispatch('articles/loadAbout')
    this.about = about
  },
  data () {
    return {
      about: null as unknown as Article,
    }
  },
  head () {
    return {
      title: 'About',
    }
  },
})
</script>
