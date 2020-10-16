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
          :class="{'current': isCurrent(article)}"
          v-text="article.title"
        />
        <span
          v-if="!inline && hasChildren(article)"
          :class="{'series-toggle': true, 'current': isCurrent(article)}"
          @click="toggleExpansion(article)"
          v-text="articleControlText(article)"
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
        :to="{path: '/about/'}"
        :class="{'current': isAboutCurrent()}"
      >
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
      expandedArticles: [] as string[],
    }
  },
  methods: {
    articleControlText (article: Article): string {
      return this.expandedArticles.includes(article.slug!) ? '−' : '+'
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
    hasChildren (article: Article): boolean {
      return article.children.length > 0
    },
    isExpanded (article: Article): boolean {
      return this.isCurrent(article) || this.expandedArticles.includes(article.slug)
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
    isAboutCurrent (): boolean {
      return this.$route.name === 'about'
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
    line-height: 80%;

    &.current {
      display: none;
    }
  }

  .child {
    display: block;
    margin-left: 1em;

    &.current {
      margin-left: 0.25em;
    }
  }

  .current {
    margin-left: -0.75em;
  }

  .current::before {
    content: "> ";
  }
}

.about-link {
  margin-top: 1.5rem;
}
</style>
