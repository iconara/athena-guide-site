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
import moment, {Moment} from 'moment'

export default Vue.extend({
  props: {
    articles: {
      type: Array,
      default () { return [] },
    },
    loading: {
      type: Boolean,
      default: true,
    },
    showDates: {
      type: Boolean,
      default: false,
    },
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
