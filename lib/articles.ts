import moment, {Moment} from 'moment'

export interface ArticleMeta {
  readonly title: string
  readonly preamble: string
  readonly date: Moment
  readonly isoDate: string
  readonly author?: string
  readonly slug?: string
}

export class Article implements ArticleMeta {
  readonly title: string
  readonly date: Moment
  readonly author?: string
  readonly slug?: string
  readonly body: string

  constructor (title: string, slug: string | undefined, date: string | Date | Moment, author: string | undefined, body: string) {
    this.title = title
    this.slug = slug
    this.date = moment(date)
    this.author = author
    this.body = body.replace(/<h1>.+?<\/h1>/, '')
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
    return this.date.format('YYYY-MM-DD')
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
