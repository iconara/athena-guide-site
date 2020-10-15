<template>
  <default-layout
    title="About the Athena Guide"
    :includes-article-list="true"
  >
    <div
      v-if="about"
      class="body"
      v-html="about.body"
    /> <!-- eslint-disable-line vue/no-v-html -->
  </default-layout>
</template>

<script lang="ts">
import Vue from 'vue'
import {Article} from '@/lib/articles'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import ArticleList from '@/components/ArticleList.vue'

export default Vue.extend({
  components: {
    DefaultLayout,
    ArticleList,
  },
  async fetch () {
    const about: Article = await this.$store.dispatch('loadAbout')
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
