export const useDesign = () => {
  const design = useState<DesignId>('design', () => 'classic')

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

  const setDesign = (id: DesignId) => {
    if (id === design.value) return

    if (import.meta.client && document.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.startViewTransition(async () => {
        applyDesign(id)
        await nextTick()
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
