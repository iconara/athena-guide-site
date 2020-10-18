import {contentFunc} from '@nuxt/content/types/content'
import {def, get} from 'bdd-lazy-var'
import {loadArticles, loadArticle} from '~/lib/articles'

type Overrides = {
  dir?: string
  series?: {index?: number}
}

function createRawArticle (title: string, date: string, overrides: Overrides = {}) {
  return {
    slug: title.toLowerCase(),
    dir: overrides.dir || '/articles',
    date: date + 'T12:34:56.789Z',
    author: 'The Author',
    series: overrides.series,
    body: {
      type: 'root',
      children: [
        {
          type: 'element',
          tag: 'h1',
          props: {},
          children: [
            {type: 'text', value: title},
          ],
        },
        {
          type: 'element',
          tag: 'p',
          props: {},
          children: [
            {type: 'text', value: `Lorem ipsum dolor ${title}`},
          ],
        },
      ],
    },
  }
}

function basicRawArticles () {
  return [
    createRawArticle('Hello', '2020-10-11'),
    createRawArticle('World', '2020-10-15'),
    createRawArticle('Third', '2020-01-01'),
  ]
}

function rawArticlesWithSeries () {
  return [
    createRawArticle('A1', '2020-10-11'),
    createRawArticle('A2', '2020-10-14', {dir: '/articles/s1', series: {index: 1}}),
    createRawArticle('A3', '2020-10-16', {dir: '/articles/s1', series: {index: 3}}),
    createRawArticle('A4', '2020-10-15', {dir: '/articles/s1', series: {index: 2}}),
    createRawArticle('A5', '2020-01-01'),
    createRawArticle('A6', '2020-01-01', {dir: '/articles/s2', series: {index: 1}}),
  ]
}

def('rawArticles', basicRawArticles)

def('articlesPromise', () => {
  return Promise.resolve(get('rawArticles'))
})

def('fetch', () => {
  return jest.fn(() => get('articlesPromise'))
})

def('content', () => {
  const fetch = get('fetch')
  return jest.fn(() => ({fetch}))
})

