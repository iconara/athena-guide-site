import {Context} from '@nuxt/types'
import {Route} from 'vue-router'

function reportNavigation (route: Route) {
  const src = `/analytics.js?t=${Date.now()}&path=${encodeURIComponent(route.path)}`
  const script = document.createElement('script')
  script.setAttribute('src', src)
  script.setAttribute('async', 'async')
  script.addEventListener('load', () => document.body.removeChild(script))
  document.body.appendChild(script)
}

export default (ctx: Context) => {
  ctx.app.router!.afterEach(reportNavigation)
}
