<script setup lang="ts">
import type { LabsCollectionItem } from '@nuxt/content'

const props = defineProps<{
  lab: LabsCollectionItem
  related: LabsCollectionItem[]
}>()

const splitSentence = (text: string) => {
  const match = text.match(/^.+?[.!?](?=\s|$)/)
  const lead = match ? match[0] : text

  return { lead, rest: text.slice(lead.length).trim() }
}

const isoDate = computed(() => new Date(props.lab.date).toISOString().slice(0, 10))
const approach = computed(() => splitSentence(props.lab.approach))
const status = computed(() => labStatusMap[props.lab.status].label)

const numerals = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii']
</script>

<template>
  <div class="ed-page">
    <UContainer>
      <article aria-labelledby="ed-lab-title">
        <!-- Masthead of the feature ------------------------------------ -->
        <header class="pt-8 sm:pt-12 lg:pt-16">
          <div class="ed-enter-rise-sm flex items-baseline justify-between gap-4">
            <nav aria-label="Back">
              <ul class="list-none p-0">
                <li>
                  <NuxtLink
                    to="/labs"
                    class="ed-kicker ed-back-link"
                  >
                    <span
                      class="ed-link-arrow ed-link-arrow-left mr-1.5"
                      aria-hidden="true"
                    >←</span>All labs
                  </NuxtLink>
                </li>
              </ul>
            </nav>
            <p class="ed-kicker text-right">
              <span class="text-primary">Lab report</span>
              <span aria-hidden="true"> · </span>{{ status }}
            </p>
          </div>

          <div
            class="ed-rule ed-enter-draw ed-delay-1 mt-4"
            aria-hidden="true"
          />

          <div class="mt-10 grid grid-cols-12 gap-x-6 gap-y-8 sm:mt-14 lg:mt-16">
            <h1
              id="ed-lab-title"
              class="ed-detail-title ed-enter-rise ed-delay-1 col-span-12 -ml-[0.04em]"
            >
              {{ lab.title }}<span
                class="text-primary"
                aria-hidden="true"
              >.</span>
            </h1>

            <p class="ed-serif ed-enter-rise-sm ed-delay-2 col-span-12 text-[clamp(1.5rem,2.6vw,2.125rem)] leading-[1.22] text-toned italic lg:col-span-8">
              {{ lab.description }}
            </p>

            <nav
              v-if="lab.url || lab.repoUrl"
              class="ed-enter-rise-sm ed-delay-3 col-span-12 lg:col-span-3 lg:col-start-10 lg:pt-2"
              :aria-label="`${lab.title} links`"
            >
              <ul class="flex list-none flex-wrap gap-x-8 gap-y-3 p-0 lg:flex-col lg:items-start">
                <li v-if="lab.url">
                  <NuxtLink
                    :to="lab.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="ed-serif ed-link text-[1.75rem] leading-none italic"
                  >
                    Open the demo<span class="sr-only"> of {{ lab.title }} (opens in a new tab)</span><span
                      class="ed-link-arrow ml-1.5 text-[0.75em] not-italic"
                      aria-hidden="true"
                    >↗</span>
                  </NuxtLink>
                </li>
                <li v-if="lab.repoUrl">
                  <NuxtLink
                    :to="lab.repoUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="ed-serif ed-link text-[1.75rem] leading-none italic"
                  >
                    Read the source<span class="sr-only"> of {{ lab.title }} on GitHub (opens in a new tab)</span><span
                      class="ed-link-arrow ml-1.5 text-[0.75em] not-italic"
                      aria-hidden="true"
                    >↗</span>
                  </NuxtLink>
                </li>
              </ul>
            </nav>
          </div>

          <!-- Hairline meta strip -->
          <dl class="ed-meta-strip ed-enter-rise-sm ed-delay-3 mt-12 grid grid-cols-2 border-y border-(--ed-rule) sm:mt-16 lg:grid-cols-12">
            <div class="lg:col-span-2">
              <dt class="ed-kicker">
                Status
              </dt>
              <dd>{{ status }}</dd>
            </div>
            <div class="lg:col-span-3">
              <dt class="ed-kicker">
                Filed
              </dt>
              <dd>
                <time :datetime="isoDate">{{ formatLabDate(lab.date) }}</time>
              </dd>
            </div>
            <div class="lg:col-span-2">
              <dt class="ed-kicker">
                By
              </dt>
              <dd>
                <NuxtLink
                  to="/"
                  class="ed-link"
                >Fabian Meyer</NuxtLink>
              </dd>
            </div>
            <div class="lg:col-span-5">
              <dt class="ed-kicker">
                Filed under
              </dt>
              <dd>
                <ul
                  class="flex list-none flex-wrap gap-x-2 gap-y-1 p-0"
                  :aria-label="`${lab.title} tags`"
                >
                  <li
                    v-for="(tag, index) in lab.tags"
                    :key="tag"
                  >
                    {{ tag }}<span
                      v-if="index < lab.tags.length - 1"
                      class="ml-2 text-muted"
                      aria-hidden="true"
                    >/</span>
                  </li>
                </ul>
              </dd>
            </div>
          </dl>
        </header>

        <figure
          v-if="lab.image"
          class="mt-12 sm:mt-16"
        >
          <div class="ed-portrait-frame">
            <NuxtImg
              :src="lab.image"
              :alt="`${lab.title} project preview`"
              width="1200"
              height="675"
              sizes="100vw lg:1200px"
              densities="x1 x2"
              loading="lazy"
              class="aspect-video w-full object-cover"
            />
          </div>
          <figcaption class="ed-kicker mt-3 flex justify-between gap-4">
            <span aria-hidden="true">Fig. 01</span>
            <span>{{ lab.title }}</span>
          </figcaption>
        </figure>

        <!-- 01 Challenge ---------------------------------------------- -->
        <section
          aria-labelledby="ed-lab-challenge"
          class="ed-feature-section mt-20 sm:mt-28"
        >
          <div class="ed-feature-margin">
            <p
              class="ed-kicker"
              aria-hidden="true"
            >
              <span class="text-primary">01</span><span class="mx-1.5">/</span>03
            </p>
            <h2
              id="ed-lab-challenge"
              class="ed-feature-heading"
            >
              The challenge
            </h2>
          </div>
          <div class="ed-feature-body">
            <p class="ed-dropcap ed-body-copy">
              {{ lab.challenge }}
            </p>
          </div>
        </section>

        <!-- 02 Approach ----------------------------------------------- -->
        <section
          aria-labelledby="ed-lab-approach"
          class="ed-feature-section mt-16 sm:mt-24"
        >
          <div class="ed-feature-margin">
            <p
              class="ed-kicker"
              aria-hidden="true"
            >
              <span class="text-primary">02</span><span class="mx-1.5">/</span>03
            </p>
            <h2
              id="ed-lab-approach"
              class="ed-feature-heading"
            >
              The approach
            </h2>
          </div>
          <div class="ed-feature-body">
            <p class="ed-serif text-[clamp(1.625rem,2.4vw,2.125rem)] leading-[1.18] text-highlighted">
              {{ approach.lead }}
            </p>
            <p
              v-if="approach.rest"
              class="ed-body-copy mt-6"
            >
              {{ approach.rest }}
            </p>
          </div>
        </section>

        <!-- 03 Next steps --------------------------------------------- -->
        <section
          aria-labelledby="ed-lab-next"
          class="ed-feature-section mt-16 sm:mt-24"
        >
          <div class="ed-feature-margin">
            <p
              class="ed-kicker"
              aria-hidden="true"
            >
              <span class="text-primary">03</span><span class="mx-1.5">/</span>03
            </p>
            <h2
              id="ed-lab-next"
              class="ed-feature-heading"
            >
              Next steps
            </h2>
          </div>
          <div class="ed-feature-body">
            <ol class="list-none border-b border-accented p-0">
              <li
                v-for="(step, index) in lab.nextSteps"
                :key="step"
                class="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-3 border-t border-accented py-5 sm:grid-cols-[3.5rem_minmax(0,1fr)]"
              >
                <span
                  class="ed-serif text-2xl leading-[1.2] text-primary italic"
                  aria-hidden="true"
                >{{ numerals[index] ?? index + 1 }}.</span>
                <span class="ed-body-copy">{{ step }}</span>
              </li>
            </ol>

            <aside
              v-if="lab.note"
              aria-label="Note"
              class="mt-10 border-l border-primary pl-5"
            >
              <p
                class="ed-kicker text-primary"
                aria-hidden="true"
              >
                Note
              </p>
              <p class="ed-serif mt-2 text-[1.5rem] leading-[1.25] text-highlighted italic">
                {{ lab.note }}
              </p>
            </aside>
          </div>
        </section>
      </article>

      <!-- More from the lab ------------------------------------------- -->
      <section
        v-if="related.length"
        aria-labelledby="ed-lab-related"
        class="mt-28 sm:mt-40"
      >
        <DesignsEditorialSectionHead
          id="ed-lab-related"
          number="See also"
          title="More labs"
          description="More projects from the same playground."
          :link="{ label: 'All labs', to: '/labs' }"
        />
        <ul
          class="list-none border-b border-accented p-0"
          aria-label="Related lab projects"
        >
          <Motion
            v-for="(entry, index) in related"
            :key="entry.title"
            as="li"
            :initial="{ transform: 'translateY(16px)' }"
            :while-in-view="{ transform: 'translateY(0)' }"
            :transition="{ delay: index * 0.06 }"
            :in-view-options="{ once: true }"
          >
            <DesignsEditorialLabRow
              :lab="entry"
              :index="index"
            />
          </Motion>
        </ul>
      </section>
    </UContainer>
  </div>
</template>
