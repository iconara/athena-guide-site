<template>
  <nav class="articles">
    <div
      v-for="article in articles"
      :key="article.path"
      class="article-link"
    >
      <span>
        <nuxt-link
          :to="{path: `/articles/${article.slug}/`}"
          :title="article.preamble"
          v-text="article.title"/>
        <span
          v-if="includeSubArticles"
          v-text="articleControlText(article)"
          @click="toggleExpansion(article)"
          class="series-toggle"
        />
      </span>
      <div v-if="includeSubArticles && isExpanded(article)">
        <nuxt-link
          v-for="subArticle in article.subArticles"
          :key="subArticle.path"
          :to="{path: `/articles/${subArticle.slug}/`}"
          :title="subArticle.preamble"
          class="sub-article"
          v-text="subArticleTitle(article, subArticle)"
        />
      </div>
    </div>
    <span
      v-if="showAboutLink"
      class="about-link"
    >
      <nuxt-link
        :to="{path: '/about/'}">
        About the Athena Guide
      </nuxt-link>
    </span>
  </nav>
</template>

<script lang="ts">
import Vue from 'vue'
import {Article} from '@/lib/articles'

export default Vue.extend({
  props: {
    showAboutLink: {
      type: Boolean,
      default: true,
    },
    includeSubArticles: {
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
      expandedArticles: <string[]>[],
    }
  },
  methods: {
    articleControlText (article: Article): string {
      if (article.subArticles.length > 0) {
        return this.expandedArticles.includes(article.slug!) ? '−' : '+'
      } else {
        return ''
      }
    },
    toggleExpansion (article: Article): void {
      const key = article.slug!
      const index = this.expandedArticles.indexOf(key)
      if (index === -1) {
        this.expandedArticles.push(key)
      } else {
        this.expandedArticles.splice(index, 1)
      }
    },
    isExpanded (article: Article): boolean {
      return this.expandedArticles.indexOf(article.slug!) > -1
    },
    subArticleTitle (article: Article, subArticle: Article): string {
      if (subArticle.title.startsWith(article.title)) {
        const r = new RegExp(`^${article.title}:\\s+`)
        return subArticle.title.replace(r, '')
      } else {
        return subArticle.title
      }
    },
  },
})
</script>

<style scoped lang="scss">
.article-link,
.about-link {
  display: block;
  margin-bottom: 0.5rem;
  user-select: none;

  a {
    border: none;
  }

  .series-toggle {
    cursor: pointer;
    font-size: 120%;
  }

  .sub-article {
    display: block;
    margin-left: 1em;
  }
}

.about-link {
  margin-top: 1.5rem;
}
</style>
