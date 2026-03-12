<script setup lang="ts">
type SpeakingSection = {
  title: string
  description: string
  note?: string
  link: {
    label: string
    to?: string
    color?: 'primary' | 'neutral' | 'success' | 'warning' | 'error' | 'info'
    variant?: 'solid' | 'outline' | 'subtle' | 'soft' | 'ghost' | 'link'
    target?: '_blank' | '_self'
  }
}

defineProps<{
  section: SpeakingSection
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
    <UCard
      class="border border-default"
      :ui="{
        body: 'flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8'
      }"
    >
      <div>
        <p
          v-if="section.note"
          class="text-sm font-medium text-highlighted"
        >
          {{ section.note }}
        </p>
        <p class="mt-2 max-w-2xl text-sm text-muted">
          The speaking page starts with what is real now: an upcoming first talk and space for future talks and workshops once they exist.
        </p>
      </div>

      <UButton v-bind="section.link" />
    </UCard>
  </UPageSection>
</template>
