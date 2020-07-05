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
.corner-logo {
  position: absolute;
  top: 3rem;
  right: 2rem;
  font-size: 6px;
}

main {
  width: 100%;
  display: grid;
  padding-top: 7rem;
  grid-template-columns: 35rem 23vw;
  grid-template-rows: 15rem auto;
  row-gap: 1rem;
  column-gap: 12vw;

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
}

footer {
  margin-top: 4rem;
  font-size: 80%;
}

@media all and (max-width: 959px) {
  main {
    .sidebar-header {
      grid-column: 1;
      grid-row: 3;
      align-self: flex-end;
    }

    .sidebar-content {
      grid-column: 1;
      grid-row: 4
    }
  }
}

@media all and (max-width: 799px) {
  main {
    grid-template-columns: 70vw auto;
    grid-template-rows: 8rem auto;
  }
}
</style>
