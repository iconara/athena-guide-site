import {createContentLoader} from 'vitepress'

export interface Article {
  title: string
  url: string
  date: Date
  children: Article[]
}

interface ArticleInSeries extends Article {
  series: {index: number} | undefined
}

declare const data: Article[]

export {data}

function articleComparator<T extends Article | ArticleInSeries>(a: T, b: T): number {
  if ('series' in a && 'series' in b && a.series !== undefined && b.series !== undefined) {
    return a.series.index - b.series.index
  } else {
    return +b.date - +a.date
  }
}

export default createContentLoader('content/articles/**/*.md', {
  excerpt: true,
  transform(rawData): Article[] {
    const articlesBySeries = new Map<string, ArticleInSeries[]>()
    for (const rawArticle of rawData) {
      const urlComponents = rawArticle.url.split('/')
      const series = urlComponents[urlComponents.length - 2]
      let seriesArticles = articlesBySeries.get(series)
      if (seriesArticles === undefined) {
        seriesArticles = []
        articlesBySeries.set(series, seriesArticles)
      }
      const article: ArticleInSeries = {
        title: rawArticle.frontmatter.title,
        date: rawArticle.frontmatter.date,
        url: rawArticle.url,
        children: [],
        series: rawArticle.frontmatter.series,
      }
      seriesArticles.push(article)
    }
    const allArticles: Article[] = []
    for (const [series, seriesArticles] of articlesBySeries.entries()) {
      if (series === 'articles') {
        allArticles.push(...seriesArticles)
      } else {
        seriesArticles.sort(articleComparator)
        const firstArticle = seriesArticles.shift()!
        firstArticle.children = seriesArticles
        allArticles.push(firstArticle)
      }
    }
    allArticles.sort(articleComparator)
    return allArticles
  }
})
