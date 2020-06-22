import Vue from 'vue'
import Vuex, {MutationTree, ActionTree, GetterTree} from 'vuex'
import moment from 'moment'
import {GuideMeta, Guide} from '@/lib/guides'

Vue.use(Vuex)

export class State {
}

export const getters: GetterTree<State, State> = {
}

export const mutations: MutationTree<State> = {
}

export const actions: ActionTree<State, State> = {
  async loadGuides (): Promise<GuideMeta[]> {
    const context = await require.context('~/content/guides', true, /\.md$/)
    return (await context.keys())
      .map((key: string) => {
        const rawGuide = context(key)
        const slug = key.replace(/^\.\/(.+)\.md$/, '$1')
        return new Guide(
          rawGuide.attributes.title,
          slug,
          moment(rawGuide.attributes.date),
          rawGuide.attributes.author,
          rawGuide.html,
        )
      })
      .sort((a: GuideMeta, b: GuideMeta) => b.date.valueOf() - a.date.valueOf())
      .map((guide) => guide.meta)
  },
  async loadGuide (_ctx, slug: string): Promise<Guide> {
    const rawGuide = await import(`~/content/guides/${slug}.md`)
    const {title, date, author} = rawGuide.attributes
    return new Guide(
      title,
      undefined,
      moment(date),
      author,
      rawGuide.html,
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
