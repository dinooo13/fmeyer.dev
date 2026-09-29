<script setup lang="ts">
import type { TalksCollectionItem } from '@nuxt/content'

const props = defineProps<{
  talk: ResolvedTalkEntry<TalksCollectionItem>
  subtitle: string | null
  related: TalksCollectionItem[]
}>()

const relatedTints = ['blue', 'amber', 'violet'] as const
const resourceTints = ['blue', 'amber', 'violet', 'rose'] as const

const resourceMeta: Record<ResolvedTalkResource['kind'], { label: string, icon: string }> = {
  slides: { label: 'Slides', icon: 'i-lucide-presentation' },
  recording: { label: 'Recording', icon: 'i-lucide-video' },
  handout: { label: 'Handout', icon: 'i-lucide-file-text' },
  link: { label: 'Link', icon: 'i-lucide-link' }
}

const isUpcoming = computed(() => {
  const timestamp = getTimestamp(props.talk.date)
  return props.talk.placeholder || (timestamp !== null && timestamp >= Date.now() - 86_400_000)
})

const facts = computed(() => [
  { label: 'Event', value: props.talk.event, icon: 'i-lucide-ticket' },
  { label: 'Location', value: props.talk.location, icon: props.talk.location === 'Online' ? 'i-lucide-globe' : 'i-lucide-map-pin' },
  { label: 'Room', value: props.talk.room, icon: 'i-lucide-door-open' },
  { label: 'Time', value: props.talk.time, icon: 'i-lucide-clock' },
  { label: 'Duration', value: props.talk.duration, icon: 'i-lucide-hourglass' },
  { label: 'Format', value: props.talk.format, icon: 'i-lucide-presentation' },
  { label: 'Language', value: props.talk.language, icon: 'i-lucide-languages' },
  { label: 'Level', value: props.talk.level, icon: 'i-lucide-gauge' }
].filter((fact): fact is { label: string, value: string, icon: string } => Boolean(fact.value)))

