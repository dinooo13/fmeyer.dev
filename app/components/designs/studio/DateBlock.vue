<script setup lang="ts">
const props = withDefaults(defineProps<{
  date?: string | Date | null
  label: string
  size?: 'md' | 'lg'
}>(), {
  date: null,
  size: 'md'
})

const parts = computed(() => {
  const timestamp = getTimestamp(props.date)

  if (timestamp === null) return null

  const value = new Date(timestamp)
  const format = (options: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat('en', { ...options, timeZone: 'UTC' }).format(value)

  return {
    month: format({ month: 'short' }),
    day: format({ day: 'numeric' }),
    year: format({ year: 'numeric' }),
    iso: value.toISOString().slice(0, 10)
  }
})
</script>

<template>
  <div
    class="studio-dateblock flex shrink-0 flex-col self-start overflow-hidden rounded-2xl bg-(--studio-card) text-center shadow-sm ring-1 ring-(--tint-ring,var(--ui-border))"
    :class="size === 'lg' ? 'w-20' : 'w-16'"
  >
    <template v-if="parts">
      <span
        class="studio-chip rounded-none py-1 text-[0.7rem] font-bold tracking-[0.14em] uppercase shadow-none"
        aria-hidden="true"
      >{{ parts.month }}</span>
      <span
        class="studio-display font-bold text-highlighted"
        :class="size === 'lg' ? 'pt-1.5 text-4xl leading-none' : 'pt-1 text-3xl leading-none'"
        aria-hidden="true"
      >{{ parts.day }}</span>
      <span
        class="pt-1 pb-1.5 text-[0.7rem] font-medium text-muted"
        aria-hidden="true"
      >{{ parts.year }}</span>
      <time
        class="sr-only"
        :datetime="parts.iso"
      >{{ label }}</time>
    </template>
    <template v-else>
      <span
        class="studio-chip rounded-none py-1 text-[0.7rem] font-bold tracking-[0.14em] uppercase shadow-none"
        aria-hidden="true"
      >TBA</span>
      <span class="flex flex-1 items-center justify-center py-3">
        <UIcon
          name="i-lucide-calendar-clock"
          class="size-6 text-muted"
        />
        <span class="sr-only">{{ label }}</span>
      </span>
    </template>
  </div>
</template>
