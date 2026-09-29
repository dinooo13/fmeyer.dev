<script setup lang="ts">
import type { TalksCollectionItem } from '@nuxt/content'

const props = defineProps<{
  talks: TalksCollectionItem[]
}>()

// Every line below is lifted from the Spec, Code, Verify workshop / course
// abstracts — nothing here is invented.
const steps = [
  { key: 'spec', tone: 't-spec', detail: 'ticket → structured spec' },
  { key: 'code', tone: 't-code', detail: 'task patterns · skills · subagents' },
  { key: 'verify', tone: 't-verify', detail: 'quality gates · automated checks' }
]

const workshop = computed(() => props.talks.find(talk => /workshop/i.test(talk.format ?? '')))
</script>

<template>
  <figure class="m-0">
    <div class="signal-terminal">
      <div class="signal-terminal-inner">
        <div class="flex items-center gap-3 border-b border-white/[0.07] px-4 py-3">
          <span
            class="flex gap-1.5"
            aria-hidden="true"
          >
            <span class="size-2.5 rounded-full bg-[#ff5f57]/85" />
            <span class="size-2.5 rounded-full bg-[#febc2e]/85" />
            <span class="size-2.5 rounded-full bg-[#28c840]/85" />
          </span>
          <span class="signal-mono t-dim truncate text-[0.72rem]">agent-session — spec-code-verify</span>
          <span class="signal-mono t-ok ml-auto hidden shrink-0 items-center gap-1.5 text-[0.68rem] sm:inline-flex">
            <span
              class="size-1.5 rounded-full bg-[#4ade80]"
              aria-hidden="true"
            />
            session ok
          </span>
        </div>

        <div class="signal-mono space-y-1.5 px-3.5 py-5 text-[0.72rem] leading-relaxed sm:px-5 sm:text-[0.8rem]">
          <p
            class="t-line"
            style="animation-delay: 0.15s"
          >
            <span class="t-prompt">❯</span> <span class="t-strong">agent run</span> <span class="t-dim">--workflow</span> spec-code-verify
          </p>

          <ol
            class="space-y-1.5 py-1"
            aria-label="Pipeline steps"
          >
            <li
              v-for="(step, index) in steps"
              :key="step.key"
              class="t-line grid grid-cols-[3.25rem_minmax(0,1fr)_auto] items-baseline gap-x-1.5 sm:grid-cols-[auto_4.25rem_minmax(0,1fr)_auto] sm:gap-x-2"
              :style="{ animationDelay: `${0.3 + index * 0.15}s` }"
            >
              <span class="t-dim hidden sm:inline">{{ index + 1 }}/{{ steps.length }}</span>
              <span :class="step.tone">{{ step.key }}</span>
              <span class="text-pretty">{{ step.detail }}</span>
              <span class="t-ok"><span aria-hidden="true">✓</span><span class="sr-only">passed</span></span>
            </li>
          </ol>

          <p
            class="t-line t-dim"
            style="animation-delay: 0.8s"
          >
            <span class="t-ok">→</span> reviewable result, ready for human review
          </p>

          <p
            class="t-line pt-3"
            style="animation-delay: 0.95s"
          >
            <span class="t-prompt">❯</span> <span
              class="signal-cursor"
              aria-hidden="true"
            />
          </p>
        </div>
      </div>
    </div>

    <figcaption
      v-if="workshop"
      class="mt-4 flex items-center gap-2 px-1 text-sm text-muted"
    >
      <UIcon
        name="i-lucide-presentation"
        class="size-4 shrink-0 text-primary"
      />
      <span>
        The workflow from
        <NuxtLink
          :to="getTalkPath(workshop)"
          class="font-medium text-highlighted underline decoration-(--ui-border-accented) underline-offset-4 hover:decoration-(--ui-primary)"
        >my {{ workshop.format?.toLowerCase() }} at {{ workshop.event }}</NuxtLink>
      </span>
    </figcaption>
  </figure>
</template>
