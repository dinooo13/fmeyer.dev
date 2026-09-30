<script setup lang="ts">
const { data: page } = await useAsyncData('speaking', () => {
  return queryCollection('speaking').first()
})

const { data: talks } = await useAsyncData('speaking-talks', async () => {
  const entries = await queryCollection('talks').all()

  return sortTalks(entries)
})

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
    fatal: true
  })
}

usePageSeo(page.value)

const runtimeConfig = useRuntimeConfig()
const siteUrl = runtimeConfig.public.siteUrl.replace(/\/$/, '')

useSchemaOrg([
  defineBreadcrumb({
    itemListElement: [
      { name: 'Home', item: `${siteUrl}/` },
      { name: 'Speaking', item: `${siteUrl}/speaking/` }
    ]
  }),
  defineItemList({
    itemListElement: (talks.value ?? []).map((talk, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'url': `${siteUrl}${getTalkPath(talk)}`,
      'name': talk.title
    }))
  })
])
</script>

<template>
  <SpeakingView
    v-if="page"
    :page
    :talks="talks ?? []"
  />
</template>
