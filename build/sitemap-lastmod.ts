import { promises as fs } from 'node:fs'
import { resolve } from 'node:path'

type ContentDateMap = Map<string, string>

const readDates = async (rootDir: string, dir: string, urlPrefix: string): Promise<ContentDateMap> => {
  const map: ContentDateMap = new Map()
  const yaml = await import('yaml')
  const baseDir = resolve(rootDir, dir)

  let files: string[]
  try {
    files = await fs.readdir(baseDir)
  } catch {
    return map
  }

  for (const file of files) {
    if (!file.endsWith('.yml') && !file.endsWith('.yaml')) continue
    const slug = file.replace(/\.ya?ml$/, '')
    const raw = await fs.readFile(resolve(baseDir, file), 'utf8')
    const parsed = yaml.parse(raw) as { date?: unknown }
    if (!parsed?.date) continue
    const date = new Date(String(parsed.date))
    if (Number.isNaN(date.getTime())) continue
    map.set(`${urlPrefix}/${slug}`, date.toISOString())
  }

  return map
}

export const collectContentLastmod = async (rootDir: string): Promise<ContentDateMap> => {
  const merged: ContentDateMap = new Map()

  for (const [dir, prefix] of [['content/labs', '/labs'], ['content/speaking', '/speaking']] as const) {
    const partial = await readDates(rootDir, dir, prefix)
    for (const [key, value] of partial) merged.set(key, value)
  }

  return merged
}
