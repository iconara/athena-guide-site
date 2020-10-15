<template>
  <default-layout
    :include-logo="false"
    :include-copyright="false"
  >
    <template v-slot:main-header>
      <logo/>
    </template>
    <template v-slot:main-content>
      <div>
        <p>
          Athena is a serverless query service for data on S3, but there is a lot behind that description. Here you will find articles that explain the not so obvious aspects of how to use the service to its full potential, including how and why to partition your data, how to get the best performance, and lowest cost, and how to use it as the engine for your data lake.
        </p>
      </div>
      <h2>Contents</h2>
      <article-list/>
    </template>
  </default-layout>
</template>

<script lang="ts">
import Vue from 'vue'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import Logo from '@/components/Logo.vue'
import ArticleList from '@/components/ArticleList.vue'

export default Vue.extend({
  components: {
    DefaultLayout,
    Logo,
    ArticleList,
  },
  head () {
    return {
      title: 'The Athena Guide',
      titleTemplate: null,
    } as any
  },
})
</script>

<style scoped lang="scss">
.articles {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  line-height: 200%;

  /deep/ .article-link,
  /deep/ .about-link {
    margin: 0;
    margin-right: 0.5em;
    border: none;
  }

  /deep/ .article-link::after {
    content: "/";
    margin-left: 0.5em;
  }
}

@media all and (max-width: 799px) {
  .logo {
    font-size: 2vw;
  }
}
</style>
