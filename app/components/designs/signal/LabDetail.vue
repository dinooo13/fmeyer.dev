<script setup lang="ts">
import type { LabsCollectionItem } from '@nuxt/content'

const props = defineProps<{
  lab: LabsCollectionItem
  related: LabsCollectionItem[]
}>()

const slug = computed(() => getLabSlug(props.lab))
const status = computed(() => labStatusMap[props.lab.status])

const date = computed(() => new Date(props.lab.date))
const isoDate = computed(() => date.value.toISOString().slice(0, 10))
const longDate = computed(() => new Intl.DateTimeFormat('en', {
  dateStyle: 'long',
  timeZone: 'UTC'
}).format(date.value))

const displayUrl = (value: string) => {
  try {
    const url = new URL(value)
    return `${url.host}${url.pathname}`.replace(/\/$/, '')
  } catch {
    return value
  }
}

// The three content fields read as one pipeline: input, build, output.
const stages = computed(() => [
  { id: 'challenge', index: '01', label: 'input', title: 'Challenge', text: props.lab.challenge, tone: 'is-blue' },
  { id: 'approach', index: '02', label: 'build', title: 'Approach', text: props.lab.approach, tone: 'is-violet' }
])

const reveal = {
  initial: { opacity: 0, transform: 'translateY(16px)' },
  whileInView: { opacity: 1, transform: 'translateY(0)' },
  inViewOptions: { once: true, amount: 0.15 }
}
</script>

