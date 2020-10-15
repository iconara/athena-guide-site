export interface ArticleMeta {
  readonly title: string
  readonly preamble: string
  readonly date: Date
  readonly isoDate: string
  readonly author?: string
  readonly slug: string
  readonly series?: SeriesMeta
}

export type SeriesMeta = {
  slug: string
  index: number
}

export class Article implements ArticleMeta {
  readonly title: string
  readonly date: Date
  readonly author?: string
  readonly slug: string
  readonly series?: SeriesMeta
  readonly body: string
  readonly children: Article[]

  constructor (title: string, slug: string, date: string | Date, author: string | undefined, body: string, series: SeriesMeta | undefined, children: Article[] | undefined) {
    this.title = title
    this.slug = slug
    this.date = new Date(date)
    this.author = author
    this.body = body.replace(/<h1[^>]+>.+?<\/h1>/, '')
    this.series = series
    this.children = children || []
  }

  withChildren (articles: Article[]): Article {
    return new Article(
      this.title,
      this.slug,
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

  get isoDate (): string {
    return this.date.toISOString().substring(0, 10)
  }

  get copyrightYear (): number {
    return parseInt(this.date.toISOString().substring(0, 4))
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
