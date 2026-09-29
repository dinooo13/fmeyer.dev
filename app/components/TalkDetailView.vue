<script setup lang="ts">
import type { TalksCollectionItem } from '@nuxt/content'

const props = defineProps<{
  talk: ResolvedTalkEntry<TalksCollectionItem>
  subtitle: string | null
  related: TalksCollectionItem[]
}>()

const slug = computed(() => getTalkSlug(props.talk))

const date = computed(() => {
  if (!props.talk.date) return null
  const value = new Date(String(props.talk.date))
  return Number.isNaN(value.getTime()) ? null : value
})

const isoDate = computed(() => date.value?.toISOString().slice(0, 10))

const now = useNow()

const isUpcoming = computed(() => {
  if (props.talk.placeholder) return true
  if (!date.value) return false
  const today = new Date(now.value)
  today.setUTCHours(0, 0, 0, 0)
  return date.value.getTime() >= today.getTime()
})

// Only list the time on its own when the display label doesn't already carry it.
const showTime = computed(() => Boolean(props.talk.time && !props.talk.dateLabel.includes(props.talk.time)))

type Spec = { key: string, value: string }

// Skip the venue name when the location already names it.
const venue = computed<Spec | null>(() => {
  const { venueName, venueAddress, location } = props.talk
  if (venueName && !location.includes(venueName)) {
    return { key: 'venue', value: [venueName, venueAddress].filter(Boolean).join(', ') }
  }
  return venueAddress ? { key: 'address', value: venueAddress } : null
})

const specs = computed<Spec[]>(() => {
  const { talk } = props
  const rows: (Spec | null)[] = [
    talk.duration ? { key: 'duration', value: talk.duration } : null,
    { key: 'location', value: talk.location },
    venue.value,
    talk.room ? { key: 'room', value: talk.room } : null,
    talk.format ? { key: 'format', value: talk.format } : null,
    talk.level ? { key: 'level', value: talk.level } : null,
    talk.language ? { key: 'language', value: talk.language } : null
  ]
  return rows.filter((row): row is Spec => row !== null)
})

const resourceKinds: Record<ResolvedTalkResource['kind'], { label: string, icon: string }> = {
  slides: { label: 'Slides', icon: 'i-lucide-presentation' },
  recording: { label: 'Recording', icon: 'i-lucide-video' },
  handout: { label: 'Handout', icon: 'i-lucide-file-text' },
  link: { label: 'Link', icon: 'i-lucide-link' }
}

