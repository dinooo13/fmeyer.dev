import type { NavigationMenuItem } from '@nuxt/ui'

export const navLinks: NavigationMenuItem[] = [{
  label: 'Home',
  icon: 'i-lucide-home',
  to: '/'
}, {
  label: 'Labs',
  icon: 'i-lucide-folder',
  to: '/labs'
}, {
  label: 'Speaking',
  icon: 'i-lucide-mic',
  to: '/speaking'
}]
