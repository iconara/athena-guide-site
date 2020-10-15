<template>
  <default-layout
    :title="title"
    :copyright-year="copyrightYear"
    :includes-article-list="true"
  >
    <div class="meta">
      <div class="date" v-text="displayDate"/>
      <div v-if="author" class="author">
        by <span class="name">{{author}}</span>
      </div>
    </div>
    <div
      v-if="body"
      class="body"
      v-html="body"
    /> <!-- eslint-disable-line vue/no-v-html -->
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
    this.loading = true
    try {
      const article = <Article>(await this.$store.dispatch('loadArticle', this.$route.params.slug))
      this.title = article.title
      this.author = article.author
      this.displayDate = article.isoDate
      this.copyrightYear = article.copyrightYear || (new Date()).getUTCFullYear()
      this.body = article.body
      this.preamble = article.preamble
    } finally {
      this.loading = false
    }
  },
  data () {
    return {
      copyrightYear: null as unknown as number,
      title: '',
      author: undefined as unknown as string | undefined,
      displayDate: '' as string | null,
      body: '',
      preamble: '',
      loading: false,
    }
  },
  head () {
    return {
      title: (this as any).title,
      meta: [
        {hid: 'description', name: 'description', content: (this as any).preamble},
      ],
      link: [
        {hid: 'canonical', rel: 'canonical', href: `${process.env.baseUrl}/articles/${this.$route.params.slug}/`},
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
