<template>
  <default-layout>
    <template v-slot:main-header>
      <h1>The Athena Guide</h1>
    </template>
    <template v-slot:main-content>
      <div class="guides">
        <p>
          Welcome to the Athena Guide.
        </p>
        <div
          v-for="guide in guides"
          :key="guide.path"
          class="guide"
        >
          <nuxt-link :to="{name: 'guides-slug', params: {slug: guide.slug}}">
            <h2 v-text="guide.title"/>
          </nuxt-link>
          <p v-text="guide.preamble"/>
          <nuxt-link :to="{name: 'guides-slug', params: {slug: guide.slug}}">
            Read more
          </nuxt-link>
        </div>
      </div>
    </template>
    <template v-slot:sidebar-header>
      &nbsp;
    </template>
    <template v-slot:sidebar-content>
      &nbsp;
    </template>
  </default-layout>
</template>

<script lang="ts">
import Vue from 'vue'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'

export default Vue.extend({
  components: {
    DefaultLayout,
  },
  async fetch () {
    this.guides = await this.$store.dispatch('loadGuides')
  },
  data () {
    return {
      guides: [],
    }
  },
})
</script>

<style lang="scss" scoped>
.guides {
  .guide {
    margin-bottom: 2rem;
  }
}
</style>
