<script setup lang="ts">
import type { TalkEntry } from '../../utils/speaking'

type PreviewAction = {
  label: string
  to: string
}

const props = withDefaults(defineProps<{
  talk?: TalkEntry | null
  variant?: 'featured' | 'list'
  showSummary?: boolean
  showMeta?: boolean
  primaryAction?: PreviewAction
}>(), {
  variant: 'list',
  showSummary: true,
  showMeta: false
})

const badgeLabel = computed(() => props.talk?.placeholder ? 'Upcoming' : 'Talk')
</script>

<template>
  <UCard
    class="border border-default"
    :class="variant === 'list' ? 'h-full' : ''"
    :ui="{
      body: variant === 'featured' ? 'p-6 sm:p-8' : 'p-6 sm:p-8'
    }"
  >
    <div
      v-if="talk"
      class="flex h-full flex-col gap-5"
    >
      <div
        class="flex gap-4"
        :class="variant === 'list' ? 'flex-col lg:flex-row lg:items-start lg:justify-between' : 'flex-col'"
      >
        <div class="space-y-3">
          <UBadge
            color="warning"
            variant="soft"
            :label="badgeLabel"
          />

          <div class="space-y-2">
            <h3
              class="font-semibold text-highlighted"
              :class="variant === 'featured' ? 'text-xl sm:text-2xl' : 'text-2xl'"
            >
              {{ talk.title }}
            </h3>

            <p
              v-if="showSummary"
              class="text-sm text-muted"
            >
              {{ talk.summary }}
            </p>

            <p
              v-if="talk.topic"
              class="text-sm text-muted"
            >
              {{ talk.topic }}
            </p>
          </div>
        </div>

        <div
          v-if="showMeta"
          class="grid gap-4 text-sm text-muted sm:grid-cols-2 lg:min-w-[22rem]"
        >
          <div>
            <p class="font-medium text-highlighted">
              Event
            </p>
            <p>{{ talk.event }}</p>
          </div>
          <div>
            <p class="font-medium text-highlighted">
              Date
            </p>
            <p>{{ talk.dateLabel }}</p>
          </div>
          <div>
            <p class="font-medium text-highlighted">
              Location
            </p>
            <p>{{ talk.location }}</p>
          </div>
          <div>
            <p class="font-medium text-highlighted">
              Topic
            </p>
            <p>{{ talk.topic }}</p>
          </div>
        </div>
      </div>

      <div
        v-if="primaryAction"
        class="mt-auto"
      >
        <UButton
          :to="primaryAction.to"
          color="neutral"
          size="sm"
          icon="i-lucide-arrow-right"
          :label="primaryAction.label"
        />
      </div>
    </div>

    <div
      v-else
      class="max-w-2xl"
    >
      <p class="text-sm text-muted">
        No talk details are available yet.
      </p>
    </div>
  </UCard>
</template>
