import {Context} from '@nuxt/types'
import {Route} from 'vue-router'

function compileParameters (route: Route, doc: Document): string {
  const pairs = [
    `t=${Date.now()}`,
    `path=${encodeURIComponent(route.path)}`,
  ]
  const referrer = doc.referrer
  if (!referrer.includes(`//${doc.location.host}/`)) {
    pairs.push(`referrer=${encodeURIComponent(referrer)}`)
  }
  const source = route.query.utm_source
  if (source) {
    const s = Array.isArray(source) ? source[source.length - 1] : source
    if (s) {
      pairs.push(`utm_source=${encodeURIComponent(s)}`)
    }
  }
  return pairs.join('&')
}

function reportNavigation (to: Route, _from: Route, doc: Document = document) {
  const src = `/analytics.js?${compileParameters(to, doc)}`
  const script = doc.createElement('script')
  script.setAttribute('src', src)
  script.setAttribute('async', 'async')
  script.addEventListener('load', () => doc.body.removeChild(script))
  doc.body.appendChild(script)
}

export default (ctx: Context) => {
  ctx.app.router!.afterEach(reportNavigation)
}
