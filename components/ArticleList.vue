<template>
  <div class="articles">
    <div
      v-for="article in articles"
      :key="article.path"
      class="article"
    >
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
  async fetch () {
    this.articles = await this.$store.dispatch('loadArticles')
  },
  data () {
    return {
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
