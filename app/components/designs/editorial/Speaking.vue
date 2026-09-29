<script setup lang="ts">
import type { SpeakingCollectionItem, TalksCollectionItem } from '@nuxt/content'

const props = defineProps<{
  page: SpeakingCollectionItem
  talks: TalksCollectionItem[]
}>()

const formats = computed(() => [...new Set(props.talks.map(talk => talk.format ?? 'Talk'))])
</script>

<template>
  <div class="ed-page">
    <UContainer>
      <header class="pt-12 sm:pt-16 lg:pt-20">
        <p class="ed-kicker ed-enter-rise-sm">
          <span class="text-primary">Programme</span>
          <span aria-hidden="true"> · </span>{{ talks.length }} sessions
          <span aria-hidden="true"> · </span>{{ formats.join(', ') }}
        </p>
        <div class="mt-6 grid grid-cols-12 gap-x-6 gap-y-8 lg:gap-y-10">
          <h1 class="ed-page-title ed-enter-rise ed-delay-1 col-span-12 -ml-[0.04em]">
            {{ page.title }}<span
              class="text-primary"
              aria-hidden="true"
            >.</span>
          </h1>
          <div class="ed-enter-rise-sm ed-delay-2 col-span-12 lg:col-span-6 lg:col-start-7">
            <p class="ed-serif text-[1.75rem] leading-[1.2] text-toned italic sm:text-[2rem]">
              {{ page.description }}
            </p>
            <nav
              v-if="page.links?.length"
              aria-label="Speaking links"
              class="mt-6"
            >
              <ul class="flex list-none flex-wrap gap-x-6 gap-y-2 p-0">
                <li
                  v-for="link in page.links"
                  :key="`${link.label}-${link.to}`"
                >
                  <NuxtLink
                    :to="link.to"
                    :external="link.to?.startsWith('mailto:')"
                    :target="link.target"
                    class="ed-link text-[0.9375rem]"
                  >
                    {{ link.label }}<span
                      class="ed-link-arrow ed-link-arrow-right ml-1.5"
                      aria-hidden="true"
                    >→</span>
                  </NuxtLink>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        <div
          class="ed-rule ed-enter-draw ed-delay-2 mt-12 sm:mt-16"
          aria-hidden="true"
        />
      </header>

      <ul
        class="mt-6 list-none p-0"
        aria-label="Talks and speaking engagements"
      >
        <Motion
          v-for="(talk, index) in talks"
          :key="`${talk.title}-${talk.event}`"
          as="li"
          :class="index === 0 ? '[&>article]:border-t-0' : ''"
          :initial="{ transform: 'translateY(20px)' }"
          :while-in-view="{ transform: 'translateY(0)' }"
          :transition="{ delay: index * 0.06 }"
          :in-view-options="{ once: true }"
        >
          <DesignsEditorialTalkRow
            :talk="talk"
            variant="spread"
            heading-level="h2"
          />
        </Motion>
      </ul>

      <section
        v-if="page.invite"
        aria-labelledby="ed-invite"
        class="mt-16 grid grid-cols-12 gap-x-6 gap-y-6 border-t border-(--ed-rule) pt-10 sm:mt-24 sm:pt-14"
      >
        <p class="ed-kicker col-span-12 lg:col-span-2">
          <span class="text-primary">Invitations</span>
        </p>
        <h2
          id="ed-invite"
          class="ed-section-title col-span-12 lg:col-span-6"
        >
          {{ page.invite.title }}
        </h2>
        <div class="col-span-12 flex flex-col gap-6 lg:col-span-4 lg:pt-3">
          <p class="text-base leading-7 text-toned">
            {{ page.invite.description }}
          </p>
          <p v-if="page.invite.link?.to">
            <NuxtLink
              :to="page.invite.link.to"
              :external="page.invite.link.to.startsWith('mailto:')"
              class="ed-serif ed-link text-3xl italic"
            >
              {{ page.invite.link.label }}<span
                class="ed-link-arrow ed-link-arrow-right ml-2"
                aria-hidden="true"
              >→</span>
            </NuxtLink>
          </p>
        </div>
      </section>
    </UContainer>
  </div>
</template>
