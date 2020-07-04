import {Context} from '@nuxt/types'
import {Route} from 'vue-router'

const FORWARD_PARAMETERS = [
  'utm_source',
  'utm_campaign',
]

function compileParameters (route: Route, doc: Document): string {
  const pairs = [
    `t=${Date.now()}`,
    `path=${encodeURIComponent(route.path)}`,
  ]
  const referrer = doc.referrer
  if (!referrer.includes(`//${doc.location.host}/`)) {
    pairs.push(`referrer=${encodeURIComponent(referrer)}`)
  }
  for (const parameterName of FORWARD_PARAMETERS) {
    const value = route.query[parameterName]
    if (value) {
      const s = Array.isArray(value) ? value[value.length - 1]! : value
      pairs.push(`${parameterName}=${encodeURIComponent(s)}`)
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