<template>
  <div>
    <article aria-labelledby="signal-lab-title">
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
              <NuxtLink to="/labs">
                labs
              </NuxtLink>
            </li>
            <li aria-current="page">
              {{ slug }}
            </li>
          </ol>
        </nav>

        <div class="mt-10 grid gap-10 lg:mt-14 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end lg:gap-14">
          <div>
            <div class="signal-rise signal-rise-1 flex items-center gap-3">
              <span
                class="signal-icon-tile size-12 sm:size-14"
                aria-hidden="true"
              >
                <UIcon
                  :name="lab.icon || 'i-lucide-box'"
                  class="size-5 sm:size-6"
                />
              </span>
              <p class="signal-chip font-mono text-[0.7rem] tracking-[0.12em] text-toned uppercase">
                <span
                  v-if="lab.status === 'wip'"
                  class="signal-live"
                  aria-hidden="true"
                />
                <UIcon
                  v-else
                  :name="labStatusIconMap[lab.status]"
                  class="size-3.5 text-primary"
                  aria-hidden="true"
                />
                <span><span class="sr-only">Status: </span>{{ status.label }}</span>
              </p>
            </div>

            <h1
              id="signal-lab-title"
              class="signal-rise signal-rise-2 mt-7 text-[clamp(2.75rem,11vw,5.25rem)] font-semibold"
            >
              <span class="signal-name inline-block pb-2">{{ lab.title }}</span>
            </h1>

            <p class="signal-rise signal-rise-3 mt-5 max-w-2xl text-lg leading-relaxed text-pretty text-toned sm:text-xl">
              {{ lab.description }}
            </p>

            <nav
              v-if="lab.url || lab.repoUrl"
              :aria-label="`${lab.title} links`"
              class="signal-rise signal-rise-4 mt-8"
            >
              <ul class="flex flex-wrap items-center gap-2.5">
                <li v-if="lab.url">
                  <UButton
                    :to="lab.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    icon="i-lucide-external-link"
                    color="primary"
                    size="lg"
                    class="rounded-full px-5"
                  >
                    Open demo<span class="sr-only"> of {{ lab.title }} (opens in a new tab)</span>
                  </UButton>
                </li>
                <li v-if="lab.repoUrl">
                  <UButton
                    :to="lab.repoUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    icon="i-simple-icons-github"
                    :color="lab.url ? 'neutral' : 'primary'"
                    :variant="lab.url ? 'outline' : 'solid'"
                    size="lg"
                    class="rounded-full px-5"
                    :class="lab.url ? 'bg-(--signal-glass) backdrop-blur' : ''"
                  >
                    View source<span class="sr-only"> of {{ lab.title }} on GitHub (opens in a new tab)</span>
                  </UButton>
                </li>
              </ul>
            </nav>
          </div>

          <!-- Manifest: the lab's metadata as a mono key: value sheet -->
          <div class="signal-spec signal-rise signal-rise-4">
            <p class="signal-spec-head">
              <span>manifest</span>
              <span aria-hidden="true">{{ slug }}.yml</span>
            </p>
            <dl class="signal-spec-body">
              <div>
                <dt>status</dt>
                <dd class="flex items-center gap-2">
                  <span
                    v-if="lab.status === 'wip'"
                    class="signal-live !size-1.5"
                    aria-hidden="true"
                  />
                  {{ status.label }}
                </dd>
              </div>
              <div>
                <dt>date</dt>
                <dd>
                  <time :datetime="isoDate">{{ longDate }}</time>
                </dd>
              </div>
              <div>
                <dt>author</dt>
                <dd>
                  <NuxtLink
                    to="/#identity"
                    class="signal-spec-link"
                  >Fabian Meyer</NuxtLink>
                </dd>
              </div>
              <div v-if="lab.tags.length">
                <dt>stack</dt>
                <dd>
                  <ul
                    class="flex flex-wrap gap-1.5"
                    :aria-label="`${lab.title} tags`"
                  >
                    <li
                      v-for="tag in lab.tags"
                      :key="tag"
                      class="rounded-md border border-default bg-(--ui-bg-muted) px-1.5 py-px text-[0.72rem] text-toned"
                    >
                      {{ tag }}
                    </li>
                  </ul>
                </dd>
              </div>
              <div v-if="lab.repoUrl">
                <dt>source</dt>
                <dd>
                  <a
                    :href="lab.repoUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="signal-spec-link break-all"
                  >{{ displayUrl(lab.repoUrl) }}<span class="sr-only"> (opens in a new tab)</span></a>
                </dd>
              </div>
              <div v-if="lab.url">
                <dt>demo</dt>
                <dd>
                  <a
                    :href="lab.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="signal-spec-link break-all"
                  >{{ displayUrl(lab.url) }}<span class="sr-only"> (opens in a new tab)</span></a>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </header>

      <!-- Pipeline: challenge → approach → next steps -->
      <div class="mx-auto max-w-6xl px-5 pb-16 sm:px-8 sm:pb-24">
        <ol
          class="signal-pipeline"
          :aria-label="`${lab.title}: challenge, approach and next steps`"
        >
          <Motion
            v-for="stage in stages"
            :key="stage.id"
            as="li"
            class="signal-stage"
            :class="stage.tone"
            v-bind="reveal"
          >
            <section
              :aria-labelledby="`signal-stage-${stage.id}`"
              class="grid gap-3 lg:grid-cols-[11rem_minmax(0,1fr)] lg:gap-12"
            >
              <p class="signal-stage-label">
                <span class="signal-stage-index">{{ stage.index }}</span>
                <span>{{ stage.label }}</span>
              </p>
              <div>
                <h2
                  :id="`signal-stage-${stage.id}`"
                  class="text-2xl font-semibold tracking-[-0.03em] text-highlighted sm:text-3xl"
                >
                  {{ stage.title }}
                </h2>
                <p class="mt-4 max-w-[68ch] text-base leading-[1.8] text-pretty text-toned sm:text-[1.075rem]">
                  {{ stage.text }}
                </p>
              </div>
            </section>
          </Motion>

          <Motion
            as="li"
            class="signal-stage is-cyan"
            v-bind="reveal"
          >
            <section
              aria-labelledby="signal-stage-next"
              class="grid gap-3 lg:grid-cols-[11rem_minmax(0,1fr)] lg:gap-12"
            >
              <p class="signal-stage-label">
                <span class="signal-stage-index">03</span>
                <span>output</span>
              </p>
              <div>
                <h2
                  id="signal-stage-next"
                  class="text-2xl font-semibold tracking-[-0.03em] text-highlighted sm:text-3xl"
                >
                  Next steps
                </h2>

                <div class="signal-terminal mt-6 max-w-3xl">
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
                      <span
                        class="signal-mono t-dim truncate text-[0.72rem]"
                        aria-hidden="true"
                      >roadmap — {{ slug }}</span>
                      <span class="signal-mono t-dim ml-auto shrink-0 text-[0.68rem]">
                        {{ lab.nextSteps.length }} open
                      </span>
                    </div>

                    <div class="signal-mono px-3.5 py-5 text-[0.76rem] leading-relaxed sm:px-5 sm:text-[0.84rem]">
                      <p
                        class="t-line"
                        aria-hidden="true"
                      >
                        <span class="t-prompt">❯</span> <span class="t-strong">roadmap</span> <span class="t-dim">--lab</span> {{ slug }} <span class="t-dim">--open</span>
                      </p>
                      <ol
                        class="mt-4 space-y-3"
                        :aria-label="`${lab.title} next steps`"
                      >
                        <li
                          v-for="(step, index) in lab.nextSteps"
                          :key="step"
                          class="t-line grid grid-cols-[1.5rem_minmax(0,1fr)] items-baseline gap-x-2 sm:grid-cols-[1.5rem_2rem_minmax(0,1fr)]"
                          :style="{ animationDelay: `${0.1 + index * 0.1}s` }"
                        >
                          <span
                            class="t-verify hidden sm:inline"
                            aria-hidden="true"
                          >○</span>
                          <span
                            class="t-dim"
                            aria-hidden="true"
                          >{{ String(index + 1).padStart(2, '0') }}</span>
                          <span class="text-pretty">{{ step }}</span>
                        </li>
                      </ol>
                      <p
                        class="t-line mt-5"
                        aria-hidden="true"
                      >
                        <span class="t-prompt">❯</span> <span class="signal-cursor" />
                      </p>
                    </div>
                  </div>
                </div>

                <aside
                  v-if="lab.note"
                  aria-label="Note"
                  class="signal-note mt-6 max-w-3xl"
                >
                  <UIcon
                    name="i-lucide-info"
                    class="mt-0.5 size-4 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  <p class="text-[0.95rem] leading-relaxed text-toned">
                    <span class="mr-2 font-mono text-[0.7rem] tracking-[0.1em] text-muted uppercase">Note</span>{{ lab.note }}
                  </p>
                </aside>
              </div>
            </section>
          </Motion>
        </ol>
      </div>
    </article>

    <!-- Related labs -->
    <section
      v-if="related.length"
      aria-labelledby="signal-related-labs"
      class="mx-auto max-w-6xl border-t border-default px-5 py-16 sm:px-8 sm:py-20"
    >
      <DesignsSignalSectionHeader
        index="~/"
        eyebrow="Labs"
        heading-id="signal-related-labs"
        title="More from the lab"
        :link="{ label: 'All labs', to: '/labs' }"
      />

      <ul
        class="mt-10 grid gap-5 md:grid-cols-2"
        aria-label="Related lab projects"
      >
        <Motion
          v-for="(entry, index) in related"
          :key="entry.title"
          as="li"
          v-bind="reveal"
          :transition="{ delay: index * 0.08 }"
        >
          <DesignsSignalLabCard :lab="entry" />
        </Motion>
      </ul>
    </section>
  </div>
</template>
