<script setup lang="ts">
import type { LabsCollectionItem } from '@nuxt/content'

const props = defineProps<{
  lab: LabsCollectionItem
  related: LabsCollectionItem[]
}>()

const relatedTints = ['emerald', 'amber', 'blue'] as const

const status = computed(() => labStatusMap[props.lab.status])
const statusIcon = computed(() => labStatusIconMap[props.lab.status])
const isoDate = computed(() => new Date(props.lab.date).toISOString().slice(0, 10))
const hasActions = computed(() => Boolean(props.lab.url || props.lab.repoUrl))

// Split the six desktop columns between Challenge and Approach so both tiles
// end up with a similar number of lines. Ties keep the even 3/3 split.
const spanClasses: Record<number, { chars: number, className: string }> = {
  2: { chars: 44, className: 'lg:col-span-2' },
  3: { chars: 70, className: 'lg:col-span-3' },
  4: { chars: 103, className: 'lg:col-span-4' }
}

const storySpans = computed(() => {
  const lines = (text: string, span: number) => Math.ceil(text.length / spanClasses[span]!.chars)
  const imbalance = (span: number) => Math.abs(lines(props.lab.challenge, span) - lines(props.lab.approach, 6 - span))
  const challengeSpan = [3, 2, 4].reduce((best, span) => imbalance(span) < imbalance(best) ? span : best)

  return {
    challenge: spanClasses[challengeSpan]!.className,
    approach: spanClasses[6 - challengeSpan]!.className
  }
})
</script>

