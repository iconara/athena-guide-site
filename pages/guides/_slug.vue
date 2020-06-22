<template>
  <default-layout>
    <template v-slot:main-header>
      <h1>
        {{title}}
      </h1>
    </template>
    <template v-slot:main-content>
      <div class="guide">
        <div class="meta">
          <div class="date" v-text="date"/>
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
import moment, {Moment} from 'moment'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import {Guide} from '@/lib/guides'

export default Vue.extend({
  components: {
    DefaultLayout,
  },
  async fetch () {
    const guide: Guide = await this.$store.dispatch('loadGuide', this.$route.params.slug)
    this.title = guide.title
    this.author = guide.author
    this.date = guide.isoDate
    this.body = guide.body
  },
  data () {
    return {
      title: '',
      author: undefined as unknown as string | undefined,
      date: '',
      body: '',
    }
  },
})
</script>

<style scoped lang="scss">
.guide {
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
