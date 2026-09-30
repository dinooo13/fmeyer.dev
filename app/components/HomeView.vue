<script setup lang="ts">
import type { IndexCollectionItem, LabsCollectionItem, TalksCollectionItem } from '@nuxt/content'

const props = defineProps<{
  page: IndexCollectionItem
  labs: LabsCollectionItem[]
  talks: TalksCollectionItem[]
}>()

const { footer, global } = useAppConfig()

const current = computed(() => props.page.experience.items[0])

// Split the intro into a crisp lead sentence and the supporting detail.
const intro = computed(() => {
  const text = props.page.hero.intro
  const match = text.match(/^(.+?[.!?])\s+([\s\S]*)$/)
  return match ? { lead: match[1], rest: match[2] } : { lead: text, rest: '' }
})

const experienceExpanded = ref(false)
const experienceLimit = 3
const visibleExperience = computed(() => experienceExpanded.value
  ? props.page.experience.items
  : props.page.experience.items.slice(0, experienceLimit))
const hiddenExperienceCount = computed(() => Math.max(props.page.experience.items.length - experienceLimit, 0))

const focusIcons = ['i-lucide-workflow', 'i-lucide-bot', 'i-lucide-graduation-cap', 'i-lucide-mic-vocal']
const focusSpans = ['lg:col-span-4', 'lg:col-span-2', 'lg:col-span-2', 'lg:col-span-4']

// Extra detail for the two wide bento cells, taken from the talks content:
// the four pillars named in "Onboarding Your Agent" and the events spoken at.
const focusExtras = computed<Record<number, { label: string, items: string[] }>>(() => {
  const extras: Record<number, { label: string, items: string[] }> = {}
  const onboarding = props.talks.find(talk => /four pillars/i.test(talk.description))
  const pillars = onboarding?.description.match(/four pillars[^:]*:\s*([^-–—.]+)/i)?.[1]
    ?.split(/,\s*(?:and\s+)?|\s+and\s+/)
    .map(item => item.trim())
    .filter(Boolean)
  if (pillars?.length) {
    extras[0] = { label: 'Four pillars', items: pillars }
  }
  const events = [...new Set(props.talks.map(talk => talk.event))]
  if (events.length) {
    extras[3] = { label: 'Stages so far', items: events }
  }
  return extras
})

const featuredLab = computed(() => props.labs[0])
const otherLabs = computed(() => props.labs.slice(1))

const onPointerMove = (event: PointerEvent) => {
  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  target.style.setProperty('--mx', `${event.clientX - rect.left}px`)
  target.style.setProperty('--my', `${event.clientY - rect.top}px`)
}

const reveal = {
  initial: { opacity: 0, transform: 'translateY(16px)' },
  whileInView: { opacity: 1, transform: 'translateY(0)' },
  inViewOptions: { once: true, amount: 0.15 }
}
</script>

