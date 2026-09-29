<script setup lang="ts">
import type { IndexCollectionItem, LabsCollectionItem, TalksCollectionItem } from '@nuxt/content'

const props = defineProps<{
  page: IndexCollectionItem
  labs: LabsCollectionItem[]
  talks: TalksCollectionItem[]
}>()

const { global } = useAppConfig()

const splitSentence = (text: string) => {
  const match = text.match(/^.+?[.!?](?=\s|$)/)
  const lead = match ? match[0] : text

  return { lead, rest: text.slice(lead.length).trim() }
}

const name = computed(() => {
  const [first = '', ...rest] = props.page.hero.name.split(' ')

  return { first, rest: rest.join(' ') }
})

const role = computed(() => {
  const [title = '', ...org] = props.page.hero.role.split(' at ')

  return { title, org: org.join(' at ') }
})

const intro = computed(() => splitSentence(props.page.hero.intro))

const experience = computed(() => props.page.experience.items)
const firstRole = computed(() => experience.value.at(-1))
const currentRole = computed(() => experience.value[0])
const yearOf = (period?: string) => period?.match(/\d{4}/)?.[0]
const startYear = computed(() => yearOf(firstRole.value?.period))
const currentYear = computed(() => yearOf(currentRole.value?.period))

const metaItems = computed(() => [
  startYear.value ? `Engineering since ${startYear.value}` : null,
  `${props.labs.length} labs`,
  `${props.talks.length} sessions`
].filter(Boolean))

const leadLab = computed(() => props.labs[0])
const otherLabs = computed(() => props.labs.slice(1))

const featuredTalk = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const upcoming = props.talks
    .filter(talk => (getTimestamp(talk.date) ?? 0) >= today.getTime())
    .sort((left, right) => (getTimestamp(left.date) ?? 0) - (getTimestamp(right.date) ?? 0))

  return upcoming[0]
    ? { talk: upcoming[0], label: 'Next up' }
    : props.talks[0] ? { talk: props.talks[0], label: 'Latest session' } : null
})

