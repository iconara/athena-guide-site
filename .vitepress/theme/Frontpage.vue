<script setup>
import Logo from './Logo.vue'
import ArticleList from './ArticleList.vue'
</script>

<template>
  <div class="front-layout">
    <Logo :multiline="false" :tagline="true" :backlink="null"/>
    <p>
      Athena is a serverless query service for data on S3, but there is a lot behind that description. Here you will find articles that explain the not so obvious aspects of how to use the service to its full potential, including how and why to partition your data, how to get the best performance, and lowest cost, and how to use it as the engine for your data lake.
    </p>
    <h2>Contents</h2>
    <ArticleList :inline="true"/>
  </div>
</template>

<style scoped>
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
}
</style>