describe('loadArticles', () => {
  it('loads the articles using the content function', async () => {
    await loadArticles(<contentFunc>get('content'))
    const content = get('content')
    const fetch = get('fetch')
    expect(content).toHaveBeenCalledWith('articles', {deep: true})
    expect(fetch).toHaveBeenCalled()
  })

  it('parses raw articles and returns clean articles', async () => {
    const articles = await loadArticles(<contentFunc>get('content'))
    expect(articles).toHaveLength(3)
    expect(articles[1].slug).toBe('hello')
    expect(articles[1]).toHaveProperty('body')
  })

  it('includes the date attribute when present, stripping any time component', async () => {
    const articles = await loadArticles(<contentFunc>get('content'))
    expect(articles[1].date).toBe('2020-10-11')
  })

  it('includes the author attribute when present', async () => {
    const articles = await loadArticles(<contentFunc>get('content'))
    expect(articles[1].author).toBe('The Author')
  })

  it('includes an empty list of children', async () => {
    const articles = await loadArticles(<contentFunc>get('content'))
    expect(articles[1].children).toBeEmpty()
  })

  it('uses the first h1 tag as the title', async () => {
    const articles = await loadArticles(<contentFunc>get('content'))
    expect(articles[1].title).toBe('Hello')
  })

  it('uses the first p tag as the preamble', async () => {
    const articles = await loadArticles(<contentFunc>get('content'))
    expect(articles[1].preamble).toBe('Lorem ipsum dolor Hello')
  })

  it('sorts the articles in descending order by date', async () => {
    const articles = await loadArticles(<contentFunc>get('content'))
    const titles = articles.map((a) => a.title)
    expect(titles).toEqual([
      'World',
      'Hello',
      'Third',
    ])
  })

  describe('when loading the articles returns an error', () => {
    def('articlesPromise', () => {
      return Promise.reject(new Error('b0rk'))
    })

    it('propagates the error', async () => {
      expect.assertions(1)
      try {
        await loadArticles(<contentFunc>get('content'))
      } catch (error) {
        expect(error.message).toBe('b0rk')
      }
    })
  })

  describe('when articles do not have a date', () => {
    def('rawArticles', () => {
      const articles = get('rawArticles')
      const helloArticle = articles.find((a: any) => a.slug === 'hello')!
      const worldArticle = articles.find((a: any) => a.slug === 'world')!
      delete helloArticle.date
      delete worldArticle.date
      return articles
    })

    it('sorts them last, by title', async () => {
      const articles = await loadArticles(<contentFunc>get('content'))
      const titles = articles.map((a) => a.title)
      expect(titles).toEqual([
        'Third',
        'Hello',
        'World',
      ])
    })
  })

  describe('when articles are located in subdirectories', () => {
    def('rawArticles', rawArticlesWithSeries)

    it('groups those articles into a series named from the first article in the series', async () => {
      const articles = await loadArticles(<contentFunc>get('content'))
      const titles = articles.map((a) => a.title)
      expect(titles).toEqual([
        'A2',
        'A1',
        'A5',
        'A6',
      ])
    })

    it('exposes the series as children of the first article in the series', async () => {
      const articles = await loadArticles(<contentFunc>get('content'))
      const seriesParent = articles.find((a) => a.title === 'A2')!
      expect(seriesParent.children.map((a) => a.title)).toIncludeSameMembers([
        'A3',
        'A4',
      ])
    })

    it('adds the directory name to the series\' articles\' slugs', async () => {
      const articles = await loadArticles(<contentFunc>get('content'))
      const seriesParent = articles.find((a) => a.title === 'A2')!
      expect(seriesParent.slug).toBe('s1-a2')
      expect(seriesParent.children.map((a) => a.slug)).toIncludeSameMembers([
        's1-a3',
        's1-a4',
      ])
    })

    it('sorts the children by index', async () => {
      const articles = await loadArticles(<contentFunc>get('content'))
      const seriesParent = articles.find((a) => a.title === 'A2')!
      const seriesTitles = seriesParent.children.map((a) => a.title)
      expect(seriesTitles).toEqual([
        'A4',
        'A3',
      ])
    })

    describe('when an article in a series has no index', () => {
      def('rawArticles', () => {
        const articles = get('rawArticles')
        const article = articles.find((a: any) => a.slug === 'a4')!
        delete article.series
        return articles
      })

      it('is sorted last', async () => {
        const articles = await loadArticles(<contentFunc>get('content'))
        const seriesParent = articles.find((a) => a.title === 'A2')!
        const seriesTitles = seriesParent.children.map((a) => a.title)
        expect(seriesTitles).toEqual([
          'A3',
          'A4',
        ])
      })
    })

    describe('when two articles have the same index', () => {
      def('rawArticles', () => {
        const articles = get('rawArticles')
        const a3 = articles.find((a: any) => a.slug === 'a3')!
        const a4 = articles.find((a: any) => a.slug === 'a4')!
        a3.series.index = 3
        a4.series.index = 3
        return articles
      })

      it('they are sorted by date in descending order', async () => {
        const articles = await loadArticles(<contentFunc>get('content'))
        const seriesParent = articles.find((a) => a.title === 'A2')!
        const seriesTitles = seriesParent.children.map((a) => a.title)
        expect(seriesTitles).toEqual([
          'A3',
          'A4',
        ])
      })
    })
  })
})

describe('loadArticle', () => {
  it('loads all articles using the content function', async () => {
    await loadArticle(<contentFunc>get('content'), 'world')
    const content = get('content')
    const fetch = get('fetch')
    expect(content).toHaveBeenCalledWith('articles', {deep: true})
    expect(fetch).toHaveBeenCalled()
  })

  it('finds and returns the article with the specified slug', async () => {
    const article = await loadArticle(<contentFunc>get('content'), 'third')
    expect(article?.title).toBe('Third')
  })

  it('returns null when an article is not found', async () => {
    const article = await loadArticle(<contentFunc>get('content'), 'borf')
    expect(article).toBeNull()
  })

  it('returns the article body', async () => {
    const article = await loadArticle(<contentFunc>get('content'), 'world')
    expect(article?.body).not.toBeUndefined()
  })

  it('removes the first h1 node from the body', async () => {
    const article = await loadArticle(<contentFunc>get('content'), 'world')
    expect(article?.body.children).toHaveLength(1)
    expect(article?.body.children[0].tag).toBe('p')
  })

  describe('when the article is located in a subdirectory', () => {
    def('rawArticles', rawArticlesWithSeries)

    it('returns the article with the specfied slug', async () => {
      const article = await loadArticle(<contentFunc>get('content'), 's1-a3')
      expect(article?.title).toBe('A3')
    })
  })

  describe('when loading the articles returns an error', () => {
    def('articlesPromise', () => {
      return Promise.reject(new Error('b0rk'))
    })

    it('propagates the error', async () => {
      expect.assertions(1)
      try {
        await loadArticle(<contentFunc>get('content'), 'third')
      } catch (error) {
        expect(error.message).toBe('b0rk')
      }
    })
  })
})
