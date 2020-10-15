export interface ArticleMeta {
  readonly title: string
  readonly preamble: string
  readonly date: Date | null | undefined
  readonly isoDate: string | null | undefined
  readonly author?: string
  readonly slug: string
  readonly series?: SeriesMeta
}

export type SeriesMeta = {
  slug: string
  index?: number
}

export class Article implements ArticleMeta {
  readonly title: string
  readonly date: Date | null
  readonly author?: string
  readonly slug: string
  readonly localPath: string
  readonly series?: SeriesMeta
  readonly body: string
  readonly children: Article[]

  constructor (title: string, localPath: string, date: string | Date | null, author: string | undefined, body: string, series: SeriesMeta | undefined, children: Article[] | undefined) {
    this.title = title
    this.localPath = localPath
    this.slug = Article.toSlug(localPath)
    this.date = date ? new Date(date) : null
    this.author = author
    this.body = body.replace(/<h1[^>]+>.+?<\/h1>/, '')
    this.series = series
    this.children = children || []
  }

  static toSlug (path: string): string {
    return path.replace(/^\.\/(.+)\.md$/, '$1').replace(/\//g, '-')
  }

  withChildren (articles: Article[]): Article {
    return new Article(
      this.title,
      this.localPath,
      this.date,
      this.author,
      this.body,
      this.series,
      articles,
    )
  }

  get preamble (): string {
    const matches = this.body.match(/<p>(.+?)<\/p>/)
    if (matches) {
      return matches[1].replace(/<\/?.+?>/g, '')
    } else {
      return ''
    }
  }

  get isoDate (): string | null {
    return this.date && this.date.toISOString().substring(0, 10)
  }

  get copyrightYear (): number | null {
    return this.date && parseInt(this.date.toISOString().substring(0, 4))
  }

  get meta (): ArticleMeta {
    return {
      title: this.title,
      preamble: this.preamble,
      date: this.date,
      isoDate: this.isoDate,
      author: this.author,
      slug: this.slug,
      series: this.series,
    }
  }
}
