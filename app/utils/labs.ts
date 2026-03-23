export type LabStatus = 'wip' | 'prototype' | 'paused'

export type LabEntry = {
  id?: string
  stem?: string
  title: string
  description: string
  challenge: string
  approach: string
  nextSteps: string[]
  image?: string
  icon?: string
  status: LabStatus
  url?: string
  repoUrl?: string
  tags: string[]
  date: string | Date
  note?: string
}

export const labStatusMap: Record<LabStatus, { label: string, color: 'warning' | 'info' | 'neutral' }> = {
  wip: {
    label: 'WIP',
    color: 'warning'
  },
  prototype: {
    label: 'Prototype',
    color: 'info'
  },
  paused: {
    label: 'Paused',
    color: 'neutral'
  }
}

export const labStatusIconMap: Record<LabStatus, string> = {
  wip: 'i-lucide-sparkles',
  prototype: 'i-lucide-flask-conical',
  paused: 'i-lucide-pause'
}

const getTimestamp = (value: string | Date) => {
  const timestamp = new Date(value).getTime()

  return Number.isNaN(timestamp) ? 0 : timestamp
}

export const sortLabs = <Lab extends LabEntry>(labs: Lab[]) => {
  return labs.slice().sort((left, right) => {
    return getTimestamp(right.date) - getTimestamp(left.date) || left.title.localeCompare(right.title)
  })
}

export const getLabSlug = <Lab extends Pick<LabEntry, 'stem' | 'title'>>(lab: Lab) => {
  const stem = lab.stem?.split('/').filter(Boolean).at(-1)

  if (stem) {
    return stem
  }

  return lab.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export const getLabPath = <Lab extends Pick<LabEntry, 'stem' | 'title'>>(lab: Lab) => {
  return `/labs/${getLabSlug(lab)}`
}

export const formatLabDate = (value: string | Date) => {
  return new Intl.DateTimeFormat('en', {
    dateStyle: 'long'
  }).format(new Date(value))
}
