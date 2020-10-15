<template>
  <div class="default-layout">
    <logo
      v-if="includeLogo"
      class="corner-logo"
      :tagline="false"
      :multiline="true"
      :backlink="true"
    />
    <h1 v-if="title">{{title}}</h1>
    <article class="main-content">
      <slot/>
    </article>
    <nav
      v-if="includesArticleList"
      class="article-list"
    >
      <h2>All articles</h2>
      <article-list/>
    </nav>
    <footer v-if="includeCopyright">
      &copy; {{copyrightYear}} <a href="https://iconara.net/">Theo Tolv</a>, all rights reserved
      – <nuxt-link :to="{path: '/legal/'}">Legal</nuxt-link>
    </footer>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Logo from '@/components/Logo.vue'
import ArticleList from '@/components/ArticleList.vue'

export default Vue.extend({
  components: {
    Logo,
    ArticleList,
  },
  props: {
    title: {
      type: String,
      default: null,
    },
    includeLogo: {
      type: Boolean,
      default: true,
    },
    includeCopyright: {
      type: Boolean,
      default: true,
    },
    includesArticleList: {
      type: Boolean,
      default: false,
    },
    copyrightYear: {
      type: Number,
      default: (new Date()).getUTCFullYear(),
    },
  },
})
</script>

<style lang="scss" scoped>
.default-layout {
  display: grid;
  grid-template-rows: auto 1fr auto;
  grid-template-columns: 1fr minmax(55ch, 75ch) 40ch 1fr;
  row-gap: 1rem;
  column-gap: 10ch;
  margin: 5rem 5rem 8rem 5rem;

  .corner-logo {
    grid-column: 3;
    grid-row: 1;
    margin-bottom: 6rem;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    font-size: 6px;
  }

  h1 {
    grid-column: 2 / 4;
    grid-row: 2;
  }

  footer {
    grid-column: 2 / 4;
    grid-row: 4;
    margin-top: 2rem;
  }

  .main-content {
    grid-column: 2;
    grid-row: 3;
  }

  .article-list {
    grid-column: 3;
    grid-row: 3;

    h2 {
      margin-top: 0;
      margin-bottom: 0.6em;
    }
  }
}

@media all and (max-width: 959px) {
  .default-layout {
    display: flex;
    flex-direction: column;

    .corner-logo {
      align-items: flex-end;
    }

    .main-header {
      align-self: inherit;
    }

    .article-list {
      border-top: 1px solid #ccc;
      border-bottom: 1px solid #ccc;
      margin-top: 2rem;
      margin-bottom: 2rem;
      padding-top: 3rem;
      padding-bottom: 3rem;
    }
  }
}

@media all and (max-width: 599px) {
  .default-layout {
    margin: 3rem 2rem 8rem 1.5rem;

    .corner-logo {
      font-size: 4px;
    }
  }
}
</style>
