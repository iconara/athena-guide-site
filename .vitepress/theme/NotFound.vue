<script setup lang="ts">
import Logo from './Logo.vue'
import ArticleList from './ArticleList.vue'
</script>

<template>
  <nav class="top">
    <Logo/>
  </nav>
  <h1>Not found</h1>
  <article>
    <p>
      The page you're looking for doesn't seem to be here. Try one of these pages instead:
    </p>
    <ArticleList :inline="true"/>
  </article>
</template>

<style scoped>
h1 {
  grid-column: 2 / 4;
  grid-row: 2;
  margin-top: 1em;
  margin-bottom: 1em;
}

article {
  grid-column: 2;
  grid-row: 3;
}

article > p {
  margin-bottom: 2em;
}

nav.top {
  grid-column: 3;
  grid-row: 1;
  margin-bottom: 6rem;
  display: flex;
  flex-direction: row;
}

nav.top .logo {
  display: block;
  font-size: 6px;
}
</style>
