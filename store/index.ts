import Vue from 'vue'
import Vuex, {MutationTree, ActionTree, GetterTree} from 'vuex'
import {Article, ArticleMeta} from '@/lib/articles'

Vue.use(Vuex)

export class State {
}

export const getters: GetterTree<State, State> = {
}

export const mutations: MutationTree<State> = {
}

export const actions: ActionTree<State, State> = {
  async loadArticles (): Promise<ArticleMeta[]> {
    const context = await require.context('~/content/articles', true, /\.md$/)
    const keys = await context.keys()
    const allArticles = keys.map((key: string) => {
      const rawArticle = context(key)
      const slug = key.replace(/^\.\/(.+)\.md$/, '$1')
      return new Article(
        rawArticle.attributes.title,
        slug,
        new Date(rawArticle.attributes.date),
        rawArticle.attributes.author,
        rawArticle.html,
        rawArticle.attributes.series,
      )
    })
    const articlesBySeries = new Map<string, Article[]>()
    const articles = []
    for (const article of allArticles) {
      if (article.series && article.series !== article.slug) {
        if (!articlesBySeries.has(article.series)) {
          articlesBySeries.set(article.series, [])
        }
        articlesBySeries.get(article.series).push(article)
      } else {
        articles.push(article)
      }
    }
    return articles
      .sort((a: Article, b: Article) => b.date.valueOf() - a.date.valueOf())
      .map((a) => {
        if (articlesBySeries.has(a.slug)) {
          return a.withSubArticles(articlesBySeries.get(a.slug))
        } else {
          return a
        }
      })
      .map((a) => a.meta)
  },
  async loadArticle (_ctx, slug: string): Promise<Article> {
    const rawArticle = await import(`~/content/articles/${slug}.md`)
    const {title, date, author, series} = rawArticle.attributes
    return new Article(
      title,
      undefined,
      new Date(date),
      author,
      rawArticle.html,
      series,
    )
  },
  async loadAbout (): Promise<Article> {
    const rawArticle = await import(`~/content/${'about'}.md`)
    const {title, date, author} = rawArticle.attributes
    return new Article(
      title,
      undefined,
      new Date(date),
      author,
      rawArticle.html,
    )
  },
}

export default function () {
  return new Vuex.Store({
    state: new State(),
    getters,
    mutations,
    actions,
  })
}
