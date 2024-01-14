<script setup>
import Logo from './Logo.vue'
import ArticleList from './ArticleList.vue'
</script>

<template>
  <Logo :multiline="false" :tagline="true" :backlink="null"/>
  <p class="intro">
    Athena is a serverless query service for data on S3, but there is a lot behind that description. Here you will find articles that explain the not so obvious aspects of how to use the service to its full potential, including how and why to partition your data, how to get the best performance, and lowest cost, and how to use it as the engine for your data lake.
  </p>
  <div class="contents">
    <h2>Contents</h2>
    <ArticleList :inline="true"/>
  </div>
</template>

<style scoped>
.logo {
  font-size: 110%;
  margin-top: 10em;
  grid-column: 2 / 3;
  grid-row: 1;
}

.intro {
  grid-column: 2;
  grid-row: 2;
}

.contents {
  grid-column: 2;
  grid-row: 3;
}

@media all and (max-width: 959px) {
  .logo {
    font-size: 80%;
  }
}

@media all and (max-width: 649px) {
  .logo {
    font-size: 50%;
  }
}
</style>
