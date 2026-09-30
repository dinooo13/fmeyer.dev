<script setup lang="ts">
const { data: page } = await useAsyncData('labs-page', () => {
  return queryCollection('pages').path('/labs').first()
})

const { data: labs } = await useAsyncData('labs', async () => {
  const entries = await queryCollection('labs').all()

  return sortLabs(entries)
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
      { name: 'Labs', item: `${siteUrl}/labs/` }
    ]
  }),
  defineItemList({
    itemListElement: (labs.value ?? []).map((lab, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'url': `${siteUrl}${getLabPath(lab)}`,
      'name': lab.title
    }))
  })
])
</script>

<template>
  <LabsView
    v-if="page"
    :page
    :labs="labs ?? []"
  />
</template>
