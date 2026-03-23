type SeoInput = {
  title?: string
  description?: string
  seo?: {
    title?: string
    description?: string
  } | null
}

export function usePageSeo(page: SeoInput) {
  const title = page.seo?.title || page.title
  const description = page.seo?.description || page.description

  useSeoMeta({
    title,
    ogTitle: title,
    description,
    ogDescription: description
  })
}
