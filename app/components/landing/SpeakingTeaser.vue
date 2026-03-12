<script setup lang="ts">
import type { TalkEntry } from '../../utils/speaking'

type SpeakingSection = {
  title: string
  description: string
  note?: string
  link: {
    label: string
    icon?: string
    to?: string
    color?: 'primary' | 'neutral' | 'success' | 'warning' | 'error' | 'info'
    variant?: 'solid' | 'outline' | 'subtle' | 'soft' | 'ghost' | 'link'
    target?: '_blank' | '_self'
  }
}

defineProps<{
  section: SpeakingSection
  talk?: TalkEntry | null
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
    <Motion
      class="mb-4"
      :initial="{ opacity: 0, transform: 'translateY(12px)' }"
      :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
      :in-view-options="{ once: true }"
    >
      <UButton
        v-bind="section.link"
        color="neutral"
      />
    </Motion>

    <UCard
      class="border border-default"
      :ui="{
        body: 'p-6 sm:p-8'
      }"
    >
      <div class="max-w-2xl">
        <p
          v-if="section.note"
          class="text-sm font-medium text-highlighted"
        >
          {{ section.note }}
        </p>
        <h3
          v-if="talk"
          class="mt-2 text-xl font-semibold text-highlighted"
        >
          {{ talk.title }}
        </h3>
        <p class="mt-2 text-sm text-muted">
          {{ talk?.description || section.description }}
        </p>
        <p
          v-if="talk?.topic"
          class="mt-2 text-sm text-muted"
        >
          {{ talk.topic }}
        </p>
      </div>
    </UCard>
  </UPageSection>
</template>
