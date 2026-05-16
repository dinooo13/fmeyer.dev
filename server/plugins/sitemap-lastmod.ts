import { collectContentLastmod } from '../../build/sitemap-lastmod'

type SitemapUrl = {
  loc?: string | { pathname?: string }
  lastmod?: string
}

type SitemapResolvedContext = {
  urls: SitemapUrl[]
}

export default defineNitroPlugin((nitroApp) => {
  // Replace the autoLastmod default (file mtime — always today) with the
  // actual date the underlying YAML content carries, so search engines get
  // accurate per-URL freshness signals.
  // @ts-expect-error sitemap:resolved is contributed by @nuxtjs/sitemap and
  // is not part of the base NitroAppHooks type registry.
  nitroApp.hooks.hook('sitemap:resolved', async (ctx: SitemapResolvedContext) => {
    const lastmodByPath = await collectContentLastmod(process.cwd())

    const extractPath = (loc: SitemapUrl['loc']): string | null => {
      if (!loc) return null
      const raw = typeof loc === 'string' ? loc : loc.pathname
      if (!raw) return null
      try {
        return new URL(raw, 'http://localhost').pathname.replace(/\/$/, '') || '/'
      } catch {
        return raw.replace(/\/$/, '') || '/'
      }
    }

    for (const url of ctx.urls) {
      const path = extractPath(url.loc)
      if (!path) continue
      const match = lastmodByPath.get(path)
      if (match) url.lastmod = match
    }
  })
})
