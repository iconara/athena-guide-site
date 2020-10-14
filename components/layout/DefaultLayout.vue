<template>
  <div class="default-layout">
    <nav>
      <logo
        v-if="includeLogo"
        class="corner-logo"
        :tagline="false"
        :multiline="true"
        :backlink="true"
      />
    </nav>
    <header class="main-header">
      <slot name="main-header"/>
    </header>
    <article class="main-content">
      <slot name="main-content"/>
    </article>
    <aside class="sidebar-header">
      <slot name="sidebar-header">
        <h2>All articles</h2>
      </slot>
    </aside>
    <aside class="sidebar-content">
      <slot name="sidebar-content">
        <article-list/>
      </slot>
    </aside>
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
    includeLogo: {
      type: Boolean,
      default: true,
    },
    includeCopyright: {
      type: Boolean,
      default: true,
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
  grid-template: auto 1fr auto / minmax(50ch, 90ch) minmax(25ch, 40ch);
  row-gap: 1rem;
  column-gap: 12vw;
  margin: 5rem 5rem 8rem 5rem;

  nav {
    grid-column: 1 / 3;
    grid-row: 1;
    margin-bottom: 6rem;
    display: flex;
    flex-direction: column;
    align-items: flex-end;

    .corner-logo {
      font-size: 6px;
    }
  }

  footer {
    grid-column: 1 / 3;
    grid-row: 4;
    margin-top: 2rem;
  }

  .main-header,
  .sidebar-header {
    grid-row: 2;
    align-self: flex-end;
  }

  .main-header {
    grid-column: 1;
  }

  .main-content {
    grid-column: 1;
    grid-row: 3;
  }

  .sidebar-header {
    grid-column: 2;
  }

  .sidebar-content {
    grid-column: 2;
    grid-row: 3;
  }
}

@media all and (max-width: 959px) {
  .default-layout {
    display: flex;
    flex-direction: column;

    .main-header,
    .sidebar-header {
      align-self: inherit;
    }

    .sidebar-header {
      border-top: 1px solid #ccc;
      margin-top: 2rem;
      padding-top: 3rem;
    }

    .sidebar-content {
      border-bottom: 1px solid #ccc;
      margin-bottom: 2rem;
      padding-bottom: 3rem;
    }
  }
}

@media all and (max-width: 599px) {
  .default-layout {
    margin: 3rem 2rem 8rem 1.5rem;

    nav {
      .corner-logo {
        font-size: 4px;
      }
    }
  }
}
</style>
