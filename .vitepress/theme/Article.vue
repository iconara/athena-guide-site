<script setup>
import {useData} from 'vitepress'
import Logo from './Logo.vue'
import ArticleList from './ArticleList.vue'

const {frontmatter} = useData()
</script>

<template>
  <div class="article-layout">
    <nav class="top">
      <Logo/>
    </nav>
    <h1>{{frontmatter.title}}</h1>
    <article>
      <div class="meta">
        <div v-if="frontmatter.date" class="date" v-text="frontmatter.date"/>
        <div v-if="frontmatter.author" class="author">
          by <span class="name" v-text="frontmatter.author"/>
        </div>
      </div>
      <Content/>
    </article>
    <nav class="sidebar">
      <h2>All articles</h2>
      <ArticleList/>
    </nav>
    <footer>
      &copy; {{frontmatter.date}} <a href="https://iconara.net/">Theo Tolv</a>, all rights reserved
      –
      <a href="/legal.html">Legal</a>
    </footer>
  </div>
</template>

<style scoped>
.article-layout {
  display: grid;
  grid-template-rows: auto 1fr auto;
  grid-template-columns: 1fr minmax(55ch, 75ch) 40ch 1fr;
  row-gap: 1rem;
  column-gap: 10ch;
  margin: 5rem 5rem 8rem 5rem;
}

h1 {
  grid-column: 2 / 4;
  grid-row: 2;
  margin-top: 1em;
  margin-bottom: 1em;
}

.meta {
  margin-bottom: 1em;
}

.meta .date {
  display: inline;
}

.meta .author {
  display: inline;
}

.meta .author .name {
  font-style: italic;
}

article {
  grid-column: 2;
  grid-row: 3;
}

article :deep(h1) {
  display: none;
}

article h2:first-child {
  margin-top: 0;
}

nav.top {
  grid-column: 3;
  grid-row: 1;
  margin-bottom: 6rem;
  display: flex;
  flex-direction: row;
}

nav.top .toggle,
nav.top .article-list {
  display: none;
}

nav.top .logo {
  display: block;
  font-size: 6px;
}

footer {
  grid-column: 2 / 4;
  grid-row: 4;
  margin-top: 2rem;
}

nav.sidebar {
  grid-column: 3;
  grid-row: 3;
}

nav.sidebar h2 {
  margin-top: 0;
  margin-bottom: 0.6em;
}

@media all and (max-width: 959px) {
  .article-layout {
    display: flex;
    flex-direction: column;
  }

  nav.top {
    position: relative;
  }

  nav.top .toggle {
    display: block;
    cursor: pointer;
    user-select: none;
    margin-top: 1.5rem;
    width: 0rem;
    flex-shrink: 0;
    flex-grow: 0;
    font-size: 300%;
  }

  nav.top .article-list {
    display: block;
    visibility: hidden;
    height: 1px;
    position: relative;
    left: 0em;
    top: 5rem;
    flex-shrink: 1;
    flex-grow: 1;
  }

  nav.top .article-list.open {
    visibility: visible;
    height: auto;
  }

  nav.top .logo {
    width: 9rem;
  }
  .main-header {
    align-self: inherit;
  }
  nav.sidebar {
    border-top: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
    margin-top: 2rem;
    margin-bottom: 2rem;
    padding-top: 3rem;
    padding-bottom: 3rem;
  }
}

@media all and (max-width: 599px) {
  .article-layout {
    margin: 1rem 2rem 8rem 1.5rem;
  }
}
</style>
