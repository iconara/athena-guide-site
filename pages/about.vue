<template>
  <default-layout
    :includes-article-list="true"
  >
    <template v-slot:main-header>
      <h1>About the Athena Guide</h1>
    </template>
    <template v-slot:main-content>
      <div
        v-if="about"
        class="body"
        v-html="about.body"
      /> <!-- eslint-disable-line vue/no-v-html -->
    </template>
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
