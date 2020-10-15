<template>
  <default-layout title="Legal">
    <h2>Privacy Policy</h2>
    <p>
      When you browse this site data is collected about the pages you visit, and if you didn’t type
      the address directly into the browser, also about where you came from. The data collected does
      <em>not</em> include any personal data, except for your IP address, which, due to the nature of the
      internet and the way the site is hosted, is very hard to avoid recording. Efforts are made to make
      sure that the IP address is stored for as short a time as possible.
    </p>
    <p>
      A session ID is generated for every visit, but is stored only in memory and is therefore reset when
      you reload the page. No cookies are stored in your browser, and no attempt is made to uniquely
      identify you between visits.
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
