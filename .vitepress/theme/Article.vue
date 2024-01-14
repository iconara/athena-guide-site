<script setup lang="ts">
import {useData} from 'vitepress'
import Logo from './Logo.vue'
import ArticleList from './ArticleList.vue'

const {frontmatter} = useData()

function formatDate(dateString: string | undefined): string {
  if (dateString !== undefined) {
    return dateString.substring(0, 10)
  } else {
    return ''
  }
}

function formatYear(dateString: string | undefined): string {
  if (dateString !== undefined) {
    return dateString.substring(0, 4)
  } else {
    return ''
  }
}
</script>

<template>
  <nav class="top">
    <details>
      <summary></summary>
      <ArticleList :inline="false"/>
    </details>
    <Logo/>
  </nav>
  <h1>{{frontmatter.title}}</h1>
  <article>
    <div class="meta">
      <div v-if="frontmatter.date" class="date" v-text="formatDate(frontmatter.date)"/>
      <div v-if="frontmatter.author" class="author">
        by <span class="name" v-text="frontmatter.author"/>
      </div>
    </div>
    <Content/>
  </article>
  <nav class="sidebar">
    <h2>All articles</h2>
    <ArticleList :inline="false"/>
  </nav>
  <footer>
    &copy; {{formatYear(frontmatter.date)}} Theo Tolv, all rights reserved
    –
    <a href="/legal.html">Legal</a>
  </footer>
</template>

<style scoped>
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

nav.top .logo {
  display: block;
  font-size: 6px;
}

nav.top > details {
  display: none;
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

@media all and (max-width: 999px) {
  nav.top {
    justify-content: space-between;
    margin-bottom: 2rem;
  }

  nav.top > details {
    display: block;
    user-select: none;
  }

  nav.top > details > summary {
    list-style-type: '≡';
    font-size: 300%;
    margin-bottom: 0.5em;
  }

  nav.top > details[open] > summary {
    list-style-type: '×';
    font-size: 300%;
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
</style>
