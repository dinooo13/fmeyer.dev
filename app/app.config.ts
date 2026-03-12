export default defineAppConfig({
  global: {
    picture: {
      dark: 'https://avatars.githubusercontent.com/u/44942030?v=4',
      light: 'https://avatars.githubusercontent.com/u/44942030?v=4',
      alt: 'Fabian Meyer'
    },
    meetingLink: '',
    email: 'hello@fmeyer.dev',
    available: false
  },
  ui: {
    colors: {
      primary: 'blue',
      neutral: 'neutral'
    },
    pageHero: {
      slots: {
        container: 'py-18 sm:py-24 lg:py-32',
        title: 'mx-auto max-w-xl text-pretty text-3xl sm:text-4xl lg:text-5xl',
        description: 'mt-2 text-md mx-auto max-w-2xl text-pretty sm:text-md text-muted'
      }
    }
  },
  footer: {
    credits: `fmeyer.dev • © ${new Date().getFullYear()}`,
    colorMode: false,
    links: [{
      'icon': 'i-simple-icons-github',
      'to': 'https://github.com/dinooo13',
      'target': '_blank',
      'aria-label': 'Fabian Meyer on GitHub'
    }, {
      'icon': 'i-simple-icons-linkedin',
      'to': 'https://linkedin.com/in/fabian-meyer-02038813a',
      'target': '_blank',
      'aria-label': 'Fabian Meyer on LinkedIn'
    }, {
      'icon': 'i-lucide-mail',
      'to': 'mailto:hello@fmeyer.dev',
      'aria-label': 'Email Fabian Meyer'
    }]
  }
})
