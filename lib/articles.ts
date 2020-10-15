export interface ArticleMeta {
  readonly title: string
  readonly preamble: string
  readonly date: Date
  readonly isoDate: string
  readonly author?: string
  readonly slug?: string
}

export class Article implements ArticleMeta {
  readonly title: string
  readonly date: Date
  readonly author?: string
  readonly slug?: string
  readonly body: string

  constructor (title: string, slug: string | undefined, date: string | Date, author: string | undefined, body: string) {
    this.title = title
    this.slug = slug
    this.date = new Date(date)
    this.author = author
    this.body = body.replace(/<h1[^>]+>.+?<\/h1>/, '')
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
    }
  }
}
