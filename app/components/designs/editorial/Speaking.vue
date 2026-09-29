<script setup lang="ts">
import type { SpeakingCollectionItem, TalksCollectionItem } from '@nuxt/content'

defineProps<{
  page: SpeakingCollectionItem
  talks: TalksCollectionItem[]
}>()
</script>

<template>
  <div class="py-32">
    <h1>{{ page.title }}</h1>
  </div>
</template>
