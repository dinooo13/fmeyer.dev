import { promises as fs } from 'node:fs'
import { resolve } from 'node:path'

type YamlRecord = Record<string, unknown>

type LabEntry = YamlRecord & {
  slug: string
  title: string
  description: string
  date?: string
  status?: string
  tags?: string[]
  url?: string
  repoUrl?: string
  challenge?: string
  approach?: string
  nextSteps?: string[]
  note?: string
}

type TalkEntry = YamlRecord & {
  slug: string
  title: string
  summary: string
  description: string
  event: string
  location: string
  date?: string
  dateLabel?: string
  language?: string
  url?: string
}

const readYamlDir = async <T extends YamlRecord>(dir: string, parser: { parse: (s: string) => unknown }): Promise<Array<T & { slug: string }>> => {
  let files: string[]
  try {
    files = await fs.readdir(dir)
  } catch {
    return []
  }

  const entries = await Promise.all(
    files
      .filter(file => file.endsWith('.yml') || file.endsWith('.yaml'))
      .map(async (file) => {
        const raw = await fs.readFile(resolve(dir, file), 'utf8')
        const parsed = parser.parse(raw) as T
        const slug = file.replace(/\.ya?ml$/, '')
        return { ...parsed, slug }
      })
  )

  return entries
}

const formatDate = (value: unknown): string | null => {
  if (!value) return null
  const date = value instanceof Date ? value : new Date(String(value))
  if (Number.isNaN(date.getTime())) return null
  return date.toISOString()
}

const sortByDateDesc = <T extends { date?: unknown }>(items: T[]) => {
  return items.slice().sort((left, right) => {
    const leftTs = left.date ? new Date(String(left.date)).getTime() : 0
    const rightTs = right.date ? new Date(String(right.date)).getTime() : 0
    return rightTs - leftTs
  })
}

const escapeXml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

const collapseWhitespace = (value: string | undefined) =>
  (value ?? '').replace(/\s+/g, ' ').trim()

const renderLlmsTxt = (siteUrl: string, labs: LabEntry[], talks: TalkEntry[], homepage: YamlRecord | null) => {
  const hero = (homepage?.hero ?? {}) as { name?: string, role?: string, intro?: string }
  const lines: string[] = []

  lines.push(`# ${hero.name ?? 'Fabian Meyer'}`)
  lines.push('')
  if (hero.role) lines.push(`> ${hero.role}`)
  if (hero.intro) {
    lines.push('')
    lines.push(collapseWhitespace(hero.intro))
  }
  lines.push('')
  lines.push(`Canonical site: ${siteUrl}/`)
  lines.push('')

  if (labs.length) {
    lines.push('## Labs')
    lines.push('')
    for (const lab of labs) {
      lines.push(`- [${lab.title}](${siteUrl}/labs/${lab.slug}): ${collapseWhitespace(lab.description)}`)
    }
    lines.push('')
  }

  if (talks.length) {
    lines.push('## Speaking')
    lines.push('')
    for (const talk of talks) {
      const meta = [talk.event, talk.location, talk.dateLabel].filter(Boolean).join(' — ')
      lines.push(`- [${talk.title}](${siteUrl}/speaking/${talk.slug}): ${collapseWhitespace(talk.summary)} (${meta})`)
    }
    lines.push('')
  }

  return lines.join('\n')
}

const renderLlmsFullTxt = (siteUrl: string, labs: LabEntry[], talks: TalkEntry[], homepage: YamlRecord | null) => {
  const hero = (homepage?.hero ?? {}) as { name?: string, role?: string, intro?: string }
  const sections: string[] = []

  sections.push(`# ${hero.name ?? 'Fabian Meyer'}`)
  if (hero.role) sections.push(`Role: ${hero.role}`)
  if (hero.intro) sections.push(collapseWhitespace(hero.intro))
  sections.push(`Canonical site: ${siteUrl}/`)

  if (labs.length) {
    sections.push('## Labs')
    for (const lab of labs) {
      const block: string[] = []
      block.push(`### ${lab.title}`)
      block.push(`URL: ${siteUrl}/labs/${lab.slug}`)
      if (lab.status) block.push(`Status: ${lab.status}`)
      if (lab.tags?.length) block.push(`Tags: ${lab.tags.join(', ')}`)
      if (lab.url) block.push(`Demo: ${lab.url}`)
      if (lab.repoUrl) block.push(`Repository: ${lab.repoUrl}`)
      block.push('')
      block.push(collapseWhitespace(lab.description))
      if (lab.challenge) {
        block.push('')
        block.push(`Challenge: ${collapseWhitespace(lab.challenge)}`)
      }
      if (lab.approach) {
        block.push('')
        block.push(`Approach: ${collapseWhitespace(lab.approach)}`)
      }
      if (lab.nextSteps?.length) {
        block.push('')
        block.push('Next steps:')
        for (const step of lab.nextSteps) {
          block.push(`- ${step}`)
        }
      }
      sections.push(block.join('\n'))
    }
  }

  if (talks.length) {
    sections.push('## Speaking')
    for (const talk of talks) {
      const block: string[] = []
      block.push(`### ${talk.title}`)
      block.push(`URL: ${siteUrl}/speaking/${talk.slug}`)
      block.push(`Event: ${talk.event}`)
      block.push(`Location: ${talk.location}`)
      if (talk.dateLabel) block.push(`Date: ${talk.dateLabel}`)
      if (talk.language) block.push(`Language: ${talk.language}`)
      if (talk.url) block.push(`Session: ${talk.url}`)
      block.push('')
      block.push(`Summary: ${collapseWhitespace(talk.summary)}`)
      block.push('')
      block.push(collapseWhitespace(talk.description))
      sections.push(block.join('\n'))
    }
  }

  return sections.join('\n\n')
}

