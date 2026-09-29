<script setup lang="ts">
withDefaults(defineProps<{
  id: string
  title: string
  description?: string
  icon: string
  tint?: 'blue' | 'amber' | 'violet' | 'emerald' | 'rose'
}>(), {
  description: undefined,
  tint: 'blue'
})
</script>

<template>
  <div class="flex flex-col items-start gap-5 sm:flex-row sm:items-end sm:justify-between">
    <div
      class="max-w-2xl"
      :class="`studio-tint-${tint}`"
    >
      <div class="flex items-center gap-3">
        <span class="studio-chip size-9 rounded-xl">
          <UIcon
            :name="icon"
            class="size-[1.15rem]"
          />
        </span>
        <h2
          :id="id"
          class="studio-display text-3xl font-bold text-highlighted sm:text-4xl"
        >
          {{ title }}
        </h2>
      </div>
      <p
        v-if="description"
        class="mt-3 text-base text-pretty text-muted"
      >
        {{ description }}
      </p>
    </div>
    <slot name="action" />
  </div>
</template>
