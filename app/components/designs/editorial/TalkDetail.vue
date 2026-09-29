<script setup lang="ts">
import type { TalksCollectionItem } from '@nuxt/content'

const props = defineProps<{
  talk: ResolvedTalkEntry<TalksCollectionItem>
  subtitle: string | null
  related: TalksCollectionItem[]
}>()

const date = computed(() => {
  if (!props.talk.date) return null
  const value = new Date(String(props.talk.date))

  return Number.isNaN(value.getTime()) ? null : value
})

const isoDate = computed(() => date.value?.toISOString().slice(0, 10))
const longDate = computed(() => date.value
  ? new Intl.DateTimeFormat('en', { dateStyle: 'long', timeZone: 'UTC' }).format(date.value)
  : props.talk.dateLabel)

const isUpcoming = computed(() => {
  if (props.talk.placeholder) return true
  if (!date.value) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return date.value.getTime() >= today.getTime()
})

const day = computed(() => date.value ? new Intl.DateTimeFormat('en', { day: '2-digit', timeZone: 'UTC' }).format(date.value) : null)
const monthYear = computed(() => date.value ? new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(date.value) : null)

const format = computed(() => props.talk.format ?? 'Talk')

const resourceKindLabels: Record<ResolvedTalkResource['kind'], string> = {
  slides: 'Slides',
  recording: 'Recording',
  handout: 'Handout',
  link: 'Link'
}

const isGenericTitle = (resource: ResolvedTalkResource) => resource.title.trim().toLowerCase() === resourceKindLabels[resource.kind].toLowerCase()

const resourceMeta = (resource: ResolvedTalkResource) => [
  isGenericTitle(resource) ? null : resourceKindLabels[resource.kind],
  resource.format,
  resource.pages ? `${resource.pages} pages` : null
].filter(Boolean).join(' · ')
</script>

