import {defineConfig} from 'vitepress'

export default defineConfig({
  srcDir: 'content',
  title: 'The Athena Guide',
  description: 'This guide explains the not so obvious aspects of how to use Amazon Athena to its full potential, including how and why to partition your data, how to get the best performance, and lowest cost, and how to use it as the engine for your data lake.',
  head: [
    ['link', {rel: 'stylesheet', href: 'https://use.typekit.net/kbt8opn.css'}],
    ['link', {rel: 'icon', href: '/favicon.svg'}],
    ['link', {rel: 'mask-icon', href: '/favicon.svg', color: '#000000'}],
    ['link', {rel: 'apple-touch-icon', href: '/apple-touch-icon.png'}],
    ['link', {rel: 'manifest', href: '/manifest.json'}],
  ],
  rewrites: {
    'articles/:series/:article': 'articles/:series-:article',
  },
  cleanUrls: true,
  markdown: {
    typographer: true,
  }
})
