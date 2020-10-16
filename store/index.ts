import Vue from 'vue'
import Vuex, {MutationTree, ActionTree, GetterTree} from 'vuex'
import {Article, ArticleMeta} from '@/lib/articles'
import {parseArticles, RawArticle} from '@/lib/articles/parsing'

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
    const rawArticles = new Map<string, RawArticle>()
    for (const k of keys) {
      rawArticles.set(k, context(k))
    }
    return parseArticles(rawArticles)
  },
  async loadArticle (_ctx, slug: string): Promise<Article> {
    const context = await require.context('~/content/articles', true, /\.md$/)
    const keys = await context.keys()
    const key = keys.find((k) => Article.toSlug(k) === slug)
    const rawArticle = await import(`~/content/articles/${key.replace(/^\.\//, '')}`)
    const {title, date, author, series} = rawArticle.attributes
    return new Article(
      title,
      key,
      new Date(date),
      author,
      rawArticle.html,
      series,
      [],
    )
  },
  async loadAbout (): Promise<Article> {
    const rawArticle = await import(`~/content/${'about'}.md`)
    const {title, date, author} = rawArticle.attributes
    return new Article(
      title,
      'about.md',
      new Date(date),
      author,
      rawArticle.html,
      undefined,
      [],
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