<template>
  <div class="ed-page">
    <UContainer>
      <article aria-labelledby="ed-talk-title">
        <!-- Masthead of the feature ------------------------------------ -->
        <header class="pt-8 sm:pt-12 lg:pt-16">
          <div class="ed-enter-rise-sm flex items-baseline justify-between gap-4">
            <nav aria-label="Back">
              <ul class="list-none p-0">
                <li>
                  <NuxtLink
                    to="/speaking"
                    class="ed-kicker ed-back-link"
                  >
                    <span
                      class="ed-link-arrow ed-link-arrow-left mr-1.5"
                      aria-hidden="true"
                    >←</span>All talks
                  </NuxtLink>
                </li>
              </ul>
            </nav>
            <p class="ed-kicker text-right">
              <span
                v-if="isUpcoming"
                class="text-primary"
              >Upcoming<span aria-hidden="true"> · </span></span>{{ format }}
            </p>
          </div>

          <div
            class="ed-rule ed-enter-draw ed-delay-1 mt-4"
            aria-hidden="true"
          />

          <div class="mt-10 grid grid-cols-12 gap-x-6 sm:mt-14 lg:mt-16">
            <div class="col-span-12 lg:col-span-9">
              <p class="ed-kicker ed-enter-rise-sm">
                <span class="text-primary">{{ talk.event }}</span>
              </p>
              <h1
                id="ed-talk-title"
                class="ed-detail-title ed-detail-title-long ed-enter-rise ed-delay-1 mt-5 -ml-[0.03em] max-w-[16ch] text-balance"
              >
                {{ talk.title }}
              </h1>
              <p
                v-if="subtitle"
                class="ed-serif ed-enter-rise-sm ed-delay-2 mt-6 max-w-3xl text-[clamp(1.5rem,2.6vw,2.125rem)] leading-[1.2] text-muted italic"
              >
                {{ subtitle }}
              </p>
            </div>

            <!-- Dateline plate; the same facts are in the margin column. -->
            <div
              v-if="day"
              class="ed-enter-rise-sm ed-delay-2 col-span-3 hidden flex-col items-end self-end text-right lg:flex"
              aria-hidden="true"
            >
              <p class="ed-serif text-[10rem] leading-[0.75] tracking-[-0.04em] text-highlighted">
                {{ day }}
              </p>
              <p class="ed-kicker mt-4">
                {{ monthYear }}<template v-if="talk.time">
                  · {{ talk.time }}
                </template>
              </p>
            </div>
          </div>

          <div
            class="ed-rule ed-enter-draw ed-delay-2 mt-12 sm:mt-16"
            aria-hidden="true"
          />
        </header>

        <div class="grid grid-cols-12 gap-x-6 gap-y-12 pt-8 sm:pt-10 lg:gap-y-0">
          <!-- Standfirst: first on small screens, beside the facts from lg -->
          <p class="ed-serif ed-enter-rise-sm ed-delay-2 col-span-12 lg:col-span-8 lg:col-start-5 lg:row-start-1 text-[clamp(1.625rem,2.6vw,2.25rem)] leading-[1.2] text-highlighted">
            {{ talk.summary }}
          </p>

          <!-- Margin column: session facts -->
          <aside
            aria-labelledby="ed-talk-facts"
            class="ed-enter-rise-sm ed-delay-3 col-span-12 lg:col-span-3 lg:row-span-2 lg:row-start-1"
          >
            <h2
              id="ed-talk-facts"
              class="sr-only"
            >
              Session details
            </h2>
            <dl class="ed-facts grid grid-cols-2 gap-x-6 sm:grid-cols-3 lg:grid-cols-1">
              <div class="col-span-2 sm:col-span-1">
                <dt class="ed-kicker">
                  Event
                </dt>
                <dd>{{ talk.event }}</dd>
              </div>
              <div class="col-span-2 sm:col-span-1">
                <dt class="ed-kicker">
                  Location
                </dt>
                <dd>
                  {{ talk.location }}
                  <span
                    v-if="talk.room"
                    class="block text-muted"
                  >{{ talk.room }}</span>
                </dd>
              </div>
              <div>
                <dt class="ed-kicker">
                  Date
                </dt>
                <dd>
                  <time
                    v-if="isoDate"
                    :datetime="isoDate"
                  >{{ longDate }}</time>
                  <span v-else>{{ talk.dateLabel }}</span>
                  <span
                    v-if="talk.time"
                    class="block text-muted"
                  >{{ talk.time }}</span>
                </dd>
              </div>
              <div v-if="talk.language">
                <dt class="ed-kicker">
                  Language
                </dt>
                <dd>{{ talk.language }}</dd>
              </div>
              <div>
                <dt class="ed-kicker">
                  Format
                </dt>
                <dd>
                  {{ format }}<span
                    v-if="talk.level"
                    class="block text-muted"
                  >{{ talk.level }}</span>
                </dd>
              </div>
              <div v-if="talk.duration">
                <dt class="ed-kicker">
                  Duration
                </dt>
                <dd>{{ talk.duration }}</dd>
              </div>
            </dl>

            <nav
              v-if="talk.url || talk.eventUrl"
              aria-label="Organiser links"
              class="mt-8"
            >
              <ul class="flex list-none flex-wrap gap-x-6 gap-y-3 p-0 lg:flex-col">
                <li v-if="talk.url">
                  <NuxtLink
                    :to="talk.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="ed-link text-[0.9375rem]"
                  >
                    Session page<span class="sr-only"> for {{ talk.title }} at {{ talk.event }} (opens in a new tab)</span><span
                      class="ed-link-arrow ml-1"
                      aria-hidden="true"
                    >↗</span>
                  </NuxtLink>
                </li>
                <li v-if="talk.eventUrl">
                  <NuxtLink
                    :to="talk.eventUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="ed-link text-[0.9375rem]"
                  >
                    Event website<span class="sr-only"> for {{ talk.event }} (opens in a new tab)</span><span
                      class="ed-link-arrow ml-1"
                      aria-hidden="true"
                    >↗</span>
                  </NuxtLink>
                </li>
              </ul>
            </nav>
          </aside>

          <!-- Abstract -->
          <div class="col-span-12 lg:col-span-8 lg:col-start-5">
            <section
              aria-labelledby="ed-talk-abstract"
              class="border-t border-accented pt-6 lg:mt-14"
            >
              <h2
                id="ed-talk-abstract"
                class="ed-kicker"
              >
                <span class="text-primary">Abstract</span>
              </h2>
              <p class="ed-dropcap ed-body-copy mt-6 whitespace-pre-line md:columns-2 md:gap-10">
                {{ talk.description }}
              </p>
            </section>
          </div>
        </div>

        <!-- Resources ------------------------------------------------- -->
        <section
          v-if="talk.resources.length"
          aria-labelledby="ed-talk-resources"
          class="ed-feature-section mt-20 sm:mt-28"
        >
          <div class="ed-feature-margin">
            <p
              class="ed-kicker"
              aria-hidden="true"
            >
              <span class="text-primary">{{ String(talk.resources.length).padStart(2, '0') }}</span> {{ talk.resources.length === 1 ? 'item' : 'items' }}
            </p>
            <h2
              id="ed-talk-resources"
              class="ed-feature-heading"
            >
              Resources
            </h2>
          </div>
          <ul
            class="ed-feature-body list-none border-b border-accented p-0"
            aria-label="Talk resources"
          >
            <li
              v-for="(resource, index) in talk.resources"
              :key="`${resource.kind}-${resource.title}`"
            >
              <article class="ed-row grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-baseline gap-x-4 gap-y-2 border-t border-accented py-6 sm:grid-cols-[3.5rem_minmax(0,1fr)_auto] sm:py-7">
                <span
                  class="ed-kicker text-primary"
                  aria-hidden="true"
                >{{ String(index + 1).padStart(2, '0') }}</span>
                <div>
                  <h3 class="ed-serif text-[clamp(1.75rem,3vw,2.375rem)] leading-[1.05] text-highlighted">
                    <NuxtLink
                      :to="resource.href"
                      external
                      target="_blank"
                      rel="noopener noreferrer"
                      class="ed-row-link ed-row-title"
                    >
                      <span class="ed-row-shift inline-block">{{ resource.title }}<span
                        v-if="isGenericTitle(resource)"
                        class="sr-only"
                      > for {{ talk.title }}</span></span><span class="sr-only"> (opens in a new tab)</span>
                    </NuxtLink>
                  </h3>
                  <p class="ed-kicker mt-2">
                    {{ resourceMeta(resource) }}
                  </p>
                  <p
                    v-if="resource.description"
                    class="mt-3 max-w-xl text-base leading-7 text-toned"
                  >
                    {{ resource.description }}
                  </p>
                </div>
                <span
                  class="ed-row-arrow text-2xl leading-none text-highlighted"
                  aria-hidden="true"
                >↗</span>
              </article>
            </li>
          </ul>
        </section>
      </article>

      <!-- More talks ------------------------------------------------- -->
      <section
        v-if="related.length"
        aria-labelledby="ed-talk-related"
        class="mt-28 sm:mt-40"
      >
        <DesignsEditorialSectionHead
          id="ed-talk-related"
          number="See also"
          title="More talks"
          description="Other sessions in the speaking line-up."
          :link="{ label: 'All talks', to: '/speaking' }"
        />
        <ul
          class="list-none border-b border-accented p-0"
          aria-label="More talks"
        >
          <Motion
            v-for="(entry, index) in related"
            :key="`${entry.title}-${entry.event}`"
            as="li"
            :initial="{ transform: 'translateY(16px)' }"
            :while-in-view="{ transform: 'translateY(0)' }"
            :transition="{ delay: index * 0.06 }"
            :in-view-options="{ once: true }"
          >
            <DesignsEditorialTalkRow :talk="entry" />
          </Motion>
        </ul>
      </section>
    </UContainer>
  </div>
</template>
