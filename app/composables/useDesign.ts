export const useDesign = () => {
  const design = useState<DesignId>('design', () => 'classic')
  const nuxtApp = useNuxtApp()

  const applyDesign = (id: DesignId) => {
    design.value = id

    if (import.meta.client) {
      document.documentElement.setAttribute('data-design', id)

      try {
        localStorage.setItem(DESIGN_STORAGE_KEY, id)
      } catch {
        // Storage can be unavailable (private mode); the switch still works for this visit.
      }
    }
  }

  // Swapping the shell remounts <NuxtPage>, which suspends while the page
  // re-runs its async setup. Resolve once it has rendered again.
  const waitForPage = () => new Promise<void>((resolve) => {
    const done = () => {
      unhook()
      clearTimeout(fallback)
      resolve()
    }
    const fallback = setTimeout(done, 1500)
    const unhook = nuxtApp.hook('page:finish', done)
  })

  const setDesign = async (id: DesignId) => {
    if (id === design.value) return

    if (import.meta.client && document.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.startViewTransition(async () => {
        const rendered = waitForPage()
        applyDesign(id)
        await rendered
      })
      return
    }

    applyDesign(id)
  }

  return {
    design: readonly(design),
    setDesign,
    applyDesign
  }
}
