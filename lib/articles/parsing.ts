import {Article, SeriesMeta} from '.'

type RawSeriesMeta = {
  slug: string
  index?: number
}

type RawAttributes = {
  title: string
  date: string
  author: string
  series?: RawSeriesMeta
}

export type RawArticle = {
  attributes: RawAttributes
  html: string
}

function createSeriesMeta (meta: {slug: string, index?: number}): SeriesMeta {
  return {
    slug: meta.slug,
    index: meta.index || 0,
  }
}

function articleComparator (a: Article, b: Article): number {
  return b.date.valueOf() - a.date.valueOf()
}

function childArticleComparator (a: Article, b: Article): number {
  const c = a.series!.index - b.series!.index
  if (c === 0) {
    return articleComparator(a, b)
  } else {
    return c
  }
}

function parseRawArticles (rawArticles: Map<string, RawArticle>): Article[] {
  const allArticles = []
  for (const [key, rawArticle] of rawArticles) {
    const slug = key.replace(/^\.\/(.+)\.md$/, '$1').replace(/\//g, '-')
    allArticles.push(new Article(
      rawArticle.attributes.title,
      slug,
      new Date(rawArticle.attributes.date),
      rawArticle.attributes.author,
      rawArticle.html,
      rawArticle.attributes.series && createSeriesMeta(rawArticle.attributes.series),
      [],
    ))
  }
  return allArticles
}

function groupBySeries (allArticles: Article[]): Map<string, Article[]> {
  const articlesBySeries = new Map<string, Article[]>()
  for (const article of allArticles) {
    const seriesSlug = article.series?.slug
    if (seriesSlug && seriesSlug !== article.slug) {
      if (!articlesBySeries.has(seriesSlug)) {
        articlesBySeries.set(seriesSlug, [])
      }
      articlesBySeries.get(seriesSlug)!.push(article)
    }
  }
  return articlesBySeries
}

function integrateChildren (parentArticles: Article[], childrenBySeries: Map<string, Article[]>): void {
  for (let i = 0; i < parentArticles.length; i++) {
    const article = parentArticles[i]
    if (childrenBySeries.has(article.slug!)) {
      const children = <Article[]>childrenBySeries.get(article.slug!)!
      children.sort(childArticleComparator)
      parentArticles[i] = article.withChildren(children)
      childrenBySeries.delete(article.slug!)
    }
  }
}

function addVirtualParents (parentArticles: Article[], childrenBySeries: Map<string, Article[]>): void {
  for (const [slug, children] of childrenBySeries) {
    children.sort(childArticleComparator)
    const {title, date, author, body, series} = children[0]!
    const parentArticle = new Article(
      title,
      slug,
      date,
      author,
      body,
      series,
      children.slice(1),
    )
    parentArticles.push(parentArticle)
  }
}

export function parseArticles (rawArticles: Map<string, RawArticle>) {
  const allArticles = parseRawArticles(rawArticles)
  const childrenBySeries = groupBySeries(allArticles)
  const parentArticles = allArticles.filter((a) => !a.series)
  integrateChildren(parentArticles, childrenBySeries)
  addVirtualParents(parentArticles, childrenBySeries)
  parentArticles.sort(articleComparator)
  return parentArticles
}
