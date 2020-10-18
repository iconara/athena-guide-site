<template>
  <default-layout
    :title="article.title"
    :copyright-year="copyrightYear"
  >
    <div class="meta">
      <div class="date" v-text="displayDate"/>
      <div v-if="article.author" class="author">
        by <span class="name" v-text="article.author"/>
      </div>
    </div>
    <nuxt-content :document="article"/>
  </default-layout>
</template>

<script lang="ts">
import Vue from 'vue'
import {MetaInfo} from 'vue-meta'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import {Article, loadArticle} from '~/lib/articles'

export default Vue.extend({
  components: {
    DefaultLayout,
  },
  async asyncData ({$content, params}) {
    return {
      article: await loadArticle($content, params.slug),
    }
  },
  data () {
    return {
      article: null as unknown as Article,
    }
  },
  computed: {
    displayDate (): string | undefined {
      return this.article.date
    },
    copyrightYear (): number | undefined {
      if (this.article.date) {
        return parseInt(this.article.date.substring(0, 4))
      } else {
        return undefined
      }
    },
  },
  head (): MetaInfo {
    return {
      title: this.article.title,
      meta: [
        {hid: 'description', name: 'description', content: this.article?.preamble || ''},
      ],
      link: [
        {hid: 'canonical', rel: 'canonical', href: `${process.env.baseUrl}/articles/${this.article.slug}/`},
      ],
    }
  },
})
</script>

<style scoped lang="scss">
.meta {
  margin-bottom: 1em;

  .date {
    display: inline;
  }

  .author {
    display: inline;

    .name {
      font-style: italic;
    }
  }
}
</style>