const featuredTalkDate = computed(() => {
  const talk = featuredTalk.value?.talk
  if (!talk?.date) return talk?.dateLabel

  return new Intl.DateTimeFormat('en', { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(talk.date))
})

const numerals = ['i', 'ii', 'iii', 'iv', 'v', 'vi']
</script>

<template>
  <div class="ed-page">
    <!-- Hero ------------------------------------------------------------ -->
    <section
      aria-labelledby="ed-hero-name"
      class="pt-10 sm:pt-14 lg:pt-12"
    >
      <UContainer>
        <h1
          id="ed-hero-name"
          class="ed-name -ml-[0.04em]"
        >
          <span class="ed-enter-rise ed-delay-1 block lg:inline-block">{{ name.first }}</span>{{ ' ' }}<span class="ed-enter-rise ed-delay-2 inline-block pl-[0.42em] italic lg:pl-0">{{ name.rest }}<span
            class="text-primary not-italic"
            aria-hidden="true"
          >.</span></span>
        </h1>

        <div
          class="ed-rule ed-enter-draw ed-delay-2 mt-8 sm:mt-12"
          aria-hidden="true"
        />

        <div class="grid grid-cols-12 gap-x-6 gap-y-12 pt-8 lg:pt-10">
          <div class="col-span-12 lg:col-span-7">
            <p class="ed-serif ed-enter-rise-sm ed-delay-2 text-[clamp(2.125rem,4vw,3.25rem)] leading-[1] text-highlighted italic">
              {{ role.title }}<template v-if="role.org">
                <br><span class="text-muted">at</span> {{ role.org }}
              </template>
            </p>

            <p class="ed-enter-rise-sm ed-delay-3 mt-8 max-w-[36rem] text-lg leading-8 text-toned sm:mt-10">
              <span class="font-medium text-highlighted">{{ intro.lead }}</span>
              {{ intro.rest }}
            </p>

            <div class="ed-enter-rise-sm ed-delay-4 mt-10 flex flex-col gap-4 border-t border-default pt-5 sm:mt-12">
              <ul
                class="ed-kicker flex list-none flex-wrap gap-x-3 gap-y-1 p-0"
                aria-label="At a glance"
              >
                <li
                  v-for="(item, index) in metaItems"
                  :key="item ?? index"
                  class="whitespace-nowrap"
                >
                  {{ item }}<span
                    v-if="index < metaItems.length - 1"
                    class="ml-3"
                    aria-hidden="true"
                  >·</span>
                </li>
              </ul>
              <DesignsEditorialSocialLinks />
            </div>
          </div>

          <div class="col-span-12 sm:col-span-9 lg:col-span-4 lg:col-start-9">
            <figure class="ed-enter-rise-sm ed-delay-1">
              <div class="ed-portrait-frame">
                <div class="ed-portrait-crop">
                  <NuxtImg
                    :src="global.picture?.light"
                    alt=""
                    width="440"
                    height="550"
                    sizes="100vw sm:75vw lg:360px"
                    densities="x1 x2"
                    fit="cover"
                    loading="eager"
                    fetchpriority="high"
                    class="ed-enter-settle aspect-[4/5] w-full object-cover"
                  />
                </div>
              </div>
              <figcaption class="ed-kicker mt-3 flex justify-between gap-4">
                <span aria-hidden="true">Fig. 01</span>
                <span>{{ page.hero.name }}</span>
              </figcaption>
            </figure>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- In brief -------------------------------------------------------- -->
    <section
      aria-labelledby="ed-brief"
      class="mt-24 sm:mt-32"
    >
      <UContainer>
        <h2
          id="ed-brief"
          class="sr-only"
        >
          In brief
        </h2>
        <ul
          class="grid list-none gap-0 border-y border-(--ed-rule) p-0 lg:grid-cols-3"
          aria-label="Highlights"
        >
          <Motion
            v-if="leadLab"
            as="li"
            class="ed-row border-b border-default py-8 lg:border-r lg:border-b-0 lg:py-10 lg:pr-8"
            :initial="{ transform: 'translateY(16px)' }"
            :while-in-view="{ transform: 'translateY(0)' }"
            :in-view-options="{ once: true }"
          >
            <p class="ed-kicker">
              <span class="text-primary">Lead lab</span> · {{ labStatusMap[leadLab.status].label }}
            </p>
            <h3 class="ed-serif mt-5 text-5xl leading-none text-highlighted">
              <NuxtLink
                :to="getLabPath(leadLab)"
                class="ed-row-link ed-row-title"
              >
                <span class="ed-row-shift inline-block">{{ leadLab.title }}</span>
              </NuxtLink>
            </h3>
            <p class="mt-4 text-[0.9375rem] leading-7 text-toned">
              {{ splitSentence(leadLab.description).lead }}
            </p>
          </Motion>

          <Motion
            v-if="featuredTalk"
            as="li"
            class="ed-row border-b border-default py-8 lg:border-r lg:border-b-0 lg:px-8 lg:py-10"
            :initial="{ transform: 'translateY(16px)' }"
            :while-in-view="{ transform: 'translateY(0)' }"
            :transition="{ delay: 0.08 }"
            :in-view-options="{ once: true }"
          >
            <p class="ed-kicker">
              <span class="text-primary">{{ featuredTalk.label }}</span> · {{ featuredTalk.talk.format ?? 'Talk' }}
            </p>
            <h3 class="ed-serif mt-5 text-[2rem] leading-[1.05] text-highlighted">
              <NuxtLink
                :to="getTalkPath(featuredTalk.talk)"
                class="ed-row-link ed-row-title"
              >
                {{ featuredTalk.talk.title }}
              </NuxtLink>
            </h3>
            <p class="mt-4 text-[0.9375rem] leading-7 text-toned">
              {{ featuredTalk.talk.event }}, {{ featuredTalkDate }}
            </p>
          </Motion>

          <Motion
            v-if="firstRole && currentRole"
            as="li"
            class="py-8 lg:py-10 lg:pl-8"
            :initial="{ transform: 'translateY(16px)' }"
            :while-in-view="{ transform: 'translateY(0)' }"
            :transition="{ delay: 0.16 }"
            :in-view-options="{ once: true }"
          >
            <p class="ed-kicker">
              <span class="text-primary">Trajectory</span> · {{ experience.length }} roles
            </p>
            <h3 class="ed-serif mt-5 text-5xl leading-none text-highlighted">
              {{ startYear }} <span
                class="text-primary"
                aria-hidden="true"
              >→</span><span class="sr-only">to</span> {{ currentYear }}
            </h3>
            <p class="mt-4 text-[0.9375rem] leading-7 text-toned">
              From {{ firstRole.title }} to {{ currentRole.title }}.
            </p>
          </Motion>
        </ul>
      </UContainer>
    </section>

    <!-- 01 Focus -------------------------------------------------------- -->
    <section
      aria-labelledby="ed-focus"
      class="mt-28 sm:mt-40"
    >
      <UContainer>
        <DesignsEditorialSectionHead
          id="ed-focus"
          number="01"
          total="04"
          :title="page.focus.title"
          :description="page.focus.description"
        />
        <ul
          class="grid list-none gap-x-6 gap-y-14 p-0 md:grid-cols-2 lg:gap-x-16"
          :aria-label="page.focus.title"
        >
          <Motion
            v-for="(item, index) in page.focus.items"
            :key="item.title"
            as="li"
            class="grid grid-cols-[3rem_minmax(0,1fr)] gap-x-2 sm:grid-cols-[4rem_minmax(0,1fr)]"
            :initial="{ opacity: 0, transform: 'translateY(16px)' }"
            :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
            :transition="{ delay: (index % 2) * 0.08 }"
            :in-view-options="{ once: true }"
          >
            <span
              class="ed-serif pt-1 text-3xl leading-none text-primary italic"
              aria-hidden="true"
            >{{ numerals[index] }}.</span>
            <div>
              <h3 class="ed-serif text-[2rem] leading-[1.05] text-highlighted sm:text-[2.25rem]">
                {{ item.title }}
              </h3>
              <p class="mt-4 max-w-md text-base leading-7 text-toned">
                {{ item.description }}
              </p>
            </div>
          </Motion>
        </ul>
      </UContainer>
    </section>

    <!-- 02 Experience --------------------------------------------------- -->
    <section
      aria-labelledby="ed-experience"
      class="mt-28 sm:mt-40"
    >
      <UContainer>
        <DesignsEditorialSectionHead
          id="ed-experience"
          number="02"
          total="04"
          :title="page.experience.title"
          :description="page.experience.description"
        />
        <ol
          class="list-none border-b border-accented p-0"
          :aria-label="page.experience.title"
        >
          <Motion
            v-for="(item, index) in experience"
            :key="`${item.period}-${item.title}`"
            as="li"
            class="grid grid-cols-12 gap-x-6 gap-y-3 border-t border-accented py-7 sm:py-9"
            :initial="{ opacity: 0, transform: 'translateY(12px)' }"
            :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
            :transition="{ delay: index * 0.05 }"
            :in-view-options="{ once: true }"
          >
            <p class="ed-kicker col-span-12 pt-1 lg:col-span-2">
              <span :class="index === 0 ? 'text-primary' : ''">{{ item.period.replace(' - ', ' — ') }}</span>
            </p>
            <div class="col-span-12 lg:col-span-6">
              <h3 class="ed-serif text-[1.875rem] leading-[1.05] text-highlighted sm:text-[2.25rem]">
                {{ item.title }}
              </h3>
              <p class="mt-2 text-[0.9375rem] text-muted">
                {{ item.organization }}
              </p>
            </div>
            <p class="col-span-12 text-base leading-7 text-toned lg:col-span-4 lg:pt-1">
              {{ item.summary }}
            </p>
          </Motion>
        </ol>
      </UContainer>
    </section>

    <!-- 03 Labs --------------------------------------------------------- -->
    <section
      aria-labelledby="ed-labs"
      class="mt-28 sm:mt-40"
    >
      <UContainer>
        <DesignsEditorialSectionHead
          id="ed-labs"
          number="03"
          total="04"
          :title="page.labs.title"
          :description="page.labs.description"
          :link="page.labs.link"
        />
        <ul
          class="list-none border-b border-accented p-0"
          aria-label="Lab projects"
        >
          <Motion
            v-if="leadLab"
            as="li"
            :initial="{ opacity: 0, transform: 'translateY(16px)' }"
            :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
            :in-view-options="{ once: true }"
          >
            <DesignsEditorialLabSpread
              :lab="leadLab"
              :index="0"
              heading-level="h3"
              kicker="Featured"
            />
          </Motion>
          <Motion
            v-for="(lab, index) in otherLabs"
            :key="lab.title"
            as="li"
            :initial="{ opacity: 0, transform: 'translateY(16px)' }"
            :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
            :transition="{ delay: index * 0.06 }"
            :in-view-options="{ once: true }"
          >
            <DesignsEditorialLabRow
              :lab="lab"
              :index="index + 1"
            />
          </Motion>
        </ul>
      </UContainer>
    </section>

    <!-- 04 Speaking ----------------------------------------------------- -->
    <section
      aria-labelledby="ed-speaking"
      class="mt-28 sm:mt-40"
    >
      <UContainer>
        <DesignsEditorialSectionHead
          id="ed-speaking"
          number="04"
          total="04"
          :title="page.speaking.title"
          :description="page.speaking.description"
          :link="page.speaking.link"
        />
        <ul
          class="list-none border-b border-accented p-0"
          aria-label="Talks and speaking engagements"
        >
          <Motion
            v-for="(talk, index) in talks"
            :key="`${talk.title}-${talk.event}`"
            as="li"
            :initial="{ opacity: 0, transform: 'translateY(16px)' }"
            :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
            :transition="{ delay: index * 0.06 }"
            :in-view-options="{ once: true }"
          >
            <DesignsEditorialTalkRow :talk="talk" />
          </Motion>
        </ul>
      </UContainer>
    </section>
  </div>
</template>
