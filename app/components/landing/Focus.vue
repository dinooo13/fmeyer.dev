<script setup lang="ts">
type FocusPage = {
  focus: {
    title: string
    description: string
    items: Array<{
      title: string
      description: string
    }>
  }
}

defineProps<{
  page: FocusPage
}>()
</script>

<template>
  <UPageSection
    :title="page.focus.title"
    :description="page.focus.description"
    :ui="{
      title: 'text-left text-2xl font-medium',
      description: 'max-w-2xl text-left text-sm text-muted'
    }"
  >
    <div class="grid gap-4 md:grid-cols-2">
      <Motion
        v-for="(item, index) in page.focus.items"
        :key="item.title"
        :initial="{ opacity: 0, transform: 'translateY(12px)' }"
        :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
        :transition="{ delay: index * 0.08 }"
        :in-view-options="{ once: true }"
      >
        <UCard
          class="h-full border border-default"
          :ui="{
            body: 'p-5 sm:p-6'
          }"
        >
          <h3 class="text-lg font-semibold text-highlighted">
            {{ item.title }}
          </h3>
          <p class="mt-3 text-sm text-muted">
            {{ item.description }}
          </p>
        </UCard>
      </Motion>
    </div>
  </UPageSection>
</template>
