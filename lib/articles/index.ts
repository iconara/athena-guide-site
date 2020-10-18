import {contentFunc} from '@nuxt/content/types/content'

type RootNode = {
  type: 'root'
  children: ElementNode[]
}

type TextNode = {
  type: 'text'
  value: string
}

type ElementNode = {
  type: 'element'
  tag: string
  props: Record<string, string>
  children: (ElementNode | TextNode)[]
}

type RawArticle = {
  slug: string
  dir: string
  body: RootNode
  date?: string
  author?: string
  series?: {index?: number}
}

export type Article = {
  slug: string
  title?: string
  preamble?: string
  date?: string
  author?: string
  body: RootNode
  children: Article[]
}

function compareSeriesIndex (a: {series?: {index?: number}}, b: {series?: {index?: number}}): number {
  if (a.series?.index === b.series?.index) {
    return 0
  } else if (a.series?.index === undefined) {
    return 1
  } else if (b.series?.index === undefined) {
    return -1
  } else {
    return a.series.index - b.series.index
  }
}

function compareDateDescending (a: {date?: string}, b: {date?: string}): number {
  if (a.date === b.date) {
    return 0
  } else if (a.date === undefined) {
    return 1
  } else if (b.date === undefined) {
    return -1
  } else {
    return b.date.localeCompare(a.date)
  }
}

function compareTitle (a: {title?: string}, b: {title?: string}): number {
  if (a.title === b.title) {
    return 0
  } else if (a.title === undefined) {
    return -1
  } else if (b.title === undefined) {
    return 1
  } else {
    return a.title.localeCompare(b.title)
  }
}

function articleComparator (a: Article, b: Article): number {
  const c = compareDateDescending(a, b)
  return c === 0 ? compareTitle(a, b) : c
}

function childComparator (a: RawArticle, b: RawArticle): number {
  const c = compareSeriesIndex(a, b)
  return c === 0 ? compareDateDescending(a, b) : c
}

function longestCommonPrefix (strs: string[]): string {
  const minLength = Math.min(...strs.map((s) => s.length))
  for (let i = 0; i < minLength; i++) {
    const c = strs[0].charCodeAt(i)
    for (let j = 1; j < strs.length; j++) {
      if (strs[j].charCodeAt(i) !== c) {
        return strs[0].substring(0, i)
      }
    }
  }
  return strs[0].substring(0, minLength)
}

function updateSeriesTitles (parent: Article): void {
  const titles = [parent.title || '', ...parent.children.map((a) => a.title || '')]
  const titlePrefix = longestCommonPrefix(titles)
  if (titlePrefix.length > 3) {
    parent.title = titlePrefix.replace(/[:\s]+$/, '')
    for (const child of parent.children) {
      child.title = child.title?.substring(titlePrefix.length)
    }
  }
}

function createArticleSeries (allSeries: IterableIterator<RawArticle[]>): Article[] {
  const articles = []
  for (const series of allSeries) {
    series.sort(childComparator)
    const parent = toArticle(series[0])
    parent.children = series.slice(1).map(toArticle)
    updateSeriesTitles(parent)
    articles.push(parent)
  }
  return articles
}

function fullSlug (rawArticle: RawArticle): string {
  if (rawArticle.dir === '/articles') {
    return rawArticle.slug
  } else {
    return rawArticle.dir.substring(10) + '-' + rawArticle.slug
  }
}

function stripHeader (root: RootNode): string | undefined {
  const headerIndex = root.children.findIndex((c) => c.tag === 'h1')
  if (headerIndex > -1) {
    const removedElements = root.children.splice(headerIndex, 1)
    const textNode = removedElements[0].children.find((e) => e.type === 'text')
    return textNode ? (textNode as TextNode).value : undefined
  } else {
    return undefined
  }
}

function findPreamble (root: RootNode): string | undefined {
  const p = root.children.find((c) => c.tag === 'p')
  if (p) {
    const t = p.children.find((c) => c.type === 'text')
    return t ? (t as TextNode).value : undefined
  } else {
    return undefined
  }
}

function toArticle (rawArticle: RawArticle): Article {
  const slug = fullSlug(rawArticle)
  const body = rawArticle.body
  const title = stripHeader(body)
  const preamble = findPreamble(body)
  const date = rawArticle.date?.substring(0, 10)
  return {
    slug,
    title,
    preamble,
    body,
    date,
    author: rawArticle.author,
    children: [],
  }
}

function loadAllArticles (content: contentFunc): Promise<RawArticle[]> {
  return content('articles', {deep: true}).fetch<any>()
}

export async function loadArticles (content: contentFunc): Promise<Article[]> {
  const rawArticles = await loadAllArticles(content)
  const articles = rawArticles.filter((a) => a.dir === '/articles').map(toArticle)
  const articleSeries = new Map<string, RawArticle[]>()
  for (const article of rawArticles) {
    if (article.dir !== '/articles') {
      if (!articleSeries.has(article.dir)) {
        articleSeries.set(article.dir, [])
      }
      articleSeries.get(article.dir)!.push(article)
    }
  }
  articles.push(...createArticleSeries(articleSeries.values()))
  articles.sort(articleComparator)
  return articles
}

export async function loadArticle (content: contentFunc, slug: string): Promise<Article | null> {
  const rawArticles = await loadAllArticles(content)
  const rawArticle = rawArticles.find((a) => fullSlug(a) === slug)
  if (rawArticle) {
    return toArticle(rawArticle)
  } else {
    return null
  }
}

export async function loadAbout (content: contentFunc): Promise<Article> {
  return toArticle(await content('about').fetch<any>())
}
