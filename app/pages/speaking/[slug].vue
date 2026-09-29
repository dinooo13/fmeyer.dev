<script setup lang="ts">
import { buildTalkEventSchema, resolveTalkEntry } from '../../utils/speaking'

const route = useRoute()
const runtimeConfig = useRuntimeConfig()
const slug = Array.isArray(route.params.slug) ? route.params.slug[0] : route.params.slug

const { data: talk } = await useAsyncData(`talk-${slug}`, async () => {
  const entry = await queryCollection('talks').where('stem', '=', `speaking/${slug}`).first()

  return entry ? resolveTalkEntry(entry) : null
})

const { data: siblings } = await useAsyncData(`talk-siblings-${slug}`, async () => {
  const entries = await queryCollection('talks').all()
  return sortTalks(entries)
})

if (!talk.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Talk not found',
    fatal: true
  })
}

usePageSeo({
  title: talk.value.title,
  description: talk.value.summary ?? talk.value.description
})

const siteUrl = runtimeConfig.public.siteUrl.replace(/\/$/, '')
const canonicalUrl = `${siteUrl}/speaking/${slug}`
const identityId = `${siteUrl}/#identity`

useSchemaOrg([
  defineBreadcrumb({
    itemListElement: [
      { name: 'Home', item: `${siteUrl}/` },
      { name: 'Speaking', item: `${siteUrl}/speaking` },
      { name: talk.value.title, item: canonicalUrl }
    ]
  }),
  buildTalkEventSchema(talk.value, canonicalUrl, identityId)
])

const organizerSubtitle = computed(() => {
  if (!talk.value?.organizerTitle) {
    return null
  }

  const prefix = `${talk.value.title}: `

  return talk.value.organizerTitle.startsWith(prefix)
    ? talk.value.organizerTitle.slice(prefix.length)
    : talk.value.organizerTitle
})

const relatedTalks = computed(() => {
  const current = talk.value
  return (siblings.value ?? [])
    .filter(entry => entry.stem !== current?.stem)
    .slice(0, 3)
})
</script>

<template>
  <TalkDetailView
    v-if="talk"
    :talk
    :subtitle="organizerSubtitle"
    :related="relatedTalks"
  />
</template>
