<script setup lang="ts">
import type { LabsCollectionItem } from '@nuxt/content'

defineProps<{
  lab: LabsCollectionItem
  related: LabsCollectionItem[]
}>()
</script>

<template>
  <div class="py-32">
    <h1>{{ lab.title }}</h1>
  </div>
</template>
