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

export function parseArticles (rawArticles: Map<string, RawArticle>) {
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
  const articlesBySeries = new Map<string, Article[]>()
  const articles = []
  for (const article of allArticles) {
    const seriesSlug = article.series?.slug
    if (seriesSlug && seriesSlug !== article.slug) {
      if (!articlesBySeries.has(seriesSlug)) {
        articlesBySeries.set(seriesSlug, [])
      }
      articlesBySeries.get(seriesSlug)!.push(article)
    } else {
      articles.push(article)
    }
  }
  for (let i = 0; i < articles.length; i++) {
    if (articlesBySeries.has(articles[i].slug!)) {
      const children = <Article[]>articlesBySeries.get(articles[i].slug!)!
      children.sort(childArticleComparator)
      articles[i] = articles[i].withChildren(children)
      articlesBySeries.delete(articles[i].slug!)
    }
  }
  for (const [slug, children] of articlesBySeries) {
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
    articles.push(parentArticle)
  }
  articles.sort(articleComparator)
  return articles
}
