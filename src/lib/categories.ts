import { CATEGORIES_KEYWORDS } from '../components/categorizer/config'

export const UNCATEGORIZED_ID = 'uncategorized'

export type CategoryDefinition = {
  id: string
  label: string
  color: string
  keywords: string[]
  /** Built-in defaults cannot be deleted. */
  builtin: boolean
}

export type Category = string

export type CategorizedEvents = Record<
  string,
  import('../datastore/types').CalendarEvent[]
>

const STORAGE_KEY = 'yearify.categories.v1'

const BUILTIN_COLORS: Record<string, string> = {
  travel: '#FFDDC1',
  fitness: '#C1FFDD',
  social: '#C1DFFF',
  personal: '#DAB1DA',
  uncategorized: '#D3D3D3',
}

const BUILTIN_LABELS: Record<string, string> = {
  travel: 'Travel',
  fitness: 'Fitness',
  social: 'Social',
  personal: 'Personal',
  uncategorized: 'Uncategorized',
}

type StoredCategory = {
  id: string
  label: string
  color: string
  keywords: string[]
  builtin?: boolean
}

type StoredCategories = {
  version: 1
  categories: StoredCategory[]
}

/** Soft pastel hex in the same family as the built-in swatches. */
export function randomPastelColor(): string {
  const hue = Math.floor(Math.random() * 360)
  const saturation = 0.45 + Math.random() * 0.25
  const lightness = 0.78 + Math.random() * 0.1
  return hslToHex(hue, saturation, lightness)
}

function hslToHex(h: number, s: number, l: number): string {
  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - c / 2
  let r = 0
  let g = 0
  let b = 0

  if (h < 60) {
    r = c
    g = x
  } else if (h < 120) {
    r = x
    g = c
  } else if (h < 180) {
    g = c
    b = x
  } else if (h < 240) {
    g = x
    b = c
  } else if (h < 300) {
    r = x
    b = c
  } else {
    r = c
    b = x
  }

  const toHex = (n: number) =>
    Math.round((n + m) * 255)
      .toString(16)
      .padStart(2, '0')

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase()
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function normalizeStored(raw: StoredCategory): CategoryDefinition | null {
  if (!raw || typeof raw.id !== 'string' || !raw.id.trim()) return null

  const keywords = Array.isArray(raw.keywords)
    ? raw.keywords
        .filter((k): k is string => typeof k === 'string')
        .map((k) => k.trim())
        .filter(Boolean)
    : []

  return {
    id: raw.id.trim(),
    label:
      typeof raw.label === 'string' && raw.label.trim()
        ? raw.label.trim()
        : capitalize(raw.id),
    color:
      typeof raw.color === 'string' && /^#[0-9A-Fa-f]{6}$/.test(raw.color)
        ? raw.color.toUpperCase()
        : randomPastelColor(),
    keywords,
    builtin: Boolean(raw.builtin),
  }
}

export function createDefaultCategories(): CategoryDefinition[] {
  const actionIds = Object.keys(CATEGORIES_KEYWORDS) as Array<
    keyof typeof CATEGORIES_KEYWORDS
  >

  const action = actionIds.map((id) => ({
    id,
    label: BUILTIN_LABELS[id] ?? capitalize(id),
    color: BUILTIN_COLORS[id] ?? randomPastelColor(),
    keywords: [...CATEGORIES_KEYWORDS[id]],
    builtin: true,
  }))

  return [
    ...action,
    {
      id: UNCATEGORIZED_ID,
      label: BUILTIN_LABELS[UNCATEGORIZED_ID],
      color: BUILTIN_COLORS[UNCATEGORIZED_ID],
      keywords: [],
      builtin: true,
    },
  ]
}

export function slugifyCategoryId(label: string, existingIds: string[]): string {
  const base =
    label
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'category'

  const safeBase = base === UNCATEGORIZED_ID ? 'custom' : base
  return uniqueId(safeBase, existingIds)
}

function uniqueId(base: string, existingIds: string[]): string {
  if (!existingIds.includes(base)) return base
  let n = 2
  while (existingIds.includes(`${base}-${n}`)) n += 1
  return `${base}-${n}`
}

export function actionCategories(
  categories: CategoryDefinition[],
): CategoryDefinition[] {
  return categories.filter((category) => category.id !== UNCATEGORIZED_ID)
}

export function categoryColorMap(
  categories: CategoryDefinition[],
): Record<string, string> {
  return Object.fromEntries(categories.map((c) => [c.id, c.color]))
}

export function categoryIds(categories: CategoryDefinition[]): string[] {
  return categories.map((c) => c.id)
}

export function loadCategories(): CategoryDefinition[] {
  const defaults = createDefaultCategories()

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaults

    const parsed = JSON.parse(raw) as StoredCategories
    if (!parsed || parsed.version !== 1 || !Array.isArray(parsed.categories)) {
      return defaults
    }

    const stored = parsed.categories
      .map(normalizeStored)
      .filter((c): c is CategoryDefinition => c !== null)

    const storedById = new Map(stored.map((c) => [c.id, c]))

    const builtins = defaults.map((def) => {
      const override = storedById.get(def.id)
      storedById.delete(def.id)
      if (!override) return def
      return {
        ...def,
        label: override.label || def.label,
        color: override.color || def.color,
        keywords: override.keywords,
        builtin: true,
      }
    })

    const custom = Array.from(storedById.values())
      .filter((c) => c.id !== UNCATEGORIZED_ID)
      .map((c) => ({ ...c, builtin: false }))

    const uncategorized =
      builtins.find((c) => c.id === UNCATEGORIZED_ID) ??
      defaults.find((c) => c.id === UNCATEGORIZED_ID)!

    return [
      ...builtins.filter((c) => c.id !== UNCATEGORIZED_ID),
      ...custom,
      uncategorized,
    ]
  } catch {
    return defaults
  }
}

export function saveCategories(categories: CategoryDefinition[]): void {
  const payload: StoredCategories = {
    version: 1,
    categories: categories.map((c) => ({
      id: c.id,
      label: c.label,
      color: c.color,
      keywords: c.keywords,
      builtin: c.builtin,
    })),
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
}

export function clearStoredCategories(): void {
  localStorage.removeItem(STORAGE_KEY)
}
