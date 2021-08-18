export default {
  target: 'static',
  head: {
    htmlAttrs: {
      lang: 'en',
    },
    titleTemplate: '%s | The Athena Guide',
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1, shrink-to-fit=no'},
      {name: 'theme-color', content: '#ffffff'},
      {hid: 'description', name: 'description', content: process.env.npm_package_description || ''},
    ],
    link: [
      {rel: 'icon', href: '/favicon.svg'},
      {rel: 'mask-icon', href: '/favicon.svg', color: '#000000'},
      {rel: 'apple-touch-icon', href: '/apple-touch-icon.png'},
      {rel: 'manifest', href: '/manifest.json'},
      {rel: 'stylesheet', href: 'https://use.typekit.net/kbt8opn.css'},
    ],
  },
  loading: {color: '#fff'},
  css: [
    '@/assets/styles/main.scss',
  ],
  buildModules: [
    '@nuxt/typescript-build',
  ],
  modules: [
    '@nuxtjs/style-resources',
    '@nuxt/content',
  ],
  plugins: [
    {src: '~/plugins/analytics.ts', mode: 'client'},
  ],
  env: {
    baseUrl: process.env.BASE_URL || '',
  },
  content: {
    markdown: {
      rehypePlugins: ['~/plugins/rehype-quotes.js'],
    },
  },
}
