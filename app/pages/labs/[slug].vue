<script setup lang="ts">
import { formatLabDate, labStatusIconMap, labStatusMap } from '../../utils/labs'
const route = useRoute()
const slug = Array.isArray(route.params.slug) ? route.params.slug[0] : route.params.slug

const { data: lab } = await useAsyncData(`lab-${slug}`, () => {
  return queryCollection('labs').where('stem', '=', `labs/${slug}`).first()
})

if (!lab.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Lab not found',
    fatal: true
  })
}

usePageSeo(lab.value)

defineOgImage()

const formattedDate = computed(() => formatLabDate(lab.value!.date))
const hasImage = computed(() => Boolean(lab.value?.image))
</script>

<template>
  <UPage v-if="lab">
    <UPageHero
      :ui="{
        title: '!mx-0 max-w-3xl text-left',
        description: '!mx-0 max-w-2xl text-left',
        links: 'justify-start'
      }"
    >
      <template #title>
        <div class="max-w-3xl text-left">
          <h1 class="text-3xl font-bold tracking-tight text-highlighted sm:text-4xl lg:text-5xl">
            {{ lab.title }}
          </h1>
        </div>
      </template>

      <template #description>
        <div class="max-w-2xl text-left">
          <p class="text-sm text-muted sm:text-base">
            {{ lab.description }}
          </p>
        </div>
      </template>

      <template #links>
        <div class="flex flex-wrap items-center gap-3">
          <UButton
            to="/labs"
            color="neutral"
            variant="outline"
            icon="i-lucide-arrow-left"
            label="Back to Labs"
          />
          <UButton
            v-if="lab.url"
            :to="lab.url"
            target="_blank"
            color="neutral"
            icon="i-lucide-external-link"
            label="Open demo"
          />
          <UButton
            v-if="lab.repoUrl"
            :to="lab.repoUrl"
            target="_blank"
            color="neutral"
            icon="i-simple-icons-github"
            label="View repository"
          />
        </div>
      </template>

      <template #default>
        <div
          :class="[
            'mt-8 grid gap-6',
            hasImage ? 'lg:grid-cols-[minmax(0,1fr)_20rem]' : 'lg:grid-cols-[20rem]'
          ]"
        >
          <UCard
            v-if="hasImage"
            class="overflow-hidden border border-default"
            :ui="{
              body: 'p-0'
            }"
          >
            <NuxtImg
              :src="lab.image"
              :alt="`${lab.title} project preview`"
              class="h-full w-full object-cover"
              loading="lazy"
            />
          </UCard>

          <UCard
            class="border border-default"
            :ui="{
              body: 'p-6'
            }"
          >
            <div class="space-y-5 text-sm text-muted">
              <div>
                <p class="font-medium text-highlighted">
                  Status
                </p>
                <div class="mt-2">
                  <UBadge
                    :label="labStatusMap[lab.status].label"
                    :icon="labStatusIconMap[lab.status]"
                    :color="labStatusMap[lab.status].color"
                    variant="soft"
                  />
                </div>
              </div>

              <div>
                <p class="font-medium text-highlighted">
                  Date
                </p>
                <p class="mt-2">
                  {{ formattedDate }}
                </p>
              </div>

              <div>
                <p class="font-medium text-highlighted">
                  Tags
                </p>
                <div class="mt-2 flex flex-wrap gap-2">
                  <UBadge
                    v-for="tag in lab.tags"
                    :key="tag"
                    :label="tag"
                    color="neutral"
                    variant="outline"
                  />
                </div>
              </div>
            </div>
          </UCard>
        </div>
      </template>
    </UPageHero>

    <UPageSection
      :ui="{
        container: '!pt-0'
      }"
    >
      <div class="grid gap-4 lg:grid-cols-3">
        <UCard
          class="border border-default"
          :ui="{
            body: 'p-6 sm:p-8'
          }"
        >
          <div class="space-y-3">
            <h2 class="text-lg font-semibold text-highlighted">
              Overview
            </h2>
            <p class="text-sm leading-7 text-muted">
              {{ lab.description }}
            </p>
          </div>
        </UCard>

        <UCard
          class="border border-default"
          :ui="{
            body: 'p-6 sm:p-8'
          }"
        >
          <div class="space-y-3">
            <h2 class="text-lg font-semibold text-highlighted">
              Challenge
            </h2>
            <p class="text-sm leading-7 text-muted">
              {{ lab.challenge }}
            </p>
          </div>
        </UCard>

        <UCard
          class="border border-default"
          :ui="{
            body: 'p-6 sm:p-8'
          }"
        >
          <div class="space-y-3">
            <h2 class="text-lg font-semibold text-highlighted">
              Approach
            </h2>
            <p class="text-sm leading-7 text-muted">
              {{ lab.approach }}
            </p>
          </div>
        </UCard>
      </div>
    </UPageSection>

    <UPageSection
      :ui="{
        container: '!pt-0'
      }"
    >
      <div class="grid gap-4 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <UCard
          class="border border-default"
          :ui="{
            body: 'p-6 sm:p-8'
          }"
        >
          <div class="space-y-4">
            <h2 class="text-lg font-semibold text-highlighted">
              Next steps
            </h2>
            <ul class="space-y-3 text-sm leading-7 text-muted">
              <li
                v-for="step in lab.nextSteps"
                :key="step"
                class="flex gap-3"
              >
                <span class="mt-2 size-1.5 shrink-0 rounded-full bg-default" />
                <span>{{ step }}</span>
              </li>
            </ul>
          </div>
        </UCard>

        <UCard
          v-if="lab.note"
          class="border border-default"
          :ui="{
            body: 'p-6 sm:p-8'
          }"
        >
          <div class="space-y-3">
            <h2 class="text-lg font-semibold text-highlighted">
              Note
            </h2>
            <p class="text-sm leading-7 text-muted">
              {{ lab.note }}
            </p>
          </div>
        </UCard>
      </div>
    </UPageSection>
  </UPage>
</template>
