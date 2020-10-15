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
          v-text="article.title"
          :class="{'current': isCurrent(article)}"/>
        <span
          v-if="!inline"
          v-text="articleControlText(article)"
          @click="toggleExpansion(article)"
          class="series-toggle"
        />
      </span>
      <div v-if="!inline && isExpanded(article)">
        <nuxt-link
          v-for="child in article.children"
          :key="child.path"
          :to="{path: `/articles/${child.slug}/`}"
          :title="child.preamble"
          :class="{'child': true, 'current': isCurrent(article, child)}"
          v-text="childTitle(article, child)"
        />
      </div>
    </div>
    <span class="about-link">
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
    inline: {
      type: Boolean,
      default: false,
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
      if (article.children.length > 0) {
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
      const slug = this.$route.params.slug
      return this.expandedArticles.indexOf(article.slug!) > -1 || article.children.some((a) => a.slug === slug)
    },
    childTitle (article: Article, child: Article): string {
      if (child.title.startsWith(article.title)) {
        const r = new RegExp(`^${article.title}:\\s+`)
        return child.title.replace(r, '')
      } else {
        return child.title
      }
    },
    isCurrent (article: Article, child?: Article): boolean {
      const slug = this.$route.params.slug
      if (child) {
        return child.slug === slug
      } else {
        return article.slug === slug || article.children.some((a) => a.slug === slug)
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

  .child {
    display: block;
    margin-left: 1em;

    &.current {
      margin-left: 0.2em;
    }
  }

  .current {
    margin-left: -0.8em;
  }

  .current::before {
    content: "> ";
  }
}

.about-link {
  margin-top: 1.5rem;
}
</style>
