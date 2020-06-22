<template>
  <div class="guides">
    <b-spinner v-if="loading"/>
    <div
      v-for="guide in guides"
      v-else
      :key="guide.path"
      class="guide"
    >
      <span
        v-if="showDates"
        class="date"
        v-text="guide.isoDate"
      />
      <nuxt-link
        :to="{name: 'guides-slug', params: {slug: guide.slug}}"
        class="title"
        v-text="guide.title"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import moment, {Moment} from 'moment'

export default Vue.extend({
  props: {
    guides: {
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
.guide {
  margin-bottom: 0.5rem;

  a {
    border: none;
  }
}
</style>
