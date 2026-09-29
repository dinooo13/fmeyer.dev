<script setup lang="ts">
import type { IndexCollectionItem, LabsCollectionItem, TalksCollectionItem } from '@nuxt/content'

type Tint = 'blue' | 'amber' | 'violet' | 'emerald' | 'rose'

const props = defineProps<{
  page: IndexCollectionItem
  labs: LabsCollectionItem[]
  talks: TalksCollectionItem[]
}>()

const { global, footer } = useAppConfig()

const tints: Tint[] = ['violet', 'emerald', 'amber', 'blue']
const focusIcons = ['i-lucide-rocket', 'i-lucide-workflow', 'i-lucide-graduation-cap', 'i-lucide-mic-vocal']
const focusTints: Tint[] = ['blue', 'violet', 'amber', 'emerald']

const firstName = computed(() => props.page.hero.name.split(' ')[0])
const experience = computed(() => props.page.experience.items)
const current = computed(() => experience.value[0])
const firstRole = computed(() => experience.value.at(-1))
const currentSince = computed(() => current.value?.period.split(' - ')[0])
const careerStart = computed(() => firstRole.value?.period.split(' - ')[0])
const careerStartYear = computed(() => careerStart.value?.split(' ').at(-1))

const featuredLab = computed(() => props.labs[0])
const moreLabs = computed(() => props.labs.slice(1))
const latency = computed(() => featuredLab.value?.description.match(/(\d+)\s?ms/)?.[1])
const latencyLabel = computed(() => {
  const text = `${featuredLab.value?.challenge ?? ''} ${featuredLab.value?.approach ?? ''}`
  return /release-to-paste/i.test(text) ? 'release to paste' : 'latency'
})
const featuredPitch = computed(() => featuredLab.value?.description.split(/(?<=\.)\s/)[0])
const featuredPerks = computed(() => {
  const description = featuredLab.value?.description ?? ''
  return [
    /on device/i.test(description) ? 'On device' : null,
    /offline/i.test(description) ? 'Offline' : null,
    /MIT licensed/i.test(description) ? 'MIT licensed' : null
  ].filter((value): value is string => Boolean(value))
})

const latestTalk = computed(() => getLatestTalk(props.talks))
const latestTalkUpcoming = computed(() => {
  const timestamp = getTimestamp(latestTalk.value?.date)
  return timestamp !== null && timestamp >= Date.now() - 86_400_000
})

const talkFormats = computed(() => {
  const formats = new Set(props.talks.map(talk => (talk.format ?? 'Talk').toLowerCase()))
  const parts = [
    [...formats].some(format => format.includes('talk')) ? 'talks' : null,
    [...formats].some(format => format.includes('workshop')) ? 'workshops' : null,
    [...formats].some(format => format.includes('course')) ? 'courses' : null
  ].filter(Boolean)
  const label = parts.length > 1 ? `${parts.slice(0, -1).join(', ')} & ${parts.at(-1)}` : parts[0] ?? 'talks'
  return label.charAt(0).toUpperCase() + label.slice(1)
})

const socialLinks = computed(() => (footer?.links ?? []).filter(link => !String(link.to).startsWith('mailto:')))

const expanded = ref(false)
const collapsedCount = 3
const visibleExperience = computed(() => expanded.value ? experience.value : experience.value.slice(0, collapsedCount))
const hiddenCount = computed(() => Math.max(experience.value.length - collapsedCount, 0))
</script>

