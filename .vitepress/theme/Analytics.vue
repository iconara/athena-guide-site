<script setup lang="ts">
import {ref, onMounted} from 'vue'
import {useRouter, useRoute} from 'vitepress'

const sessionId = generateSessionId()
const root = ref<HTMLElement | null>(null);
const route = useRoute()
const router = useRouter()

function generateSessionId (): string {
  const n = Math.floor((36 ** 6) * Math.random())
  let s = n.toString(36)
  for (let i = s.length; i < 6; i++) {
    s = '0' + s
  }
  return s.substring(0, 6)
}

function createAnalyticsUrl(doc: Document): string {
  const pairs = [
    `t=${Date.now()}`,
    `sid=${sessionId}`,
    `path=${encodeURIComponent(route.path)}`,
  ]
  const referrer = doc.referrer
  if (referrer.length > 0 && !referrer.includes(`//${doc.location.host}/`)) {
    pairs.push(`referrer=${encodeURIComponent(referrer)}`)
  }
  return '/analytics.js?' + pairs.join('&')
}

function updateAnalytics() {
  const container = root.value
  if (container !== null) {
    const doc = container?.ownerDocument
    const url = createAnalyticsUrl(doc)
    const script = doc.createElement('script')
    script.setAttribute('src', url)
    script.setAttribute('async', 'async')
    script.addEventListener('load', () => doc.body.removeChild(script))
    doc.body.appendChild(script)
  }
}

onMounted(updateAnalytics)
router.onAfterRouteChanged = updateAnalytics
</script>

<template>
  <div ref="root"/>
</template>
