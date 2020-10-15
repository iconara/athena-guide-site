import {Article, SeriesMeta} from '.'

type RawSeriesMeta = SeriesMeta

type RawAttributes = {
  title?: string
  date?: string
  author?: string
  series?: RawSeriesMeta
}

export type RawArticle = {
  attributes: RawAttributes
  html: string
}

function createSeriesMeta (meta: {slug: string, index?: number}): SeriesMeta {
  return {
    slug: meta.slug,
    index: meta.index,
  }
}

function articleComparator (a: Article, b: Article): number {
  const aDate = a.date || new Date(0)
  const bDate = b.date || new Date(0)
  const c = bDate.valueOf() - aDate.valueOf()
  if (c === 0) {
    return a.title.localeCompare(b.title)
  } else {
    return c
  }
}

function childArticleComparator (a: Article, b: Article): number {
  const aIndex = a.series!.index
  const bIndex = b.series!.index
  if (aIndex === bIndex) {
    return articleComparator(a, b)
  } else if (aIndex === undefined) {
    return 1
  } else if (bIndex === undefined) {
    return -1
  } else {
    return aIndex - bIndex
  }
}

function parseRawArticles (rawArticles: Map<string, RawArticle>): Article[] {
  const allArticles = []
  for (const [localPath, rawArticle] of rawArticles) {
    allArticles.push(new Article(
      rawArticle.attributes.title || '',
      localPath,
      rawArticle.attributes.date && rawArticle.attributes.date || null,
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
    if (childrenBySeries.has(article.slug)) {
      const children = <Article[]>childrenBySeries.get(article.slug)!
      children.sort(childArticleComparator)
      parentArticles[i] = article.withChildren(children)
      childrenBySeries.delete(article.slug)
    }
  }
}

function addVirtualParents (parentArticles: Article[], childrenBySeries: Map<string, Article[]>): void {
  for (const [, children] of childrenBySeries) {
    children.sort(childArticleComparator)
    const parentArticle = children[0].withChildren(children.slice(1))
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
