<script setup lang="ts">
import type { LabsCollectionItem, PagesCollectionItem } from '@nuxt/content'

defineProps<{
  page: PagesCollectionItem
  labs: LabsCollectionItem[]
}>()
</script>

<template>
  <div class="py-32">
    <h1>{{ page.title }}</h1>
  </div>
</template>
