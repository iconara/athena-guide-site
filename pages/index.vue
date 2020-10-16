<template>
  <div class="front-layout">
    <logo/>
    <p>
      Athena is a serverless query service for data on S3, but there is a lot behind that description. Here you will find articles that explain the not so obvious aspects of how to use the service to its full potential, including how and why to partition your data, how to get the best performance, and lowest cost, and how to use it as the engine for your data lake.
    </p>
    <h2>Contents</h2>
    <article-list :inline="true"/>
  </div>
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
.front-layout {
  display: grid;
  grid-template-columns: 0.85fr 75ch 1.15fr;
  margin: 10rem 5rem 8rem 5rem;

  & > * {
    grid-column: 2;
  }
}

.logo {
  font-size: 110%;
}

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

@media all and (max-width: 959px) {
  .front-layout {
    margin: 10rem 2rem 8rem 1.5rem;
  }

  .logo {
    font-size: 90%;
  }
}

@media all and (max-width: 649px) {
  .front-layout {
    margin-top: 4rem;
    display: block;
  }

  .logo {
    font-size: 50%;
  }

  .articles {
    display: block;

    /deep/ .article-link {
      display: block;
      margin-bottom: 0.5rem;
    }

    /deep/ .about-link {
      display: block;
      margin-top: 1.5rem;
    }

    /deep/ .article-link::after {
      content: "";
    }
  }
}
</style>