// External links show where they lead; bundled assets are served by this site.
// Production builds resolve bundled assets to absolute /_nuxt/ URLs, so check the path too.
const resourceHost = (href: string) => {
  if (!/^https?:\/\//.test(href) || href.includes('/_nuxt/')) return 'fmeyer.dev'
  try {
    const url = new URL(href)
    return `${url.host}${url.pathname}`.replace(/\/$/, '')
  } catch {
    return href
  }
}
</script>

<template>
  <div>
    <article aria-labelledby="signal-talk-title">
      <!-- Hero -->
      <header class="mx-auto max-w-6xl px-5 pt-28 pb-14 sm:px-8 sm:pt-36 lg:pb-20">
        <nav
          aria-label="Breadcrumb"
          class="signal-rise signal-rise-1"
        >
          <ol class="signal-crumbs">
            <li>
              <NuxtLink
                to="/"
                aria-label="Home"
              >~</NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/speaking"
              >speaking</NuxtLink>
            </li>
            <li aria-current="page">
              {{ slug }}
            </li>
          </ol>
        </nav>

        <div class="mt-10 grid gap-10 lg:mt-14 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-14">
          <div>
            <p class="signal-rise signal-rise-1 flex flex-wrap items-center gap-x-2 gap-y-2.5 font-mono text-[0.7rem] tracking-[0.12em] text-toned uppercase">
              <span
                v-if="isUpcoming"
                class="signal-chip text-(--signal-ok)"
              >
                <span
                  class="signal-live"
                  aria-hidden="true"
                />
                Upcoming
              </span>
              <span class="signal-chip text-primary">{{ talk.format ?? 'Talk' }}</span>
              <span class="px-1 tracking-normal text-muted normal-case"><span class="sr-only">Topic: </span>{{ talk.topic }}</span>
            </p>

            <h1
              id="signal-talk-title"
              class="signal-rise signal-rise-2 mt-7 text-[clamp(2.25rem,8.5vw,3.75rem)] leading-[1.02] font-semibold tracking-[-0.045em] text-balance text-highlighted"
            >
              {{ talk.title }}
            </h1>

            <p
              v-if="subtitle"
              class="signal-rise signal-rise-3 mt-4 max-w-2xl font-mono text-sm leading-relaxed text-toned sm:text-base"
            >
              <span
                class="text-primary"
                aria-hidden="true"
              >&gt;_</span> {{ subtitle }}
            </p>

            <p class="signal-rise signal-rise-3 mt-6 max-w-2xl text-lg leading-relaxed text-pretty text-toned sm:text-xl">
              {{ talk.summary }}
            </p>

            <nav
              v-if="talk.url || talk.eventUrl"
              aria-label="Session links"
              class="signal-rise signal-rise-4 mt-8"
            >
              <ul class="flex flex-wrap items-center gap-2.5">
                <li v-if="talk.url">
                  <UButton
                    :to="talk.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    icon="i-lucide-external-link"
                    color="primary"
                    size="lg"
                    class="rounded-full px-5"
                  >
                    Organiser session page<span class="sr-only"> for {{ talk.title }} at {{ talk.event }} (opens in a new tab)</span>
                  </UButton>
                </li>
                <li v-if="talk.eventUrl">
                  <UButton
                    :to="talk.eventUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    icon="i-lucide-calendar-range"
                    color="neutral"
                    variant="outline"
                    size="lg"
                    class="rounded-full bg-(--signal-glass) px-5 backdrop-blur"
                  >
                    Event website<span class="sr-only"> for {{ talk.event }} (opens in a new tab)</span>
                  </UButton>
                </li>
              </ul>
            </nav>
          </div>

          <!-- Spec sheet -->
          <div class="signal-spec signal-rise signal-rise-4 lg:self-start">
            <p class="signal-spec-head">
              <span>session</span>
              <span aria-hidden="true">{{ slug }}.yml</span>
            </p>
            <dl class="signal-spec-body">
              <div>
                <dt>event</dt>
                <dd>{{ talk.event }}</dd>
              </div>
              <div>
                <dt>date</dt>
                <dd>
                  <time
                    v-if="isoDate"
                    :datetime="isoDate"
                  >{{ talk.dateLabel }}</time>
                  <span v-else>{{ talk.dateLabel }}</span>
                </dd>
              </div>
              <div v-if="showTime">
                <dt>time</dt>
                <dd>{{ talk.time }}</dd>
              </div>
              <div
                v-for="spec in specs"
                :key="spec.key"
              >
                <dt>{{ spec.key }}</dt>
                <dd>{{ spec.value }}</dd>
              </div>
              <div>
                <dt>speaker</dt>
                <dd>
                  <NuxtLink
                    to="/#identity"
                    class="signal-spec-link"
                  >Fabian Meyer</NuxtLink>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </header>

      <!-- Abstract -->
      <section
        aria-labelledby="signal-talk-abstract"
        class="mx-auto max-w-6xl px-5 pb-16 sm:px-8 sm:pb-20"
      >
        <div class="grid gap-3 border-t border-default pt-10 lg:grid-cols-[11rem_minmax(0,1fr)] lg:gap-12 lg:pt-14">
          <p class="signal-stage-label">
            <span class="signal-stage-index">01</span>
            <span>abstract</span>
          </p>
          <div>
            <h2
              id="signal-talk-abstract"
              class="text-2xl font-semibold tracking-[-0.03em] text-highlighted sm:text-3xl"
            >
              Abstract
            </h2>
            <p class="mt-5 max-w-[68ch] text-base leading-[1.8] whitespace-pre-line text-pretty text-toned sm:text-[1.075rem]">
              {{ talk.description }}
            </p>
          </div>
        </div>
      </section>

      <!-- Resources -->
      <section
        v-if="talk.resources.length"
        aria-labelledby="signal-talk-resources"
        class="mx-auto max-w-6xl px-5 pb-16 sm:px-8 sm:pb-20"
      >
        <div class="grid gap-3 border-t border-default pt-10 lg:grid-cols-[11rem_minmax(0,1fr)] lg:gap-12 lg:pt-14">
          <p class="signal-stage-label">
            <span class="signal-stage-index">02</span>
            <span>resources</span>
          </p>
          <div>
            <h2
              id="signal-talk-resources"
              class="text-2xl font-semibold tracking-[-0.03em] text-highlighted sm:text-3xl"
            >
              Resources
            </h2>

            <ul
              class="mt-6 grid gap-4 md:grid-cols-2"
              :aria-label="`Resources for ${talk.title}`"
            >
              <li
                v-for="resource in talk.resources"
                :key="`${resource.kind}-${resource.title}`"
                class="signal-reveal"
              >
                <div class="signal-card signal-resource flex h-full flex-col p-6">
                  <div class="flex items-start justify-between gap-4">
                    <span
                      class="signal-icon-tile size-11"
                      aria-hidden="true"
                    >
                      <UIcon
                        :name="resourceKinds[resource.kind].icon"
                        class="size-5"
                      />
                    </span>
                    <span
                      class="signal-resource-arrow grid size-9 place-items-center rounded-full border border-default text-muted"
                      aria-hidden="true"
                    >
                      <UIcon
                        name="i-lucide-arrow-up-right"
                        class="size-4"
                      />
                    </span>
                  </div>

                  <p class="mt-6 flex flex-wrap items-center gap-1.5 font-mono text-[0.7rem] tracking-[0.08em] text-toned uppercase">
                    <span class="rounded-full border border-(--ui-primary)/40 px-2 py-0.5 text-primary">{{ resourceKinds[resource.kind].label }}</span>
                    <span
                      v-if="resource.format"
                      class="rounded-full border border-default px-2 py-0.5"
                    >{{ resource.format }}</span>
                    <span
                      v-if="resource.pages"
                      class="rounded-full border border-default px-2 py-0.5"
                    >{{ resource.pages }} pages</span>
                  </p>

                  <h3 class="mt-3 text-lg font-semibold tracking-[-0.02em] text-highlighted">
                    <a
                      :href="resource.href"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="after:absolute after:inset-0 after:rounded-[inherit] after:content-[''] focus-visible:outline-none"
                    >{{ resource.title }}<span class="sr-only"> for {{ talk.title }} (opens in a new tab)</span></a>
                  </h3>

                  <p
                    v-if="resource.description"
                    class="mt-2 text-sm leading-relaxed text-muted"
                  >
                    {{ resource.description }}
                  </p>

                  <p
                    class="mt-auto truncate pt-5 font-mono text-xs text-muted"
                  >
                    {{ resourceHost(resource.href) }}
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </article>

    <!-- More talks -->
    <section
      v-if="related.length"
      aria-labelledby="signal-related-talks"
      class="mx-auto max-w-6xl border-t border-default px-5 py-16 sm:px-8 sm:py-20"
    >
      <SectionHeader
        index="~/"
        eyebrow="Speaking"
        heading-id="signal-related-talks"
        title="More talks"
        :link="{ label: 'All talks', to: '/speaking' }"
      />

      <ul
        class="signal-stats mt-10 divide-y divide-(--ui-border) overflow-hidden"
        aria-label="More talks"
      >
        <li
          v-for="entry in related"
          :key="`${entry.title}-${entry.event}`"
          class="signal-reveal"
        >
          <TalkRow :talk="entry" />
        </li>
      </ul>
    </section>
  </div>
</template>
