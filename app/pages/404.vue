<script setup lang="ts">
definePageMeta({
  name: '404'
})

useSeoMeta({
  title: 'Page not found',
  description: 'The page you are looking for does not exist.',
  ogTitle: 'Page not found',
  ogDescription: 'The page you are looking for does not exist.',
  robots: 'noindex, nofollow'
})

defineOgImage({ component: 'Default' })
</script>

<template>
  <UPage>
    <UPageHero
      title="Page not found"
      description="The page you are looking for does not exist or has been moved."
      :ui="{
        title: '!mx-0 max-w-3xl text-left text-3xl font-bold tracking-tight text-highlighted sm:text-4xl lg:text-5xl',
        description: '!mx-0 max-w-2xl text-left',
        links: 'justify-start'
      }"
    >
      <template #links>
        <nav aria-label="Suggested destinations">
          <ul class="flex flex-wrap items-center gap-3 list-none p-0">
            <li>
              <UButton
                to="/"
                icon="i-lucide-home"
                color="neutral"
                label="Back to home"
              />
            </li>
            <li>
              <UButton
                to="/labs"
                icon="i-lucide-folder"
                color="neutral"
                variant="outline"
                label="Browse labs"
              />
            </li>
            <li>
              <UButton
                to="/speaking"
                icon="i-lucide-mic"
                color="neutral"
                variant="outline"
                label="See speaking"
              />
            </li>
          </ul>
        </nav>
      </template>
    </UPageHero>
  </UPage>
</template>
