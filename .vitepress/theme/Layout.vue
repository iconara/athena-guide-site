<script setup>
import {useData} from 'vitepress'
import NotFound from './NotFound.vue'
import Article from './Article.vue'
import Frontpage from './Frontpage.vue'

const {page, frontmatter} = useData()
</script>

<template>
  <NotFound v-if="page.isNotFound" />
  <Frontpage v-else-if="frontmatter.layout === 'home'" />
  <Article v-else />
</template>

<style>
body {
  font-family: source-serif-pro, serif;
  font-weight: 400;
  font-style: normal;
  font-feature-settings: "onum";
  margin: 0;
}

a {
  text-decoration: none;
  color: black;
  border-bottom: 1px solid #700;

  &:hover {
    text-decoration: none;
    color: #700;
    border-bottom: 3px solid #700;
  }
}

h1, h2, h3, h4 {
  font-family: source-serif-pro, serif;
  font-weight: 900;
  font-style: normal;
  line-height: 1em;
}

h1 {
  font-size: 3.5rem;
}

h2 {
  font-size: 2rem;
  margin-bottom: 0.33em;
}

h3 {
  font-size: 1.25rem;
}

h4 {
  font-size: 1rem;
}
</style>
