<script setup>
import {useData} from 'vitepress'
import NotFound from './NotFound.vue'
import Article from './Article.vue'
import Frontpage from './Frontpage.vue'
import Analytics from './Analytics.vue'

const {page, frontmatter} = useData()
</script>

<template>
  <NotFound v-if="page.isNotFound" />
  <Frontpage v-else-if="frontmatter.layout === 'home'" />
  <Article v-else />
  <ClientContent>
    <Analytics/>
  </ClientContent>
</template>
