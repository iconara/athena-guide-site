<template>
  <div class="articles">
    <nuxt-link
      v-for="article in articles"
      :key="article.path"
      :to="{name: 'articles-slug', params: {slug: article.slug}}"
      class="article-link"
      :title="article.preamble"
      v-text="article.title"
    />
    <nuxt-link
      v-if="showAboutLink"
      :to="{name: 'about'}"
      class="about-link"
    >
      About the Athena Guide
    </nuxt-link>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    showAboutLink: {
      type: Boolean,
      default: true,
    },
  },
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
.article-link,
.about-link {
  display: block;
  margin-bottom: 0.5rem;
  border: none;
}

.about-link {
  margin-top: 1.5rem;
}
</style>
