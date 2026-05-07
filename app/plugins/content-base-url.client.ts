// @nuxt/content v3 fetches `/__nuxt_content/*` from origin root and ignores
// `app.baseURL`, so PR previews deployed under `/pr-<n>/` 404 on first query.
// Wrap globalThis.$fetch in a Proxy that prefixes the base URL for those
// requests only. A Proxy preserves $fetch.raw / .create / .native, which
// other Nuxt internals rely on.
export default defineNuxtPlugin({
  name: 'content-base-url',
  enforce: 'pre',
  setup() {
    const baseURL = useRuntimeConfig().app.baseURL
    if (!baseURL || baseURL === '/') return

    const prefix = baseURL.replace(/\/$/, '')
    const original = globalThis.$fetch

    const rewrite = (input: unknown) => {
      if (typeof input === 'string' && input.startsWith('/__nuxt_content/')) {
        return prefix + input
      }
      return input
    }

    globalThis.$fetch = new Proxy(original, {
      apply(target, thisArg, args) {
        if (args.length > 0) args[0] = rewrite(args[0])
        return Reflect.apply(target as (...a: unknown[]) => unknown, thisArg, args)
      },
      get(target, prop, receiver) {
        const value = Reflect.get(target, prop, receiver)
        if (prop === 'raw' && typeof value === 'function') {
          return new Proxy(value, {
            apply(rawTarget, rawThis, rawArgs) {
              if (rawArgs.length > 0) rawArgs[0] = rewrite(rawArgs[0])
              return Reflect.apply(rawTarget as (...a: unknown[]) => unknown, rawThis, rawArgs)
            }
          })
        }
        return value
      }
    }) as typeof globalThis.$fetch
  }
})
