<template>
  <default-layout :logo="false">
    <template v-slot:main-header>
      <logo/>
    </template>
    <template v-slot:main-content>
      <div>
        <p>
          Athena is a serverless query service for data on S3, but there is a lot behind that description. This guide explains the not so obvious aspects of how to use the service to its full potential, including how and why to partition your data, how to get the best performance, and lowest cost, and how to use it as the engine of your data lake.
        </p>
        <p>
          The guide also covers practical things like how to build your own security monitoring with Athena and CloudTrail, and use it get deeper insight into your AWS bill than what Cost Explorer provides.
        </p>
      </div>
    </template>
    <template v-slot:sidebar-header>
      <h2>Latest guides</h2>
    </template>
    <template v-slot:sidebar-content>
      <div>
        <guide-list
          :guides="guides"
          :loading="loading"
          :show-dates="true"
        />
        <div v-if="hasMoreGuides" class="more-guides">
          <nuxt-link :to="{name: 'guides'}">
            More
          </nuxt-link>
        </div>
      </div>
    </template>
  </default-layout>
</template>

<script lang="ts">
import Vue from 'vue'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import Logo from '@/components/Logo.vue'
import GuideList from '@/components/GuideList.vue'

export default Vue.extend({
  components: {
    DefaultLayout,
    Logo,
    GuideList,
  },
  async fetch () {
    this.loading = true
    try {
      const guides = await this.$store.dispatch('loadGuides')
      this.hasMoreGuides = guides.length > 5
      this.guides = guides.slice(0, 5)
    } finally {
      this.loading = false
    }
  },
  data () {
    return {
      loading: false,
      guides: [],
      hasMoreGuides: false,
    }
  },
})
</script>

<style scoped lang="scss">
.more-guides {
  display: block;
  margin-top: 0.5rem;
}

@media all and (max-width: 799px) {
  .logo {
    font-size: 60%;
  }
}
</style>
