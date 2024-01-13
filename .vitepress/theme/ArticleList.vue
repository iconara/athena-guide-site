<script setup lang="ts">
import {useRoute} from 'vitepress'
import {ref} from 'vue'
import {data as articles, type Article} from './articles.data'

const {inline} = defineProps({
  inline: {type: Boolean, default: false},
})

const route = useRoute()
const expandedArticles = ref(new Set<Article>())

function isCurrent(article: {url: Article['url']}): Boolean {
  return article.url === route.path
}

function isCurrentOrChildIsCurrent(article: Article): Boolean {
  return isCurrent(article) || article.children.some(isCurrent)
}

function hasChildren(article: Article): Boolean {
  return article.children.length > 0
}

function isExpanded(article: Article): Boolean {
  return expandedArticles.value.has(article) || isCurrentOrChildIsCurrent(article)
}

function toggleExpansion(article: Article): void {
  if (expandedArticles.value.has(article)) {
    expandedArticles.value.delete(article)
  } else {
    expandedArticles.value.add(article)
  }
}
</script>

<template>
  <nav :class="{'article-list': true, 'inline': inline}">
    <div
      v-for="article in articles"
      :key="article.url"
      class="article-link"
    >
      <span>
        <a
          :href="article.url"
          :title="article.title"
          :class="{'current': isCurrent(article)}"
          >{{article.title}}</a>
        <span
          v-if="!inline && hasChildren(article) && !isExpanded(article)"
          :class="{'series-toggle': true, 'current': isCurrent(article)}"
          @click="toggleExpansion(article)"
          >+</span>
        <span
          v-if="!inline && hasChildren(article) && !isCurrentOrChildIsCurrent(article) && isExpanded(article)"
          :class="{'series-toggle': true, 'current': isCurrent(article)}"
          @click="toggleExpansion(article)"
          >–</span>
      </span>
      <div v-if="!inline && isExpanded(article)">
        <a
          v-for="child in article.children"
          :key="child.url"
          :href="child.url"
          :title="child.title"
          :class="{'child': true, 'current': isCurrent(child)}"
          >{{child.title}}</a>
      </div>
    </div>
    <span class="about-link">
      <a
        href="/about.html"
        :class="{'current': isCurrent({url: '/about.html'})}"
        >About the Athena Guide</a>
    </span>
  </nav>
</template>

<style scoped>
.article-list {
  display: flex;
  flex-direction: column;
}

.article-list.inline {
  flex-direction: row;
  flex-wrap: wrap;
}

.article-list.inline .article-link::after {
  content: "/";
  margin-left: 0.5em;
  margin-bottom: 0;
}

.article-list.inline .about-link {
  margin-top: 0;
}

.article-link,
.about-link {
  display: block;
  margin-bottom: 0.5rem;
  margin: 0;
  margin-right: 0.5em;
  margin-bottom: 0.5em;
}

.article-link a,
.about-link a {
  border: none;
}

.about-link {
  margin-top: 1.5em;
}

.article-link .series-toggle {
  cursor: pointer;
  margin-left: 0.2em;
  font-size: 120%;
  line-height: 80%;
}

.article-link .series-toggle.current {
  display: none;
}

.article-link .child {
  display: block;
  margin-left: 1em;
}

.article-link .child.current {
  margin-left: 0.25em;
}

.article-link .current,
.about-link .current {
  margin-left: -0.75em;
}

.article-link .current::before,
.about-link .current::before {
  content: "> ";
}
</style>