<template>
  <div>
    <!-- Hero -->
    <section
      aria-labelledby="signal-hero-title"
      class="mx-auto max-w-6xl px-5 pt-32 pb-16 sm:px-8 sm:pt-40 lg:pt-44 lg:pb-20"
    >
      <!-- DOM order = mobile order (text, terminal, actions); the grid restores two columns on desktop. -->
      <div class="grid gap-y-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:grid-rows-[auto_auto] lg:gap-x-14 lg:gap-y-9">
        <div class="lg:col-start-1 lg:row-start-1 lg:self-end">
          <div class="signal-rise signal-rise-1 flex items-center justify-center gap-2.5 sm:justify-start sm:gap-3">
            <NuxtImg
              :src="global.picture.dark"
              alt=""
              width="80"
              height="80"
              sizes="80px"
              densities="x1 x2"
              fit="cover"
              loading="eager"
              fetchpriority="high"
              class="size-16 shrink-0 rounded-full object-cover ring-2 ring-(--ui-bg) outline outline-(--ui-border-accented) sm:size-20"
            />
          </div>

          <h1
            id="signal-hero-title"
            class="signal-rise signal-rise-2 mt-8 text-[clamp(2.75rem,13.5vw,3.5rem)] font-semibold sm:text-7xl lg:text-[5.5rem]"
          >
            <span class="signal-name inline-block pb-2">{{ page.hero.name }}</span>
          </h1>

          <p
            v-if="current"
            class="signal-rise signal-rise-3 mt-3 font-mono text-sm tracking-[0.02em] text-toned sm:text-base"
          >
            <span
              class="text-primary"
              aria-hidden="true"
            >&gt;_</span> {{ current.title }}
          </p>

          <p
            v-if="page.hero.location"
            class="signal-rise signal-rise-3 mt-2 flex items-center gap-1.5 font-mono text-sm tracking-[0.02em] text-muted"
          >
            <UIcon
              name="i-lucide-map-pin"
              class="size-3.5 shrink-0"
              aria-hidden="true"
            />
            <span>{{ page.hero.location }}</span>
          </p>

          <p class="signal-rise signal-rise-3 mt-7 max-w-xl text-xl leading-snug font-medium tracking-[-0.02em] text-pretty text-highlighted sm:text-2xl">
            {{ intro.lead }}
          </p>
          <p
            v-if="intro.rest"
            class="signal-rise signal-rise-4 mt-4 max-w-xl text-base leading-relaxed text-pretty text-muted"
          >
            {{ intro.rest }}
          </p>
        </div>

        <AgentSession
          class="signal-rise signal-rise-3 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center"
          :talks
        />

        <div class="signal-rise signal-rise-5 flex flex-wrap items-center gap-x-5 gap-y-4 lg:col-start-1 lg:row-start-2 lg:self-start">
          <nav aria-label="Explore">
            <ul class="flex flex-wrap items-center gap-2.5">
              <li>
                <UButton
                  :to="page.labs.link.to"
                  :icon="page.labs.link.icon"
                  :label="page.labs.link.label"
                  color="primary"
                  size="lg"
                  class="rounded-full px-5"
                />
              </li>
              <li>
                <UButton
                  :to="page.speaking.link.to"
                  :icon="page.speaking.link.icon"
                  :label="page.speaking.link.label"
                  color="neutral"
                  variant="outline"
                  size="lg"
                  class="rounded-full bg-(--signal-glass) px-5 backdrop-blur"
                />
              </li>
            </ul>
          </nav>

          <nav aria-label="Profiles and contact">
            <ul class="flex items-center gap-1">
              <li
                v-for="link of footer?.links"
                :key="link['aria-label'] || link.to"
              >
                <UButton
                  v-bind="{ size: 'lg', color: 'neutral', variant: 'ghost', ...link }"
                  class="rounded-full text-toned hover:text-highlighted"
                />
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </section>

    <!-- Focus bento -->
    <section
      aria-labelledby="signal-focus-title"
      class="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20"
    >
      <SectionHeader
        index="01"
        eyebrow="Focus"
        heading-id="signal-focus-title"
        :title="page.focus.title"
        :description="page.focus.description"
      />

      <ul
        class="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-6"
        :aria-label="page.focus.title"
      >
        <Motion
          v-for="(item, index) in page.focus.items"
          :key="item.title"
          as="li"
          :class="focusSpans[index % focusSpans.length]"
          v-bind="reveal"
          :transition="{ delay: index * 0.06 }"
        >
          <div
            class="signal-card flex h-full flex-col gap-8 p-6 sm:p-7"
            :class="focusExtras[index] ? 'lg:flex-row lg:gap-10' : ''"
            @pointermove="onPointerMove"
          >
            <div class="flex flex-1 flex-col">
              <div class="flex items-center justify-between">
                <span
                  class="signal-icon-tile size-11"
                  aria-hidden="true"
                >
                  <UIcon
                    :name="focusIcons[index % focusIcons.length]!"
                    class="size-5"
                  />
                </span>
                <span
                  class="font-mono text-xs text-muted"
                  aria-hidden="true"
                >{{ String(index + 1).padStart(2, '0') }}</span>
              </div>
              <h3 class="mt-8 text-xl font-semibold tracking-[-0.02em] text-highlighted">
                {{ item.title }}
              </h3>
              <p class="mt-2.5 text-[0.95rem] leading-relaxed text-pretty text-muted">
                {{ item.description }}
              </p>
            </div>
            <div
              v-if="focusExtras[index]"
              class="rounded-xl border border-default bg-(--ui-bg-muted) p-4 lg:w-64 lg:shrink-0 lg:self-start"
            >
              <p class="signal-eyebrow text-[0.65rem]">
                {{ focusExtras[index]!.label }}
              </p>
              <ul
                class="mt-3 space-y-2"
                :aria-label="focusExtras[index]!.label"
              >
                <li
                  v-for="(extra, extraIndex) in focusExtras[index]!.items"
                  :key="extra"
                  class="flex items-center gap-2.5 text-sm text-toned"
                >
                  <span
                    class="font-mono text-[0.7rem] text-primary"
                    aria-hidden="true"
                  >{{ String(extraIndex + 1).padStart(2, '0') }}</span>
                  <span>{{ extra }}</span>
                </li>
              </ul>
            </div>
          </div>
        </Motion>
      </ul>
    </section>

    <!-- Experience -->
    <section
      id="experience"
      aria-labelledby="signal-experience-title"
      class="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20"
    >
      <div class="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
        <div class="lg:sticky lg:top-28 lg:self-start">
          <SectionHeader
            index="02"
            eyebrow="Experience"
            heading-id="signal-experience-title"
            :title="page.experience.title"
            :description="page.experience.description"
          />
        </div>

        <div>
          <ol
            id="signal-experience-list"
            class="signal-timeline space-y-10"
            :aria-label="page.experience.title"
          >
            <Motion
              v-for="(item, index) in visibleExperience"
              :key="`${item.title}-${item.period}`"
              as="li"
              class="relative pl-10"
              v-bind="reveal"
              :transition="{ delay: index * 0.06 }"
            >
              <span
                class="signal-node"
                :class="index === 0 ? 'signal-node--current' : ''"
                aria-hidden="true"
              />
              <p class="flex flex-wrap items-center gap-2 font-mono text-xs tracking-[0.06em] text-muted uppercase">
                <span :class="index === 0 ? 'text-primary' : ''">{{ item.period }}</span>
                <span
                  v-if="index === 0"
                  class="rounded-full border border-(--ui-primary)/40 px-2 py-0.5 text-[0.65rem] text-primary"
                >Current</span>
              </p>
              <h3
                class="mt-2 font-semibold tracking-[-0.02em] text-highlighted"
                :class="index === 0 ? 'text-2xl' : 'text-lg'"
              >
                {{ item.title }}
              </h3>
              <p class="mt-0.5 text-sm text-toned">
                {{ item.organization }}
              </p>
              <p class="mt-3 max-w-xl text-[0.95rem] leading-relaxed text-muted">
                {{ item.summary }}
              </p>
              <ul
                v-if="index === 0 && item.highlights.length"
                class="mt-4 space-y-2"
                :aria-label="`${item.title} highlights`"
              >
                <li
                  v-for="highlight in item.highlights"
                  :key="highlight"
                  class="flex items-start gap-2.5 text-[0.95rem] text-toned"
                >
                  <UIcon
                    name="i-lucide-check"
                    class="mt-1 size-4 shrink-0 text-primary"
                  />
                  <span>{{ highlight }}</span>
                </li>
              </ul>
            </Motion>
          </ol>

          <UButton
            v-if="hiddenExperienceCount"
            color="neutral"
            variant="outline"
            class="mt-8 ml-10 rounded-full bg-(--signal-glass) px-4 backdrop-blur"
            :trailing-icon="experienceExpanded ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
            :aria-expanded="experienceExpanded"
            aria-controls="signal-experience-list"
            @click="experienceExpanded = !experienceExpanded"
          >
            {{ experienceExpanded ? 'Show fewer roles' : `Show ${hiddenExperienceCount} earlier roles` }}
          </UButton>
        </div>
      </div>
    </section>

    <!-- Speaking -->
    <section
      v-if="talks.length"
      aria-labelledby="signal-speaking-title"
      class="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20"
    >
      <SectionHeader
        index="03"
        eyebrow="Speaking"
        heading-id="signal-speaking-title"
        :title="page.speaking.title"
        :description="page.speaking.description"
        :link="page.speaking.link"
      />

      <ul
        class="signal-stats mt-12 divide-y divide-(--ui-border) overflow-hidden"
        aria-label="Talks and workshops"
      >
        <Motion
          v-for="(talk, index) in talks"
          :key="`${talk.title}-${talk.event}`"
          as="li"
          v-bind="reveal"
          :transition="{ delay: index * 0.06 }"
        >
          <TalkRow :talk />
        </Motion>
      </ul>
    </section>

    <!-- Labs -->
    <section
      v-if="featuredLab"
      aria-labelledby="signal-labs-title"
      class="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20"
    >
      <SectionHeader
        index="04"
        eyebrow="Labs"
        heading-id="signal-labs-title"
        :title="page.labs.title"
        :description="page.labs.description"
        :link="page.labs.link"
      />

      <ul
        class="mt-12 grid gap-5 md:grid-cols-2"
        aria-label="Lab projects"
      >
        <Motion
          as="li"
          class="md:col-span-2"
          v-bind="reveal"
        >
          <LabCard
            :lab="featuredLab"
            featured
          />
        </Motion>
        <Motion
          v-for="(lab, index) in otherLabs"
          :key="lab.title"
          as="li"
          v-bind="reveal"
          :transition="{ delay: index * 0.08 }"
        >
          <LabCard :lab />
        </Motion>
      </ul>
    </section>
  </div>
</template>
