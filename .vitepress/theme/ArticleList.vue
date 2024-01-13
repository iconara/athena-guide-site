<script setup lang="ts">
import {data as articles} from './articles.data'

const props = defineProps({
  inline: {type: Boolean, default: false},
})

function isCurrent(article): Boolean {
  return false
}

function isAboutCurrent(): Boolean {
  return false
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
          :class="{current: isCurrent(article)}"
          >{{ article.title }}</a>
        <!-- <span
          v-if="!inline && hasChildren(article)"
          :class="{'series-toggle': true, 'current': isCurrent(article)}"
          @click="toggleExpansion(article)"
          v-text="articleControlText(article)"
        /> -->
      </span>
      <!-- <div v-if="!inline && isExpanded(article)">
        <nuxt-link
          v-for="child in article.children"
          :key="child.slug"
          :to="{path: `/articles/${child.slug}/`}"
          :title="child.preamble"
          :class="{'child': true, 'current': isCurrent(article, child)}"
          v-text="childTitle(article, child)"
        />
      </div> -->
    </div>
    <span class="about-link">
      <a
        href="/about.html"
        :class="{current: isAboutCurrent()}"
        >About the Athena Guide</a>
    </span>
  </nav>
</template>

<style scoped>
.article-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  .article-link,
  .about-link {
    margin: 0;
    margin-right: 0.5em;
    margin-bottom: 0.5em;
    border: none;
  }

  .about-link {
    margin-top: 1.5em;
  }
}

.article-list.inline {
  .article-link::after {
    content: "/";
    margin-left: 0.5em;
    margin-bottom: 0;
  }

  .about-link {
    margin-top: 0;
  }
}

@media all and (max-width: 649px) {
  .article-list {
    display: block;

    .article-link {
      display: block;
      margin-bottom: 0.5rem;
    }

    .about-link {
      display: block;
      margin-top: 1.5rem;
    }
  }

  .article-list.inline {
    .article-link::after {
      content: "";
    }
  }
}

.article-link,
.about-link {
  display: block;
  margin-bottom: 0.5rem;
  user-select: none;
}

.article-link a,
.about-link a {
  border: none;
}

.article-link .series-toggle {
  cursor: pointer;
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
