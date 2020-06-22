<template>
  <main>
    <logo
      v-if="logo"
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
        <article-list
          :articles="articles"
          :loading="loading"
        />
      </slot>
    </section>
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
    logo: {
      type: Boolean,
      default: true,
    },
  },
  async fetch () {
    this.loading = true
    try {
      this.articles = await this.$store.dispatch('loadArticles')
    } finally {
      this.loading = false
    }
  },
  data () {
    return {
      loading: false,
      articles: [],
    }
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
  @include base-layout;

  .main-header {
    grid-column: 1 / span 2;
    grid-row: 1;
    align-self: end;
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
    @include base-layout-narrow;
  }
}
</style>