const showEventLink = computed(() => Boolean(props.talk.eventUrl && props.talk.eventUrl !== props.talk.url))
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
            to="/speaking"
            class="studio-link group inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-semibold text-highlighted transition-colors hover:bg-(--ui-bg-accented)/60"
          >
            <UIcon
              name="i-lucide-arrow-left"
              class="size-4"
            />
            <span>All talks</span>
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
          <span class="truncate font-medium">{{ talk.title }}</span>
        </li>
      </ol>
    </nav>

    <article
      aria-labelledby="studio-talk-title"
      class="grid gap-3 sm:gap-4 lg:grid-cols-6"
    >
      <!-- Hero -->
      <header
        class="studio-tile studio-glass studio-enter studio-tint-emerald relative flex flex-col gap-8 overflow-hidden p-7 sm:p-10 lg:col-span-4"
        style="--studio-i: 0"
      >
        <div
          class="pointer-events-none absolute -top-28 -right-16 size-96 rounded-full bg-[radial-gradient(closest-side,var(--studio-blob-4),transparent)]"
          aria-hidden="true"
        />
        <div class="relative">
          <div class="flex items-center gap-4">
            <DesignsStudioDateBlock
              :date="talk.date"
              :label="talk.dateLabel"
              size="lg"
            />
            <div class="flex min-w-0 flex-col items-start gap-2">
              <p
                v-if="isUpcoming"
                class="studio-pill"
              >
                <span
                  class="relative flex size-2"
                  aria-hidden="true"
                >
                  <span class="studio-ping absolute inset-0 rounded-full border border-(--tint-chip)" />
                  <span class="relative size-2 rounded-full bg-(--tint-chip)" />
                </span>
                Upcoming
              </p>
              <p class="studio-ink text-base font-semibold">
                {{ talk.event }}
              </p>
            </div>
          </div>

          <h1
            id="studio-talk-title"
            class="studio-display mt-7 text-4xl leading-[1.02] font-extrabold text-balance text-highlighted sm:text-5xl lg:text-[3.5rem]"
          >
            {{ talk.title }}
          </h1>
          <p
            v-if="subtitle"
            class="studio-display mt-4 text-xl leading-snug font-semibold text-balance text-toned sm:text-2xl"
          >
            {{ subtitle }}
          </p>
          <p class="mt-5 max-w-2xl text-lg leading-8 text-pretty text-toned">
            {{ talk.summary }}
          </p>
        </div>

        <nav
          v-if="talk.url || showEventLink"
          aria-label="Talk actions"
          class="relative mt-auto"
        >
          <ul class="flex flex-wrap items-center gap-2">
            <li v-if="talk.url">
              <a
                :href="talk.url"
                target="_blank"
                rel="noopener noreferrer"
                class="studio-btn studio-btn-solid group px-5 py-2.5"
              >
                <UIcon
                  name="i-lucide-external-link"
                  class="size-4"
                />
                View organiser session<span class="sr-only"> for {{ talk.title }} (opens in a new tab)</span>
              </a>
            </li>
            <li v-if="showEventLink">
              <a
                :href="talk.eventUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="studio-btn group px-5 py-2.5"
                :class="talk.url ? 'studio-btn-soft' : 'studio-btn-solid'"
              >
                Event website<span class="sr-only"> of {{ talk.event }} (opens in a new tab)</span>
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
        aria-labelledby="studio-talk-facts"
        class="studio-tile studio-enter flex flex-col gap-6 p-7 sm:p-8 lg:col-span-2"
        style="--studio-i: 1"
      >
        <h2
          id="studio-talk-facts"
          class="text-xs font-semibold tracking-wide text-muted uppercase"
        >
          At a glance
        </h2>
        <dl class="grid gap-x-4 gap-y-4 sm:grid-cols-2 lg:grid-cols-1">
          <div
            v-for="fact in facts"
            :key="fact.label"
            class="relative min-h-9 min-w-0 pl-12"
          >
            <dt class="text-xs font-medium text-muted">
              <span
                aria-hidden="true"
                class="absolute top-0 left-0 flex size-9 items-center justify-center rounded-xl bg-(--ui-bg-muted) text-toned ring-1 ring-(--ui-border)"
              >
                <UIcon
                  :name="fact.icon"
                  class="size-4"
                />
              </span>
              {{ fact.label }}
            </dt>
            <dd class="text-[0.95rem] leading-snug font-semibold text-highlighted">
              {{ fact.value }}
            </dd>
          </div>
        </dl>
        <p class="mt-auto border-t border-(--ui-border) pt-5 text-sm text-muted">
          Speaker
          <NuxtLink
            to="/"
            class="studio-link font-semibold text-highlighted underline-offset-4 hover:underline"
          >Fabian Meyer</NuxtLink>
        </p>
      </section>

      <!-- Abstract -->
      <section
        aria-labelledby="studio-talk-abstract"
        class="studio-tile studio-enter studio-tint-blue p-7 sm:p-10 lg:col-span-4"
        style="--studio-i: 2"
      >
        <div class="flex items-center gap-3">
          <span class="studio-chip size-10 rounded-2xl">
            <UIcon
              name="i-lucide-book-open-text"
              class="size-5"
            />
          </span>
          <h2
            id="studio-talk-abstract"
            class="studio-display text-2xl font-bold text-highlighted"
          >
            Abstract
          </h2>
        </div>
        <p class="mt-6 max-w-[65ch] text-[1.0625rem] leading-8 whitespace-pre-line text-pretty text-toned">
          {{ talk.description }}
        </p>
      </section>

      <div class="flex flex-col gap-3 sm:gap-4 lg:col-span-2">
        <!-- Topic -->
        <section
          aria-labelledby="studio-talk-topic"
          class="studio-tile studio-tinted studio-tint-violet studio-enter p-7 sm:p-8"
          style="--studio-i: 3"
        >
          <h2
            id="studio-talk-topic"
            class="studio-pill"
          >
            <UIcon
              name="i-lucide-sparkles"
              class="size-3.5"
            />
            Topic
          </h2>
          <p class="studio-display studio-ink mt-4 text-2xl leading-tight font-bold text-balance">
            {{ talk.topic }}
          </p>
        </section>

        <!-- Resources -->
        <section
          v-if="talk.resources.length"
          aria-labelledby="studio-talk-resources"
          class="studio-enter flex flex-col gap-3"
          style="--studio-i: 4"
        >
          <h2
            id="studio-talk-resources"
            class="studio-display mt-2 px-1 text-xl font-bold text-highlighted"
          >
            Resources
          </h2>
          <ul class="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <li
              v-for="(resource, index) in talk.resources"
              :key="`${resource.kind}-${resource.title}`"
            >
              <div
                class="studio-tile studio-tinted studio-lift group flex h-full items-start gap-4 p-5"
                :class="`studio-tint-${resourceTints[index % resourceTints.length]}`"
              >
                <span class="studio-chip size-11 rounded-2xl">
                  <UIcon
                    :name="resourceMeta[resource.kind].icon"
                    class="size-5"
                  />
                </span>
                <div class="min-w-0 flex-1">
                  <p class="studio-ink text-xs font-semibold tracking-wide uppercase">
                    {{ resourceMeta[resource.kind].label }}
                  </p>
                  <h3 class="studio-display mt-0.5 text-lg leading-snug font-bold text-highlighted">
                    <a
                      :href="resource.href"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="studio-stretched"
                    >
                      {{ resource.title }}<span class="sr-only"> for {{ talk.title }} (opens in a new tab)</span>
                    </a>
                  </h3>
                  <p
                    v-if="resource.description"
                    class="mt-1 text-sm leading-6 text-toned"
                  >
                    {{ resource.description }}
                  </p>
                  <p
                    v-if="resource.format || resource.pages"
                    class="mt-2.5 flex flex-wrap gap-1.5"
                  >
                    <span
                      v-if="resource.format"
                      class="studio-tag"
                    >{{ resource.format }}</span>
                    <span
                      v-if="resource.pages"
                      class="studio-tag"
                    >{{ resource.pages }} pages</span>
                  </p>
                </div>
                <UIcon
                  name="i-lucide-arrow-up-right"
                  class="studio-ink studio-arrow studio-arrow-diagonal mt-1 size-5 shrink-0"
                />
              </div>
            </li>
          </ul>
        </section>
      </div>
    </article>

    <!-- More talks -->
    <section
      v-if="related.length"
      aria-labelledby="studio-more-talks"
      class="mt-20 sm:mt-24"
    >
      <DesignsStudioSectionHeading
        id="studio-more-talks"
        title="More talks"
        description="Other sessions in the speaking line-up."
        icon="i-lucide-mic-vocal"
        tint="emerald"
      >
        <template #action>
          <NuxtLink
            to="/speaking"
            class="studio-btn studio-btn-soft group shrink-0"
          >
            All talks
            <UIcon
              name="i-lucide-arrow-right"
              class="studio-arrow size-4"
            />
          </NuxtLink>
        </template>
      </DesignsStudioSectionHeading>

      <ul
        class="mt-8 grid gap-4 lg:grid-cols-3"
        aria-label="More talks"
      >
        <Motion
          v-for="(item, index) in related"
          :key="`${item.title}-${item.event}`"
          as="li"
          :initial="{ opacity: 0, transform: 'translateY(16px)' }"
          :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
          :transition="{ delay: index * 0.08, duration: 0.5 }"
          :in-view-options="{ once: true }"
        >
          <DesignsStudioTalkCard
            :talk="item"
            :tint="relatedTints[index % relatedTints.length]"
            variant="stacked"
          />
        </Motion>
      </ul>
    </section>
  </div>
</template>
