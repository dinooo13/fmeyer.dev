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

export const sortLabs = <Lab extends LabEntry>(labs: Lab[]) => {
  return labs.slice().sort((left, right) => {
    return (getTimestamp(right.date) ?? 0) - (getTimestamp(left.date) ?? 0) || left.title.localeCompare(right.title)
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

const labStatusToCreativeWorkStatus: Record<LabStatus, string> = {
  wip: 'WorkInProgress',
  prototype: 'Prototype',
  paused: 'OnHold'
}

const toIsoDate = (value: string | Date | undefined) => {
  if (!value) return null

  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? null : date.toISOString()
}

export const buildLabCreativeWorkSchema = (lab: LabEntry, canonicalUrl: string, authorId: string) => {
  const dateCreated = toIsoDate(lab.date)
  const type = lab.repoUrl ? 'SoftwareSourceCode' : 'CreativeWork'

  const schema: Record<string, unknown> = {
    '@type': type,
    'name': lab.title,
    'headline': lab.title,
    'description': lab.description,
    'url': canonicalUrl,
    'author': { '@id': authorId },
    'creator': { '@id': authorId },
    'creativeWorkStatus': labStatusToCreativeWorkStatus[lab.status],
    'keywords': lab.tags.length ? lab.tags.join(', ') : undefined
  }

  if (dateCreated) schema.dateCreated = dateCreated
  if (dateCreated) schema.datePublished = dateCreated
  if (lab.repoUrl) schema.codeRepository = lab.repoUrl
  if (lab.url) schema.sameAs = lab.url
  if (lab.image) schema.image = lab.image

  return Object.fromEntries(Object.entries(schema).filter(([, value]) => value !== undefined))
}
