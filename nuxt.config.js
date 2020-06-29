import path from 'path'
import glob from 'glob'
import MarkdownMode from 'frontmatter-markdown-loader/mode'

export default {
  mode: 'universal',
  head: {
    title: 'The Athena Guide',
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
      {rel: 'manifest', href: 'manifest.json'},
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
    'bootstrap-vue/nuxt',
    '@nuxtjs/style-resources',
  ],
  build: {
    extend (config, _ctx) {
      config.module.rules.push({
        test: /\.md$/,
        loader: 'frontmatter-markdown-loader',
        include: path.resolve(__dirname, 'content'),
        options: {
          mode: [MarkdownMode.HTML],
          vue: {
            root: 'markdown-body',
          },
        },
      })
    },
  },
  generate: {
    routes: glob.sync('articles/**/*.md', {cwd: 'content'}).map((p) => p.replace(/\.md$/, '')),
  },
  bootstrapVue: {
    icons: true,
  },
}
