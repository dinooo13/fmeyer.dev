<script setup lang="ts">
import type { IndexCollectionItem, LabsCollectionItem, TalksCollectionItem } from '@nuxt/content'

defineProps<{
  page: IndexCollectionItem
  labs: LabsCollectionItem[]
  talks: TalksCollectionItem[]
}>()
</script>

<template>
  <div class="py-32">
    <h1>{{ page.hero.name }}</h1>
  </div>
</template>
