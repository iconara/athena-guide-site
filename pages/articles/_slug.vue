<template>
  <default-layout
    :copyright-year="copyrightYear"
  >
    <template v-slot:main-header>
      <h1>
        {{title}}
      </h1>
    </template>
    <template v-slot:main-content>
      <div class="article">
        <div class="meta">
          <div class="date" v-text="displayDate"/>
          <div v-if="author" class="author">
            by <span class="name">{{author}}</span>
          </div>
        </div>
        <div class="body" v-html="body"/> <!-- eslint-disable-line vue/no-v-html -->
      </div>
    </template>
  </default-layout>
</template>

<script lang="ts">
import Vue from 'vue'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import {Article} from '@/lib/articles'

export default Vue.extend({
  components: {
    DefaultLayout,
  },
  async fetch () {
    const article: Article = await this.$store.dispatch('loadArticle', this.$route.params.slug)
    this.title = article.title
    this.author = article.author
    this.displayDate = article.isoDate
    this.copyrightYear = article.copyrightYear
    this.body = article.body
    this.preamble = article.preamble
  },
  data () {
    return {
      copyrightYear: null as unknown as number,
      title: '',
      author: undefined as unknown as string | undefined,
      displayDate: '',
      body: '',
      preamble: '',
    }
  },
  head () {
    return {
      title: `${this.title} | The Athena Guide`,
      meta: [
        {hid: 'description', name: 'description', content: this.preamble},
      ],
    }
  },
})
</script>

<style scoped lang="scss">
.article {
  .meta {
    margin-bottom: 0.5rem;

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
}
</style>

<style lang="scss">
.article {
  .body {
    pre {
      width: 125%;
      padding: 0.5rem;
      margin-left: -0.5rem;
    }
  }
}
</style>
