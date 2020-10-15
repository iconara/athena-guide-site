import {def, get} from 'bdd-lazy-var'
import {Article} from '~/lib/articles'
import {parseArticles, RawArticle} from '~/lib/articles/parsing'

describe('parseArticles', () => {
  def('rawArticles', () => {
    const rawArticles = new Map<string, RawArticle>()
    rawArticles.set('./hello.md', {
      html: '<p>Hello</p>',
      attributes: {
        title: 'Hello',
        date: '2020-10-11',
        author: 'Mr Foo',
      }
    })
    rawArticles.set('./world.md', {
      html: '<p>World</p>',
      attributes: {
        title: 'World',
        date: '2020-10-15',
        author: 'Ms Bar',
      }
    })
    rawArticles.set('./the-third.md', {
      html: '<p>Third</p>',
      attributes: {
        title: '3rd',
        date: '2020-01-01',
        author: 'Ms Bar',
      }
    })
    return rawArticles
  })

  def('articles', () => {
    const rawArticles = <Map<string, RawArticle>>get('rawArticles')
    return parseArticles(rawArticles)
  })

  it('parses raw articles into Article objects', async () => {
    const articles = <Article[]>get('articles')
    expect(articles).toHaveLength(3)
    expect(articles[1].body).toBe('<p>Hello</p>')
    expect(articles[1].title).toBe('Hello')
    expect(articles[1].date.toISOString()).toStartWith('2020-10-11')
    expect(articles[1].author).toBe('Mr Foo')
  })

  it('generates a slug from the key', () => {
    const articles = <Article[]>get('articles')
    const slugs = articles.map((a) => a.slug)
    expect(slugs).toEqual([
      'world',
      'hello',
      'the-third',
    ])
  })

  it('returns the articles in reverse chronological order', () => {
    const articles = <Article[]>get('articles')
    const titles = articles.map((a) => a.title)
    expect(titles).toEqual([
      'World',
      'Hello',
      '3rd',
    ])
  })

  describe('when the key has directories', () => {
    def('rawArticles', () => {
      const rawArticles = <Map<string, RawArticle>>get('rawArticles')
      rawArticles.set('./very/very/deep.md', {
        html: '<p>Deep</p>',
        attributes: {
          title: 'Deep',
          date: '2020-10-11',
          author: 'Mr Foo',
        }
      })
      return rawArticles
    })

    it('uses the full path but replaces slashes with dashes', () => {
      const articles = <Article[]>get('articles')
      const article = articles.find((a) => a.title === 'Deep')!
      expect(article.slug).toBe('very-very-deep')
    })
  })

  describe('when there is an article series', () => {
    def('rawArticles', () => {
      const rawArticles = <Map<string, RawArticle>>get('rawArticles')
      rawArticles.set('./hello-2.md', {
        html: '<p>Hello 2</p>',
        attributes: {
          title: 'Hello 2',
          date: '2020-10-11',
          author: 'Mr Foo',
          series: {
            slug: 'hello',
            index: 2,
          },
        }
      })
      rawArticles.set('./hello-1.md', {
        html: '<p>Hello 1</p>',
        attributes: {
          title: 'Hello 1',
          date: '2020-10-11',
          author: 'Mr Foo',
          series: {
            slug: 'hello',
            index: 1,
          },
        }
      })
      rawArticles.set('./the-third-a.md', {
        html: '<p>Third A</p>',
        attributes: {
          title: '3rd A',
          date: '2020-01-01',
          author: 'Ms Bar',
          series: {
            slug: 'the-third',
            index: 1,
          },
        },
      })
      return rawArticles
    })

    it('folds articles in the series as sub articles to the main', () => {
      const articles = <Article[]>get('articles')
      const helloArticle = articles.find((a) => a.slug === 'hello')!
      const thirdArticle = articles.find((a) => a.slug === 'the-third')!
      expect(articles).toHaveLength(3)
      expect(helloArticle.subArticles).toHaveLength(2)
      expect(helloArticle.title).toBe('Hello')
      expect(helloArticle.subArticles[1].title).toBe('Hello 2')
      expect(thirdArticle.subArticles).toHaveLength(1)
    })

    it('stores an empty array for articles without series', () => {
      const articles = <Article[]>get('articles')
      const worldArticle = articles.find((a) => a.slug === 'world')!
      expect(worldArticle.subArticles).toBeEmpty()
    })

    it('sorts the sub articles by series index', () => {
      const articles = <Article[]>get('articles')
      const helloTitles = articles.find((a) => a.slug === 'hello')!.subArticles.map((a) => a.title)
      expect(helloTitles).toEqual([
        'Hello 1',
        'Hello 2',
      ])
    })

    describe('and there is no parent article', () => {
      def('rawArticles', () => {
        const rawArticles = <Map<string, RawArticle>>get('rawArticles')
        rawArticles.set('./series-2-b.md', {
          html: '<p>Series 2 B</p>',
          attributes: {
            title: 'Series 2 B',
            date: '2020-01-01',
            author: 'Ms Bar',
            series: {
              slug: 'series-2',
              index: 2,
            },
          },
        })
        rawArticles.set('./series-2-a.md', {
          html: '<p>Series 2 A</p>',
          attributes: {
            title: 'Series 2 A',
            date: '2020-01-01',
            author: 'Ms Bar',
            series: {
              slug: 'series-2',
              index: 1,
            },
          },
        })
        return rawArticles
      })

      it('uses the first article of the series as parent', () => {
        const articles = <Article[]>get('articles')
        const series2Article = articles.find((a) => a.slug === 'series-2')!
        expect(series2Article.slug).toBe('series-2')
        expect(series2Article.title).toBe('Series 2 A')
        expect(series2Article.subArticles).toHaveLength(1)
        expect(series2Article.subArticles[0].title).toBe('Series 2 B')
      })
    })

    describe('and a sub article\'s index is missing', () => {
      def('rawArticles', () => {
        const rawArticles = <Map<string, RawArticle>>get('rawArticles')
        rawArticles.set('./hello-2.md', {
          html: '<p>Hello 2</p>',
          attributes: {
            title: 'Hello 2',
            date: '2020-10-11',
            author: 'Mr Foo',
            series: {
              slug: 'hello',
            },
          }
        })
        rawArticles.set('./hello-3.md', {
          html: '<p>Hello 3</p>',
          attributes: {
            title: 'Hello 3',
            date: '2020-10-20',
            author: 'Mr Foo',
            series: {
              slug: 'hello',
            },
          }
        })
        return rawArticles
      })

      it('sorts those articles as if the index was 0 and then by date', () => {
        const articles = <Article[]>get('articles')
        const helloTitles = articles.find((a) => a.slug === 'hello')!.subArticles.map((a) => a.title)
        expect(helloTitles).toEqual([
          'Hello 3',
          'Hello 2',
          'Hello 1',
        ])
      })
    })
  })
})