<template>
  <div class="mx-auto max-w-6xl px-3 sm:px-6 lg:px-8">
    <nav
      aria-label="Breadcrumb"
      class="studio-enter mb-4 sm:mb-5"
    >
      <ol class="studio-glass inline-flex max-w-full items-center gap-1 rounded-full p-1 pr-4 text-sm ring-1 ring-(--studio-card-ring)">
        <li class="shrink-0">
          <NuxtLink
            to="/labs"
            class="studio-link group inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-semibold text-highlighted transition-colors hover:bg-(--ui-bg-accented)/60"
          >
            <UIcon
              name="i-lucide-arrow-left"
              class="size-4"
            />
            <span>All labs</span>
          </NuxtLink>
        </li>
        <li
          class="flex min-w-0 items-center gap-1 text-muted"
          aria-current="page"
        >
          <UIcon
            name="i-lucide-chevron-right"
            class="size-4 shrink-0 text-dimmed"
          />
          <span class="truncate font-medium">{{ lab.title }}</span>
        </li>
      </ol>
    </nav>

    <article
      aria-labelledby="studio-lab-title"
      class="grid gap-3 sm:gap-4 lg:grid-cols-6"
    >
      <!-- Hero -->
      <header
        class="studio-tile studio-glass studio-enter studio-tint-violet relative flex flex-col gap-8 overflow-hidden p-7 sm:p-10 lg:col-span-4"
        style="--studio-i: 0"
      >
        <div
          class="pointer-events-none absolute -top-28 -right-16 size-96 rounded-full bg-[radial-gradient(closest-side,var(--studio-blob-3),transparent)]"
          aria-hidden="true"
        />
        <div class="relative">
          <span class="studio-chip size-16 rounded-[1.35rem]">
            <UIcon
              :name="lab.icon || 'i-lucide-box'"
              class="size-8"
            />
          </span>
          <h1
            id="studio-lab-title"
            class="studio-display mt-6 text-5xl leading-[0.95] font-extrabold text-balance text-highlighted sm:text-6xl lg:text-7xl"
          >
            {{ lab.title }}
          </h1>
          <p class="mt-5 max-w-2xl text-lg leading-8 text-pretty text-toned">
            {{ lab.description }}
          </p>
        </div>

        <nav
          v-if="hasActions"
          aria-label="Lab actions"
          class="relative mt-auto"
        >
          <ul class="flex flex-wrap items-center gap-2">
            <li v-if="lab.url">
              <a
                :href="lab.url"
                target="_blank"
                rel="noopener noreferrer"
                class="studio-btn studio-btn-solid group px-5 py-2.5"
              >
                <UIcon
                  name="i-lucide-external-link"
                  class="size-4"
                />
                Open demo<span class="sr-only"> of {{ lab.title }} (opens in a new tab)</span>
              </a>
            </li>
            <li v-if="lab.repoUrl">
              <a
                :href="lab.repoUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="studio-btn group px-5 py-2.5"
                :class="lab.url ? 'studio-btn-soft' : 'studio-btn-solid'"
              >
                <UIcon
                  name="i-simple-icons-github"
                  class="size-4"
                />
                View source<span class="sr-only"> of {{ lab.title }} on GitHub (opens in a new tab)</span>
                <UIcon
                  name="i-lucide-arrow-up-right"
                  class="studio-arrow studio-arrow-diagonal size-4"
                />
              </a>
            </li>
          </ul>
        </nav>
      </header>

      <!-- Facts -->
      <section
        aria-labelledby="studio-lab-facts"
        class="studio-tile studio-enter flex flex-col gap-6 p-7 sm:p-8 lg:col-span-2"
        style="--studio-i: 1"
      >
        <h2
          id="studio-lab-facts"
          class="text-xs font-semibold tracking-wide text-muted uppercase"
        >
          At a glance
        </h2>
        <dl class="grid grid-cols-2 gap-x-4 gap-y-6 lg:grid-cols-1">
          <div>
            <dt class="text-sm font-medium text-muted">
              Status
            </dt>
            <dd class="mt-2">
              <span class="studio-tag gap-1.5 text-sm">
                <UIcon
                  :name="statusIcon"
                  class="size-3.5"
                />
                {{ status.label }}
              </span>
            </dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-muted">
              Date
            </dt>
            <dd class="studio-display mt-1.5 text-lg font-bold text-highlighted sm:text-xl">
              <time :datetime="isoDate">{{ formatLabDate(lab.date) }}</time>
            </dd>
          </div>
          <div
            v-if="lab.tags.length"
            class="col-span-2 lg:col-span-1"
          >
            <dt class="text-sm font-medium text-muted">
              Tags
            </dt>
            <dd class="mt-2">
              <ul
                class="flex flex-wrap gap-2"
                :aria-label="`${lab.title} tags`"
              >
                <li
                  v-for="tag in lab.tags"
                  :key="tag"
                  class="studio-tag"
                >
                  {{ tag }}
                </li>
              </ul>
            </dd>
          </div>
        </dl>
        <p class="mt-auto border-t border-(--ui-border) pt-5 text-sm text-muted">
          Built by
          <NuxtLink
            to="/"
            class="studio-link font-semibold text-highlighted underline-offset-4 hover:underline"
          >Fabian Meyer</NuxtLink>
        </p>
      </section>

      <!-- Image -->
      <figure
        v-if="lab.image"
        class="studio-tile studio-enter overflow-hidden lg:col-span-6"
        style="--studio-i: 2"
      >
        <NuxtImg
          :src="lab.image"
          :alt="`${lab.title} project preview`"
          sizes="100vw lg:1152px"
          densities="x1 x2"
          loading="lazy"
          class="aspect-[16/9] w-full object-cover"
        />
      </figure>

      <!-- Challenge -->
      <section
        aria-labelledby="studio-lab-challenge"
        class="studio-tile studio-tinted studio-tint-amber studio-enter p-7 sm:p-8"
        :class="storySpans.challenge"
        style="--studio-i: 2"
      >
        <div class="flex items-center gap-3">
          <span class="studio-chip size-10 rounded-2xl">
            <UIcon
              name="i-lucide-mountain"
              class="size-5"
            />
          </span>
          <h2
            id="studio-lab-challenge"
            class="studio-display studio-ink text-2xl font-bold"
          >
            Challenge
          </h2>
        </div>
        <p class="mt-5 text-base leading-7 text-pretty text-toned">
          {{ lab.challenge }}
        </p>
      </section>

      <!-- Approach -->
      <section
        aria-labelledby="studio-lab-approach"
        class="studio-tile studio-tinted studio-tint-blue studio-enter p-7 sm:p-8"
        :class="storySpans.approach"
        style="--studio-i: 3"
      >
        <div class="flex items-center gap-3">
          <span class="studio-chip size-10 rounded-2xl">
            <UIcon
              name="i-lucide-route"
              class="size-5"
            />
          </span>
          <h2
            id="studio-lab-approach"
            class="studio-display studio-ink text-2xl font-bold"
          >
            Approach
          </h2>
        </div>
        <p class="mt-5 text-base leading-7 text-pretty text-toned">
          {{ lab.approach }}
        </p>
      </section>

      <!-- Next steps -->
      <section
        aria-labelledby="studio-lab-next"
        class="studio-tile studio-tint-emerald studio-enter p-7 sm:p-8"
        :class="lab.note ? 'lg:col-span-4' : 'lg:col-span-6'"
        style="--studio-i: 4"
      >
        <div class="flex items-center gap-3">
          <span class="studio-chip size-10 rounded-2xl">
            <UIcon
              name="i-lucide-list-checks"
              class="size-5"
            />
          </span>
          <h2
            id="studio-lab-next"
            class="studio-display text-2xl font-bold text-highlighted"
          >
            Next steps
          </h2>
        </div>
        <ol
          class="mt-5 grid gap-2.5"
          :class="lab.note ? '' : 'lg:grid-cols-3'"
        >
          <li
            v-for="(step, index) in lab.nextSteps"
            :key="step"
            class="flex items-start gap-3 rounded-2xl bg-(--studio-emerald-surface) p-4 text-[0.95rem] leading-6 text-toned ring-1 ring-(--studio-emerald-ring)"
          >
            <span
              class="mt-px flex size-6 shrink-0 items-center justify-center rounded-full bg-(--studio-card) text-xs font-bold text-(--studio-emerald-ink) ring-2 ring-(--studio-emerald-chip)/40"
              aria-hidden="true"
            >{{ index + 1 }}</span>
            <span>{{ step }}</span>
          </li>
        </ol>
      </section>

      <!-- Note -->
      <aside
        v-if="lab.note"
        aria-labelledby="studio-lab-note"
        class="studio-tile studio-tinted studio-tint-rose studio-enter flex flex-col gap-4 p-7 sm:p-8 lg:col-span-2"
        style="--studio-i: 5"
      >
        <div class="flex items-center gap-3">
          <span class="studio-chip size-10 rounded-2xl">
            <UIcon
              name="i-lucide-info"
              class="size-5"
            />
          </span>
          <h2
            id="studio-lab-note"
            class="studio-display studio-ink text-2xl font-bold"
          >
            Note
          </h2>
        </div>
        <p class="text-lg leading-8 font-medium text-pretty text-toned">
          {{ lab.note }}
        </p>
      </aside>
    </article>

    <!-- Related -->
    <section
      v-if="related.length"
      aria-labelledby="studio-related-labs"
      class="mt-20 sm:mt-24"
    >
      <DesignsStudioSectionHeading
        id="studio-related-labs"
        title="More from the lab"
        description="Other projects from the same playground."
        icon="i-lucide-flask-conical"
        tint="violet"
      >
        <template #action>
          <NuxtLink
            to="/labs"
            class="studio-btn studio-btn-soft group shrink-0"
          >
            All labs
            <UIcon
              name="i-lucide-arrow-right"
              class="studio-arrow size-4"
            />
          </NuxtLink>
        </template>
      </DesignsStudioSectionHeading>

      <ul
        class="mt-8 grid gap-4 md:grid-cols-2"
        :class="related.length > 2 ? 'lg:grid-cols-3' : ''"
        aria-label="Related lab projects"
      >
        <Motion
          v-for="(item, index) in related"
          :key="item.title"
          as="li"
          :initial="{ opacity: 0, transform: 'translateY(16px)' }"
          :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
          :transition="{ delay: index * 0.08, duration: 0.5 }"
          :in-view-options="{ once: true }"
        >
          <DesignsStudioLabCard
            :lab="item"
            :tint="relatedTints[index % relatedTints.length]"
          />
        </Motion>
      </ul>
    </section>
  </div>
</template>
