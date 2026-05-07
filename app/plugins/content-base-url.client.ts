// @nuxt/content v3 fetches `/__nuxt_content/*` from origin root and ignores
// `app.baseURL`, so PR previews deployed under `/pr-<n>/` 404 on first query.
// Patch globalThis.$fetch to prefix the base URL for those requests only.
export default defineNuxtPlugin({
  name: 'content-base-url',
  enforce: 'pre',
  setup() {
    const baseURL = useRuntimeConfig().app.baseURL
    if (!baseURL || baseURL === '/') return

    const prefix = baseURL.replace(/\/$/, '')
    const original = globalThis.$fetch

    const patched = ((request: Parameters<typeof original>[0], options?: Parameters<typeof original>[1]) => {
      if (typeof request === 'string' && request.startsWith('/__nuxt_content/')) {
        request = prefix + request
      }
      return original(request, options)
    }) as unknown as typeof globalThis.$fetch

    for (const key of Object.keys(original)) {
      (patched as unknown as Record<string, unknown>)[key] = (original as unknown as Record<string, unknown>)[key]
    }

    globalThis.$fetch = patched
  }
})
