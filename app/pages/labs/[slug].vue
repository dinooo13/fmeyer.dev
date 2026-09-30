<script setup lang="ts">
import { buildLabCreativeWorkSchema } from '../../utils/labs'

const route = useRoute()
const runtimeConfig = useRuntimeConfig()
const slug = Array.isArray(route.params.slug) ? route.params.slug[0] : route.params.slug

const { data: lab } = await useAsyncData(`lab-${slug}`, () => {
  return queryCollection('labs').where('stem', '=', `labs/${slug}`).first()
})

const { data: siblings } = await useAsyncData(`lab-siblings-${slug}`, async () => {
  const entries = await queryCollection('labs').all()
  return sortLabs(entries)
})

if (!lab.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Lab not found',
    fatal: true
  })
}

usePageSeo(lab.value)

const siteUrl = runtimeConfig.public.siteUrl.replace(/\/$/, '')
const canonicalUrl = `${siteUrl}/labs/${slug}/`
const identityId = `${siteUrl}/#identity`

useSchemaOrg([
  defineBreadcrumb({
    itemListElement: [
      { name: 'Home', item: `${siteUrl}/` },
      { name: 'Labs', item: `${siteUrl}/labs/` },
      { name: lab.value.title, item: canonicalUrl }
    ]
  }),
  buildLabCreativeWorkSchema(lab.value, canonicalUrl, identityId)
])

const relatedLabs = computed(() => {
  const current = lab.value
  const others = (siblings.value ?? []).filter(entry => entry.stem !== current?.stem)
  if (!current) return others.slice(0, 3)
  const currentTags = new Set(current.tags ?? [])

  const overlapping = others
    .map(entry => ({
      entry,
      overlap: (entry.tags ?? []).filter(tag => currentTags.has(tag)).length
    }))
    .filter(item => item.overlap > 0)
    .sort((left, right) => right.overlap - left.overlap)
    .map(item => item.entry)

  const seen = new Set<string | undefined>()
  const combined = [...overlapping, ...others].filter((entry) => {
    if (seen.has(entry.stem)) return false
    seen.add(entry.stem)
    return true
  })

  return combined.slice(0, 3)
})
</script>

<template>
  <LabDetailView
    v-if="lab"
    :lab
    :related="relatedLabs"
  />
</template>
