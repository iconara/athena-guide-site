<template>
  <main>
    <logo
      v-if="includeLogo"
      class="corner-logo"
      :tagline="false"
      :multiline="true"
      :backlink="true"
    />
    <section class="main-header">
      <slot name="main-header"/>
    </section>
    <section class="main-content">
      <slot name="main-content"/>
    </section>
    <section class="sidebar-header">
      <slot name="sidebar-header">
        <h2>All articles</h2>
      </slot>
    </section>
    <section class="sidebar-content">
      <slot name="sidebar-content">
        <article-list/>
      </slot>
    </section>
    <footer v-if="includeCopyright">
      &copy; {{copyrightYear}} <a href="https://iconara.net/">Theo Tolv</a>, all rights reserved
      – <nuxt-link :to="{name: 'legal'}">Legal</nuxt-link>
    </footer>
  </main>
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
main {
  display: grid;
  grid-template-columns: 35rem 23vw;
  grid-template-rows: 15rem auto;
  row-gap: 1rem;
  column-gap: 12vw;
  margin: 8rem 2rem 8rem 5rem;

  .corner-logo {
    position: absolute;
    top: 3rem;
    right: 0.5rem;
    font-size: 6px;
  }

  .main-header {
    grid-column: 1;
    grid-row: 1;
    align-self: end;
    width: 125%;
  }

  .main-content {
    grid-column: 1;
    grid-row: 2;
  }

  .sidebar-header {
    grid-column: 2;
    grid-row: 1;
    align-self: end;
  }

  .sidebar-content {
    grid-column: 2;
    grid-row: 2;
  }

  footer {
    grid-column: 1;
    grid-row: 4;
    margin-top: 4rem;
    font-size: 80%;
  }
}

@media all and (max-width: 959px) {
  main {
    margin: 12rem 0rem 8rem 3rem;
    display: block;
    width: 80%;

    .corner-logo {
      position: absolute;
      top: 2rem;
      right: 1rem;
      font-size: 5px;
    }

    .main-header {
      width: 100%;
    }

    .sidebar-header {
      border-top: 1px solid #ccc;
      margin-top: 3rem;
      padding-top: 3rem;
    }
  }
}

@media all and (max-width: 699px) {
  main {
    margin: 10rem 3rem 8rem 1.5rem;
    grid-template-columns: 70vw auto;
    grid-template-rows: 8rem auto;

    .corner-logo {
      position: absolute;
      top: 3rem;
      right: 2rem;
      font-size: 2.5px;
    }

    footer {
      grid-row: 5;
    }
  }
}
</style>
