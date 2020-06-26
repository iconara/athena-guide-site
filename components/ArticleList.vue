<template>
  <div class="articles">
    <b-spinner v-if="loading"/>
    <div
      v-for="article in articles"
      v-else
      :key="article.path"
      class="article"
    >
      <span
        v-if="showDates"
        class="date"
        v-text="article.isoDate"
      />
      <nuxt-link
        :to="{name: 'articles-slug', params: {slug: article.slug}}"
        class="title"
        :title="article.preamble"
        v-text="article.title"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    showDates: {
      type: Boolean,
      default: false,
    },
  },
  async fetch () {
    this.loading = true
    try {
      this.articles = await this.$store.dispatch('loadArticles')
    } finally {
      this.loading = false
    }
  },
  data () {
    return {
      loading: false,
      articles: [],
    }
  },
})
</script>

<style scoped lang="scss">
.article {
  margin-bottom: 0.5rem;

  a {
    border: none;
  }
}
</style>
