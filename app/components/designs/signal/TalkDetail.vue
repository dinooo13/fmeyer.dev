<script setup lang="ts">
import type { TalksCollectionItem } from '@nuxt/content'

defineProps<{
  talk: ResolvedTalkEntry<TalksCollectionItem>
  subtitle: string | null
  related: TalksCollectionItem[]
}>()
</script>

<template>
  <div class="py-32">
    <h1>{{ talk.title }}</h1>
  </div>
</template>