<template>
  <div class="mx-auto max-w-6xl px-3 sm:px-6 lg:px-8">
    <!-- Bento hero -->
    <section
      aria-labelledby="studio-hero-name"
      class="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-4"
    >
      <!-- Intro -->
      <div
        class="studio-tile studio-glass studio-enter studio-tint-blue flex flex-col justify-between gap-7 p-7 sm:p-9 md:col-span-2 lg:row-span-2"
        style="--studio-i: 0"
      >
        <div>
          <p class="studio-pill">
            <span
              class="size-1.5 rounded-full bg-(--tint-chip)"
              aria-hidden="true"
            />
            {{ page.hero.role }}
          </p>
          <h1
            id="studio-hero-name"
            class="studio-display mt-5 text-[3.4rem] leading-[0.9] font-extrabold text-highlighted sm:text-7xl lg:text-[4.75rem]"
          >
            {{ page.hero.name }}
          </h1>
          <p class="mt-5 max-w-xl text-base leading-7 text-pretty text-toned sm:text-[1.0625rem]">
            {{ page.hero.intro }}
          </p>
        </div>

        <div class="flex flex-col gap-6">
          <dl class="grid grid-cols-3 gap-3 border-t border-(--ui-border) pt-5">
            <div class="flex flex-col">
              <dt class="text-xs font-medium text-muted sm:text-sm">
                Lab projects
              </dt>
              <dd class="studio-display order-first text-3xl font-bold text-highlighted sm:text-4xl">
                {{ labs.length }}
              </dd>
            </div>
            <div class="flex flex-col">
              <dt class="text-xs font-medium text-muted sm:text-sm">
                {{ talkFormats }}
              </dt>
              <dd class="studio-display order-first text-3xl font-bold text-highlighted sm:text-4xl">
                {{ talks.length }}
              </dd>
            </div>
            <div
              v-if="careerStartYear"
              class="flex flex-col"
            >
              <dt class="text-xs font-medium text-muted sm:text-sm">
                Building since
              </dt>
              <dd class="studio-display order-first text-3xl font-bold text-highlighted sm:text-4xl">
                {{ careerStartYear }}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <!-- Portrait -->
      <div
        class="studio-tile studio-enter group relative aspect-[4/3] overflow-hidden md:aspect-auto md:row-span-2 md:min-h-[26rem] lg:col-start-3 lg:row-start-1 lg:min-h-0"
        style="--studio-i: 1"
      >
        <NuxtImg
          :src="global.picture.light"
          alt=""
          width="1531"
          height="1410"
          sizes="130vw md:70vw lg:680px"
          densities="x1 x2"
          fit="cover"
          loading="eager"
          fetchpriority="high"
          class="studio-portrait-img absolute inset-0 size-full object-cover object-[50%_30%]"
        />
        <div
          class="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/55 to-transparent"
          aria-hidden="true"
        />
        <p class="absolute inset-x-3 bottom-3 flex items-center gap-2.5 rounded-2xl bg-white/80 px-3.5 py-2.5 text-stone-900 backdrop-blur-md dark:bg-stone-950/70 dark:text-white">
          <UIcon
            name="i-lucide-hand"
            class="studio-wave-hand size-5 shrink-0 text-amber-600 dark:text-amber-300"
          />
          <span class="text-sm leading-tight font-semibold">Hi, I'm {{ firstName }}</span>
        </p>
      </div>

      <!-- Now -->
      <div
        v-if="current"
        class="studio-tile studio-tinted studio-tint-amber studio-enter studio-lift flex flex-col justify-between gap-5 p-6 md:col-start-2 md:row-start-2 lg:col-start-4 lg:row-start-1"
        style="--studio-i: 2"
      >
        <div class="flex items-center justify-between gap-3">
          <h2 class="studio-pill">
            <span
              class="relative flex size-2"
              aria-hidden="true"
            >
              <span class="studio-ping absolute inset-0 rounded-full border border-(--tint-chip)" />
              <span class="relative size-2 rounded-full bg-(--tint-chip)" />
            </span>
            Now
          </h2>
          <span class="text-xs font-semibold text-toned">since {{ currentSince }}</span>
        </div>
        <div>
          <p class="studio-display studio-ink text-[1.75rem] leading-[1.05] font-bold">
            {{ current.title }}
          </p>
          <p class="mt-1 text-sm font-medium text-toned">
            {{ current.organization }}
          </p>
        </div>
        <div>
          <ol
            class="flex items-center gap-1"
            aria-label="Career path"
          >
            <li
              v-for="(role, index) in [...experience].reverse()"
              :key="role.period"
              class="h-1.5 flex-1 rounded-full"
              :class="index === experience.length - 1 ? 'bg-(--tint-chip)' : 'bg-(--tint-chip)/30'"
            >
              <span class="sr-only">{{ role.title }}, {{ role.period }}</span>
            </li>
          </ol>
          <p class="mt-2 text-xs font-medium text-toned">
            {{ experience.length }} roles since {{ careerStart }}
          </p>
        </div>
      </div>

      <!-- Contact -->
      <div
        class="studio-tile studio-tinted studio-tint-rose studio-enter studio-lift flex flex-col justify-between gap-5 p-6 md:col-start-2 md:row-start-3 lg:col-start-4 lg:row-start-2"
        style="--studio-i: 3"
      >
        <div class="flex items-center justify-between gap-3">
          <h2 class="studio-pill">
            <UIcon
              name="i-lucide-hand"
              class="size-3.5"
            />
            Say hello
          </h2>
        </div>
        <a
          :href="`mailto:${global.email}`"
          class="studio-link group block"
        >
          <span class="text-sm font-medium text-toned">Email me at</span>
          <span class="studio-display studio-ink mt-0.5 flex items-center gap-1.5 text-xl font-bold break-all">
            {{ global.email }}
            <UIcon
              name="i-lucide-arrow-up-right"
              class="studio-arrow studio-arrow-diagonal size-5 shrink-0"
            />
          </span>
        </a>
        <nav aria-label="Social links">
          <ul class="flex gap-2">
            <li
              v-for="link in socialLinks"
              :key="link.to"
            >
              <a
                :href="link.to"
                target="_blank"
                rel="noopener noreferrer me"
                :aria-label="link['aria-label']"
                class="studio-btn studio-btn-soft size-10 justify-center p-0"
              >
                <UIcon
                  :name="link.icon"
                  class="size-[1.1rem]"
                />
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <!-- Featured lab -->
      <article
        v-if="featuredLab"
        class="studio-tile studio-tinted studio-tint-violet studio-enter studio-lift group flex flex-col gap-5 overflow-hidden p-6 sm:p-7 md:col-span-2 md:row-start-4 lg:col-start-1 lg:row-start-3"
        style="--studio-i: 4"
      >
        <div class="flex items-start justify-between gap-4">
          <div class="flex items-center gap-3">
            <span class="studio-chip size-12 rounded-2xl">
              <UIcon
                :name="featuredLab.icon || 'i-lucide-box'"
                class="size-6"
              />
            </span>
            <div>
              <h2 class="text-xs font-semibold tracking-wide text-toned uppercase">
                Featured lab
              </h2>
              <h3 class="studio-display text-2xl font-bold text-highlighted sm:text-3xl">
                <NuxtLink
                  :to="getLabPath(featuredLab)"
                  class="studio-stretched"
                >
                  {{ featuredLab.title }}
                </NuxtLink>
              </h3>
            </div>
          </div>
          <div
            v-if="featuredLab.icon === 'i-lucide-mic'"
            class="flex h-10 items-center gap-[3px] pt-1"
            aria-hidden="true"
          >
            <span
              v-for="bar in 9"
              :key="bar"
              class="studio-wave-bar w-[3px] rounded-full bg-(--tint-chip)"
              :style="{ '--studio-i': bar, 'height': `${[40, 70, 100, 60, 85, 45, 95, 55, 35][bar - 1]}%` }"
            />
          </div>
        </div>

        <p class="text-base font-medium text-pretty text-toned">
          {{ featuredPitch }}
        </p>

        <div class="mt-auto flex flex-wrap items-end justify-between gap-4">
          <div class="flex flex-wrap items-center gap-2">
            <p
              v-if="latency"
              class="mr-2 flex items-baseline gap-1.5"
            >
              <span class="studio-display studio-ink text-3xl font-extrabold">~{{ latency }}&thinsp;ms</span>
              <span class="text-sm font-medium text-toned">{{ latencyLabel }}</span>
            </p>
            <span
              v-for="perk in featuredPerks"
              :key="perk"
              class="studio-pill"
            >{{ perk }}</span>
          </div>
          <span
            class="studio-ink inline-flex items-center gap-1.5 text-sm font-semibold"
            aria-hidden="true"
          >
            View lab
            <UIcon
              name="i-lucide-arrow-right"
              class="studio-arrow size-4"
            />
          </span>
        </div>
      </article>

      <!-- Latest talk -->
      <article
        v-if="latestTalk"
        class="studio-tile studio-tinted studio-tint-emerald studio-enter studio-lift group flex flex-col gap-5 p-6 sm:p-7 md:col-span-2 md:row-start-5 lg:col-start-3 lg:row-start-3"
        style="--studio-i: 5"
      >
        <div class="flex items-start gap-4">
          <DesignsStudioDateBlock
            :date="latestTalk.date"
            :label="latestTalk.dateLabel"
          />
          <div class="min-w-0">
            <h2 class="text-xs font-semibold tracking-wide text-toned uppercase">
              {{ latestTalkUpcoming ? 'Next on stage' : 'Latest talk' }}
            </h2>
            <p class="studio-ink mt-1 text-sm font-semibold">
              {{ latestTalk.event }}
            </p>
            <h3 class="studio-display mt-1 text-xl lg:line-clamp-3 leading-snug font-bold text-balance text-highlighted">
              <NuxtLink
                :to="getTalkPath(latestTalk)"
                class="studio-stretched"
              >
                {{ latestTalk.title }}
              </NuxtLink>
            </h3>
            <p class="mt-2 line-clamp-2 text-sm leading-6 text-toned">
              {{ latestTalk.summary }}
            </p>
          </div>
        </div>

        <div class="mt-auto flex flex-wrap items-center justify-between gap-3">
          <div class="flex flex-wrap gap-2">
            <span
              v-if="latestTalk.format"
              class="studio-pill"
            >{{ latestTalk.format }}</span>
            <span
              v-if="latestTalk.duration"
              class="studio-pill"
            >{{ latestTalk.duration.split(' (')[0] }}</span>
          </div>
          <NuxtLink
            to="/speaking"
            class="studio-link studio-ink relative z-[1] inline-flex items-center gap-1.5 text-sm font-semibold"
          >
            All {{ talks.length }} sessions
            <UIcon
              name="i-lucide-arrow-right"
              class="studio-arrow size-4"
            />
          </NuxtLink>
        </div>
      </article>
    </section>

    <!-- Focus -->
    <section
      aria-labelledby="studio-focus"
      class="mt-24 sm:mt-32"
    >
      <DesignsStudioSectionHeading
        id="studio-focus"
        :title="page.focus.title"
        :description="page.focus.description"
        icon="i-lucide-target"
        tint="blue"
      />
      <ul
        class="mt-8 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4"
        :aria-label="page.focus.title"
      >
        <Motion
          v-for="(item, index) in page.focus.items"
          :key="item.title"
          as="li"
          :initial="{ opacity: 0, transform: 'translateY(16px)' }"
          :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
          :transition="{ delay: index * 0.07, duration: 0.5 }"
          :in-view-options="{ once: true }"
        >
          <div
            class="studio-tile studio-lift flex h-full flex-col gap-3 p-5 sm:gap-4 sm:p-6"
            :class="`studio-tint-${focusTints[index % focusTints.length]}`"
          >
            <div class="flex items-center gap-3 sm:flex-col sm:items-start sm:gap-4">
              <span class="studio-chip size-10 rounded-2xl sm:size-11">
                <UIcon
                  :name="focusIcons[index % focusIcons.length]!"
                  class="size-5"
                />
              </span>
              <h3 class="studio-display text-lg leading-snug font-bold text-highlighted">
                {{ item.title }}
              </h3>
            </div>
            <p class="text-sm leading-6 text-muted">
              {{ item.description }}
            </p>
          </div>
        </Motion>
      </ul>
    </section>

    <!-- Experience -->
    <section
      aria-labelledby="studio-experience"
      class="mt-24 grid gap-8 sm:mt-32 lg:grid-cols-[20rem_1fr] lg:gap-12"
    >
      <div class="lg:sticky lg:top-28 lg:self-start">
        <DesignsStudioSectionHeading
          id="studio-experience"
          :title="page.experience.title"
          :description="page.experience.description"
          icon="i-lucide-briefcase"
          tint="amber"
        />
      </div>

      <div>
        <ol
          id="studio-experience-list"
          class="relative space-y-4 pl-7 before:absolute before:top-4 before:bottom-4 before:left-[0.4rem] before:w-px before:bg-(--ui-border-accented)"
          :aria-label="page.experience.title"
        >
          <Motion
            v-for="(item, index) in visibleExperience"
            :key="`${item.title}-${item.period}`"
            as="li"
            class="relative"
            :initial="{ opacity: 0, transform: 'translateY(16px)' }"
            :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
            :transition="{ delay: Math.min(index, 3) * 0.06, duration: 0.5 }"
            :in-view-options="{ once: true }"
          >
            <span
              class="absolute top-7 -left-7 size-3.5 rounded-full ring-4 ring-(--ui-bg)"
              :class="index === 0 ? 'bg-(--studio-amber-chip)' : 'bg-(--ui-border-accented)'"
              aria-hidden="true"
            />
            <div
              class="studio-tile p-6 sm:p-7"
              :class="index === 0 ? 'studio-tinted studio-tint-amber' : ''"
            >
              <div class="flex flex-wrap items-center gap-2">
                <span
                  class="text-sm font-semibold"
                  :class="index === 0 ? 'studio-ink' : 'text-muted'"
                >{{ item.period }}</span>
                <span
                  v-if="index === 0"
                  class="studio-pill"
                >Current role</span>
              </div>
              <h3 class="studio-display mt-2 text-xl font-bold text-highlighted sm:text-2xl">
                {{ item.title }}
              </h3>
              <p class="mt-0.5 text-sm font-medium text-toned">
                {{ item.organization }}
              </p>
              <p class="mt-3 text-sm leading-6 text-muted">
                {{ item.summary }}
              </p>
              <ul
                v-if="index === 0 && item.highlights.length"
                class="mt-4 grid gap-2"
              >
                <li
                  v-for="highlight in item.highlights"
                  :key="highlight"
                  class="flex items-start gap-2.5 text-sm leading-6 text-toned"
                >
                  <UIcon
                    name="i-lucide-check"
                    class="studio-ink mt-1 size-4 shrink-0"
                  />
                  <span>{{ highlight }}</span>
                </li>
              </ul>
            </div>
          </Motion>
        </ol>

        <button
          v-if="hiddenCount"
          type="button"
          class="studio-btn studio-btn-soft group mt-5 ml-7 cursor-pointer"
          :aria-expanded="expanded"
          aria-controls="studio-experience-list"
          @click="expanded = !expanded"
        >
          {{ expanded ? 'Show less experience' : `Show ${hiddenCount} earlier roles` }}
          <UIcon
            :name="expanded ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
            class="size-4"
          />
        </button>
      </div>
    </section>

    <!-- Labs -->
    <section
      aria-labelledby="studio-labs"
      class="mt-24 sm:mt-32"
    >
      <DesignsStudioSectionHeading
        id="studio-labs"
        :title="page.labs.title"
        :description="page.labs.description"
        icon="i-lucide-flask-conical"
        tint="violet"
      >
        <template #action>
          <NuxtLink
            :to="page.labs.link.to ?? '/labs'"
            class="studio-btn studio-btn-soft group shrink-0"
          >
            All {{ labs.length }} labs
            <UIcon
              name="i-lucide-arrow-right"
              class="studio-arrow size-4"
            />
          </NuxtLink>
        </template>
      </DesignsStudioSectionHeading>

      <ul
        v-if="moreLabs.length"
        class="mt-8 grid gap-4 md:grid-cols-2"
        aria-label="More lab projects"
      >
        <Motion
          v-for="(lab, index) in moreLabs"
          :key="lab.title"
          as="li"
          :initial="{ opacity: 0, transform: 'translateY(16px)' }"
          :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
          :transition="{ delay: index * 0.08, duration: 0.5 }"
          :in-view-options="{ once: true }"
        >
          <DesignsStudioLabCard
            :lab="lab"
            :tint="tints[(index + 1) % tints.length]"
          />
        </Motion>
      </ul>
    </section>

    <!-- Speaking -->
    <section
      aria-labelledby="studio-speaking"
      class="mt-24 sm:mt-32"
    >
      <DesignsStudioSectionHeading
        id="studio-speaking"
        :title="page.speaking.title"
        :description="page.speaking.description"
        icon="i-lucide-mic-vocal"
        tint="emerald"
      >
        <template #action>
          <NuxtLink
            :to="page.speaking.link.to ?? '/speaking'"
            class="studio-btn studio-btn-soft group shrink-0"
          >
            {{ page.speaking.link.label }}
            <UIcon
              name="i-lucide-arrow-right"
              class="studio-arrow size-4"
            />
          </NuxtLink>
        </template>
      </DesignsStudioSectionHeading>

      <ul
        class="mt-8 grid gap-4 md:grid-cols-2"
        aria-label="Talks and speaking engagements"
      >
        <Motion
          v-for="(talk, index) in talks"
          :key="`${talk.title}-${talk.event}`"
          as="li"
          :initial="{ opacity: 0, transform: 'translateY(16px)' }"
          :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
          :transition="{ delay: (index % 2) * 0.08, duration: 0.5 }"
          :in-view-options="{ once: true }"
        >
          <DesignsStudioTalkCard
            :talk="talk"
            :tint="(['emerald', 'blue', 'amber', 'violet'] as const)[index % 4]"
          />
        </Motion>
      </ul>
    </section>
  </div>
</template>
