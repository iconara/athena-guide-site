<template>
  <default-layout>
    <template v-slot:main-header>
      <h1>Legal</h1>
    </template>
    <template v-slot:main-content>
      <h2>Privacy Policy</h2>
      <p>
        When you browse this site data is collected about the pages you visit, and if you didn’t type
        the address directly into the browser, also about where you came from. The data collected does
        <em>not</em> include any personal data, except for your IP address, which, due to the nature of the
        internet and the way the site is hosted, is very hard to avoid recording. Efforts are made to
        make sure that the IP address is stored for as short a time as possible. No cookies are stored
        in your browser, and no attempt is made to uniquely identify you as a visitor.
      </p>
      <p>
        The purpose of the data collection is to understand what content is most popular, and how visitors
        like you find this guide.
      </p>
      <h2>Affiliation</h2>
      <p>
        This site is not affiliated with Amazon, AWS, or any other company.
      </p>
      <h2>Contact information</h2>
      <p>
        If you have any concerns, or questions about this site or the privacy policy above, please contact
        <a href="mailto:the@athena.guide">the@athena.guide</a>.
      </p>
    </template>
  </default-layout>
</template>

<script lang="ts">
import Vue from 'vue'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'

export default Vue.extend({
  components: {
    DefaultLayout,
  },
  head () {
    return {
      title: 'Privacy',
    }
  },
})
</script>
