<script setup lang="ts">
type ExperiencePage = {
  experience: {
    title: string
    description: string
    items: Array<{
      period: string
      title: string
      organization: string
      summary: string
      highlights: string[]
      placeholder?: boolean
    }>
  }
}

defineProps<{
  page: ExperiencePage
}>()
</script>

<template>
  <UPageSection
    :title="page.experience.title"
    :description="page.experience.description"
    :ui="{
      title: 'text-left text-2xl font-medium',
      description: 'max-w-2xl text-left text-sm text-muted'
    }"
  >
    <div class="relative space-y-6 border-l border-default pl-6 sm:pl-8">
      <Motion
        v-for="(experience, index) in page.experience.items"
        :key="experience.title"
        :initial="{ opacity: 0, transform: 'translateY(16px)' }"
        :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
        :transition="{ delay: index * 0.1 }"
        :in-view-options="{ once: true }"
        class="relative"
      >
        <span class="absolute -left-[1.95rem] top-6 size-3 rounded-full border border-default bg-default sm:-left-[2.45rem]" />

        <UCard
          class="border border-default"
          :class="experience.placeholder ? 'border-dashed bg-elevated/40' : ''"
          :ui="{
            body: 'p-5 sm:p-6'
          }"
        >
          <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p class="text-xs font-medium uppercase tracking-[0.24em] text-muted">
                {{ experience.period }}
              </p>
              <h3 class="mt-2 text-lg font-semibold text-highlighted">
                {{ experience.title }}
              </h3>
              <p class="mt-1 text-sm text-muted">
                {{ experience.organization }}
              </p>
            </div>

            <UBadge
              v-if="experience.placeholder"
              label="Placeholder"
              color="neutral"
              variant="subtle"
            />
          </div>

          <p class="mt-4 text-sm text-muted">
            {{ experience.summary }}
          </p>

          <ul
            v-if="experience.highlights.length"
            class="mt-4 space-y-2"
          >
            <li
              v-for="highlight in experience.highlights"
              :key="highlight"
              class="flex items-start gap-2 text-sm text-muted"
            >
              <UIcon
                name="i-lucide-arrow-up-right"
                class="mt-0.5 size-4 shrink-0 text-primary"
              />
              <span>{{ highlight }}</span>
            </li>
          </ul>
        </UCard>
      </Motion>
    </div>
  </UPageSection>
</template>
