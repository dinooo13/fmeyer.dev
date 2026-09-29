<script setup lang="ts">
const { design, setDesign } = useDesign()
</script>

<template>
  <ClientOnly>
    <div class="fixed inset-x-0 bottom-3 z-50 flex justify-center px-3 sm:bottom-5 print:hidden">
      <div
        role="group"
        aria-label="Site design preview"
        class="flex items-center gap-1 rounded-full border border-white/10 bg-neutral-950/85 p-1 text-xs text-white shadow-2xl shadow-neutral-950/30 backdrop-blur-md"
      >
        <span
          class="hidden px-2.5 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-white/50 sm:inline"
          aria-hidden="true"
        >Design</span>
        <button
          v-for="option in designOptions"
          :key="option.id"
          type="button"
          :aria-pressed="design === option.id"
          :title="option.description"
          class="cursor-pointer rounded-full px-3 py-1.5 font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          :class="design === option.id ? 'bg-white text-neutral-950' : 'text-white/70 hover:bg-white/10 hover:text-white'"
          @click="setDesign(option.id)"
        >
          {{ option.label }}
        </button>
      </div>
    </div>
  </ClientOnly>
</template>
