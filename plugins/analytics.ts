import {Context} from '@nuxt/types'
import {Route} from 'vue-router'

const FORWARD_PARAMETERS = [
  'utm_source',
  'utm_campaign',
]

function generateSessionId () {
  const n = Math.floor((36 ** 6) * Math.random())
  let s = n.toString(36)
  for (let i = s.length; i < 6; i++) {
    s = '0' + s
  }
  return s.substring(0, 6)
}

function compileParameters (route: Route, sessionId: string, doc: Document): string {
  const pairs = [
    `t=${Date.now()}`,
    `sid=${sessionId}`,
    `path=${encodeURIComponent(route.path)}`,
  ]
  const referrer = doc.referrer
  if (referrer.length > 0 && !referrer.includes(`//${doc.location.host}/`)) {
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

function reportNavigation (to: Route, sessionId: string, doc: Document = document) {
  const src = `/analytics.js?${compileParameters(to, sessionId, doc)}`
  const script = doc.createElement('script')
  script.setAttribute('src', src)
  script.setAttribute('async', 'async')
  script.addEventListener('load', () => doc.body.removeChild(script))
  doc.body.appendChild(script)
}

export default (ctx: Context) => {
  const sessionId = generateSessionId()
  ctx.app.router!.afterEach((to: Route, _from: Route, doc?: Document) => reportNavigation(to, sessionId, doc || document))
}