const renderRssXml = (siteUrl: string, labs: LabEntry[], talks: TalkEntry[]) => {
  const items: string[] = []

  const pushItem = (opts: { title: string, link: string, description: string, pubDate?: string | null, category?: string, guid: string }) => {
    items.push([
      '    <item>',
      `      <title>${escapeXml(opts.title)}</title>`,
      `      <link>${escapeXml(opts.link)}</link>`,
      `      <guid isPermaLink="true">${escapeXml(opts.guid)}</guid>`,
      opts.pubDate ? `      <pubDate>${new Date(opts.pubDate).toUTCString()}</pubDate>` : '',
      opts.category ? `      <category>${escapeXml(opts.category)}</category>` : '',
      `      <description>${escapeXml(opts.description)}</description>`,
      '    </item>'
    ].filter(Boolean).join('\n'))
  }

  for (const lab of labs) {
    pushItem({
      title: lab.title,
      link: `${siteUrl}/labs/${lab.slug}`,
      guid: `${siteUrl}/labs/${lab.slug}`,
      pubDate: formatDate(lab.date),
      category: 'Labs',
      description: collapseWhitespace(lab.description)
    })
  }
  for (const talk of talks) {
    pushItem({
      title: talk.title,
      link: `${siteUrl}/speaking/${talk.slug}`,
      guid: `${siteUrl}/speaking/${talk.slug}`,
      pubDate: formatDate(talk.date),
      category: 'Speaking',
      description: collapseWhitespace(talk.summary)
    })
  }

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    '    <title>fmeyer.dev — Labs &amp; Speaking</title>',
    `    <link>${siteUrl}/</link>`,
    `    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />`,
    '    <description>Labs and speaking updates from Fabian Meyer.</description>',
    '    <language>en</language>',
    `    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>`,
    ...items,
    '  </channel>',
    '</rss>',
    ''
  ].join('\n')
}

export const generateContentArtifacts = async (nitro: { options: { rootDir: string, output: { publicDir: string }, runtimeConfig: { public?: { siteUrl?: string } } } }) => {
  const outputDir = nitro.options.output.publicDir

  try {
    await fs.access(outputDir)
  } catch {
    // No prerender output (typecheck, prepare). Skip artifact generation.
    return
  }

  const yaml = await import('yaml')
  const rootDir = nitro.options.rootDir
  const siteUrl = (nitro.options.runtimeConfig.public?.siteUrl ?? 'https://fmeyer.dev').replace(/\/$/, '')

  const labs = sortByDateDesc(
    await readYamlDir<LabEntry>(resolve(rootDir, 'content/labs'), yaml)
  )
  const talks = sortByDateDesc(
    await readYamlDir<TalkEntry>(resolve(rootDir, 'content/speaking'), yaml)
  )

  let homepage: YamlRecord | null = null
  try {
    const raw = await fs.readFile(resolve(rootDir, 'content/index.yml'), 'utf8')
    homepage = yaml.parse(raw) as YamlRecord
  } catch {
    homepage = null
  }

  await fs.writeFile(resolve(outputDir, 'llms.txt'), renderLlmsTxt(siteUrl, labs, talks, homepage))
  await fs.writeFile(resolve(outputDir, 'llms-full.txt'), renderLlmsFullTxt(siteUrl, labs, talks, homepage))
  await fs.writeFile(resolve(outputDir, 'rss.xml'), renderRssXml(siteUrl, labs, talks))
}
