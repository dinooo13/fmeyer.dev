<script setup lang="ts">
type Lab = {
  title: string
  description: string
  status: 'wip' | 'prototype' | 'paused'
  image: string
  url?: string
  repoUrl?: string
  tags: string[]
  date: string | Date
  note?: string
}

type LabsSection = {
  title: string
  description: string
  link: {
    label: string
    to?: string
    color?: 'primary' | 'neutral' | 'success' | 'warning' | 'error' | 'info'
    variant?: 'solid' | 'outline' | 'subtle' | 'soft' | 'ghost' | 'link'
    target?: '_blank' | '_self'
  }
}

defineProps<{
  section: LabsSection
  labs: Lab[]
}>()
</script>

<template>
  <UPageSection
    :title="section.title"
    :description="section.description"
    :ui="{
      title: 'text-left text-2xl font-medium',
      description: 'max-w-3xl text-left text-sm text-muted'
    }"
  >
    <div class="grid gap-6 lg:grid-cols-3">
      <Motion
        v-for="(lab, index) in labs"
        :key="lab.title"
        :initial="{ opacity: 0, transform: 'translateY(12px)' }"
        :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
        :transition="{ delay: index * 0.08 }"
        :in-view-options="{ once: true }"
      >
        <LabCard :lab="lab" />
      </Motion>
    </div>

    <div class="mt-6">
      <UButton v-bind="section.link" />
    </div>
  </UPageSection>
</template>
