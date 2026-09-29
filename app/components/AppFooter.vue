<script setup lang="ts">
const { footer, global } = useAppConfig()
</script>

<template>
  <footer
    role="contentinfo"
    class="relative pb-10 sm:pb-12"
  >
    <!-- Contact call to action -->
    <div class="mx-auto max-w-6xl px-5 pt-10 pb-14 sm:px-8 sm:pt-16 sm:pb-20">
      <div class="signal-card signal-cta relative overflow-hidden p-7 sm:p-10 lg:p-12">
        <div
          class="signal-cta-glow pointer-events-none absolute inset-0"
          aria-hidden="true"
        />
        <div class="relative flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div class="max-w-xl">
            <p class="text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">
              <span class="signal-gradient-text">Let's talk.</span>
            </p>
            <p class="mt-3 text-base leading-relaxed text-pretty text-muted">
              Want to discuss a talk, a workshop, or an internal session? Email is the best starting point.
            </p>
          </div>

          <div class="flex flex-col items-start gap-4 md:items-end">
            <UButton
              :to="`mailto:${global.email}`"
              icon="i-lucide-mail"
              trailing-icon="i-lucide-arrow-right"
              :label="global.email"
              color="primary"
              size="xl"
              class="rounded-full px-6"
            />
            <nav aria-label="Profiles">
              <ul class="flex items-center gap-2">
                <li
                  v-for="link of footer?.links.filter(link => !String(link.to).startsWith('mailto:'))"
                  :key="link['aria-label'] || link.to"
                >
                  <UButton
                    v-bind="{ size: 'md', color: 'neutral', variant: 'outline', ...link }"
                    class="rounded-full bg-(--signal-glass) backdrop-blur"
                  />
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <div class="mx-auto flex max-w-6xl items-center justify-between gap-4 border-t border-default px-5 pt-8 sm:px-8">
      <div class="flex items-center gap-3">
        <span
          class="signal-monogram"
          aria-hidden="true"
        >FM</span>
        <p class="text-sm font-semibold text-highlighted">
          {{ global.picture.alt }}
        </p>
      </div>
      <p class="font-mono text-xs text-muted">
        {{ footer.credits }}
      </p>
    </div>
  </footer>
</template>
