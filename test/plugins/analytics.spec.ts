import {Context} from '@nuxt/types'
import {def, get} from 'bdd-lazy-var'
import each from 'jest-each'
import analytics from '~/plugins/analytics'

describe('analytics', () => {
  def('ctx', () => {
    return {app: {router: {afterEach: get('afterEach')}}}
  })

  def('afterEach', () => {
    return jest.fn()
  })

  def('route', () => {
    return {
      path: '/foo/bar',
      query: get('query'),
    }
  })

  def('query', () => {
    return {}
  })

  def('doc', () => {
    return {
      createElement: jest.fn(() => get('script')),
      body: {
        appendChild: jest.fn(),
        removeChild: jest.fn(),
      },
      location: {
        host: 'lolcathost',
      },
      referrer: get('referrer'),
    }
  })

  def('referrer', () => {
    return 'https://lolcathost/somewhere'
  })

  def('script', () => {
    return {
      setAttribute: jest.fn(),
      addEventListener: jest.fn(),
    }
  })

  describe('on plugin registration', () => {
    it('registers a router afterEach hook', () => {
      const ctx: Context = get('ctx')
      analytics(ctx)
      expect(ctx.app.router!.afterEach).toBeCalled()
    })
  })

  describe('on navigation', () => {
    def('src', () => {
      const ctx: Context = get('ctx')
      analytics(ctx)
      const hook = get('afterEach').mock.calls[0][0]
      const doc = get('doc')
      hook(get('route'), null, doc)
      const script = get('script')
      return script.setAttribute.mock.calls[0][1]
    })

    def('srcs', () => {
      const ctx: Context = get('ctx')
      analytics(ctx)
      const hook = get('afterEach').mock.calls[0][0]
      const doc = get('doc')
      hook(get('route'), null, doc)
      hook(get('route'), null, doc)
      hook(get('route'), null, doc)
      const script = get('script')
      return [
        script.setAttribute.mock.calls[0][1],
        script.setAttribute.mock.calls[2][1],
        script.setAttribute.mock.calls[4][1],
      ]
    })

    it('creates a script tag', () => {
      get('src')
      const doc = get('doc')
      expect(doc.createElement).toBeCalledWith('script')
    })

    it('adds the script tag to the body', () => {
      get('src')
      const doc = get('doc')
      expect(doc.body.appendChild).toBeCalledWith(get('script'))
    })

    it('removes the script tag after the script has loaded', () => {
      get('src')
      const doc = get('doc')
      const script = get('script')
      expect(script.addEventListener.mock.calls[0][0]).toBe('load')
      script.addEventListener.mock.calls[0][1]()
      expect(doc.body.removeChild).toBeCalledWith(script)
    })

    it('sets the script to load asynchronously', () => {
      get('src')
      const script = get('script')
      expect(script.setAttribute).toBeCalledWith('async', 'async')
    })

    it('sets the script tag\'s source to load /analytics.js', () => {
      const src = get('src')
      expect(src).toMatch(/^\/analytics\.js/)
    })

    it('includes the current time as a parameter', () => {
      const src = get('src')
      const [, t] = src.match(/t=(\d+)/)
      expect(Date.now() - parseInt(t)).toBeLessThan(5000)
    })

    it('includes a session ID as a parameter', () => {
      const src = get('src')
      const [, sid] = src.match(/sid=([^&]+)/)
      expect(sid).toMatch(/^[\d\w]{6}$/)
    })

    it('includes the same session ID as a parameter for every request', () => {
      const srcs = get('srcs')
      const sids = srcs.map((src: string) => src.match(/sid=([^&]+)/)![1])
      expect(sids[0]).toBe(sids[1])
      expect(sids[1]).toBe(sids[2])
    })

    it('includes the (escaped) route path as a parameter', () => {
      const src = get('src')
      const [, path] = src.match(/path=([^&]+)/)
      expect(path).toBe('%2Ffoo%2Fbar')
    })

    it('does not include any other parameters', () => {
      const src = get('src')
      const parameters = src.split('?')[1].split('&').map((s: string) => s.split('=')[0])
      expect(parameters).toIncludeSameMembers(['t', 'sid', 'path'])
    })

    describe('when the referrer is from another domain', () => {
      def('referrer', () => {
        return 'https://example.com/somewhere/else'
      })

      it('includes the (escaped) referrer as a parameter', () => {
        const src = get('src')
        const [, referrer] = src.match(/referrer=([^&]+)/)
        expect(referrer).toBe(encodeURIComponent('https://example.com/somewhere/else'))
      })
    })

    describe('when the referrer is blank', () => {
      def('referrer', () => {
        return ''
      })

      it('does not include the referrer as a parameter', () => {
        const src = get('src')
        expect(src).not.toInclude('referrer=')
      })
    })

    each([
      'source',
      'campaign',
    ]).describe('when an utm_%s parameter is found on the route', (parameterName) => {
      def('query', () => {
        return {
          [`utm_${parameterName}`]: `the ${parameterName}`,
        }
      })

      it('includes the (escaped) parameter value', () => {
        const src = get('src')
        const [, value] = src.match(new RegExp(`utm_${parameterName}=([^&]+)`))
        expect(value).toBe(`the%20${parameterName}`)
      })

      describe('and the parameter is empty', () => {
        def('query', () => {
          return {
            [`utm_${parameterName}`]: '',
          }
        })

        it('does not include the parameter', () => {
          const src = get('src')
          expect(src).not.toInclude(`${parameterName}=`)
        })
      })

      describe('and there are multiple values', () => {
        def('query', () => {
          return {
            [`utm_${parameterName}`]: ['1', '2', '3'],
          }
        })

        it('includes only the last value', () => {
          const src = get('src')
          const [, value] = src.match(new RegExp(`utm_${parameterName}=([^&]+)`))
          expect(value).toBe('3')
          expect(src.match(new RegExp(`utm_${parameterName}=`, 'g')).length).toBe(1)
        })
      })
    })
  })
})
