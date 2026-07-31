import type { CalendarEvent } from '../../datastore/types'
import {
  UNCATEGORIZED_ID,
  type CategorizedEvents,
  type Category,
  type CategoryDefinition,
} from '../../lib/categories'

/** Minimum absolute score to assign a category. */
const MIN_SCORE = 10

/** Winner must beat runner-up by this much (or leave uncategorized). */
const MIN_MARGIN = 4

/** Soft cap so one field cannot dominate with dozens of weak hits. */
const FIELD_SCORE_CAP = 48

const NOISE_PREFIX =
  /^(canceled|cancelled|rescheduled|updated|moved|fwd?|fw|re|invitation|invite):\s*/i

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/** Lowercase, strip accents, drop calendar noise, unify punctuation. */
export function normalizeText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(NOISE_PREFIX, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[_/|]+/g, ' ')
    .replace(/[^\p{L}\p{N}\s#+.-]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function keywordHitScore(haystack: string, keyword: string): number {
  if (!haystack || !keyword) return 0
  const kw = normalizeText(keyword)
  if (!kw) return 0

  if (kw.includes(' ')) {
    if (!haystack.includes(kw)) return 0
    return 10 + kw.length * 2
  }

  const bounded = new RegExp(`\\b${escapeRegex(kw)}\\b`, 'i')
  if (!bounded.test(haystack)) return 0

  if (kw.length <= 3) return 6
  if (kw.length <= 5) return 8 + kw.length
  return 10 + kw.length
}

function fieldScore(
  text: string | undefined,
  keywords: string[],
  weight: number,
): number {
  if (!text) return 0
  const haystack = normalizeText(text)
  if (!haystack) return 0

  const hits: number[] = []
  for (const keyword of keywords) {
    const score = keywordHitScore(haystack, keyword)
    if (score > 0) hits.push(score)
  }

  if (hits.length === 0) return 0

  hits.sort((a, b) => b - a)
  let total = hits[0]
  for (let i = 1; i < hits.length; i += 1) {
    total += hits[i] * Math.max(0.25, 0.7 - i * 0.15)
  }

  return Math.min(FIELD_SCORE_CAP, total * weight)
}

/** Extra travel signal from airport / lodging style locations. */
function travelLocationBonus(location: string | undefined): number {
  if (!location) return 0
  const hay = normalizeText(location)
  if (!hay) return 0

  if (
    /\b(airport|terminal|gate|airbnb|hotel|hostel|motel|resort|vrbo)\b/.test(
      hay,
    )
  ) {
    return 12
  }

  if (/\b[a-z]{3}\s+(airport|terminal|intl|international)\b/.test(hay)) {
    return 14
  }

  return 0
}

function scoreCategory(
  event: CalendarEvent,
  category: CategoryDefinition,
): number {
  let score =
    fieldScore(event.summary, category.keywords, 4) +
    fieldScore(event.location, category.keywords, 2.5) +
    fieldScore(event.description, category.keywords, 1)

  if (category.id === 'travel') {
    score += travelLocationBonus(event.location)
  }

  return score
}

export type CategorySuggestion = {
  category: Category
  score: number
  margin: number
}

function scoredCategories(definitions: CategoryDefinition[]): CategoryDefinition[] {
  return definitions.filter((c) => c.id !== UNCATEGORIZED_ID)
}

export function bestMatchScore(
  event: CalendarEvent,
  definitions: CategoryDefinition[],
): number {
  let best = 0
  for (const category of scoredCategories(definitions)) {
    best = Math.max(best, scoreCategory(event, category))
  }
  return best
}

export function rankCategories(
  event: CalendarEvent,
  definitions: CategoryDefinition[],
): Array<{ category: Category; score: number }> {
  return scoredCategories(definitions)
    .map((category) => ({
      category: category.id,
      score: scoreCategory(event, category),
    }))
    .sort((a, b) => b.score - a.score)
}

export function suggestCategoryDetailed(
  event: CalendarEvent,
  definitions: CategoryDefinition[],
): CategorySuggestion {
  const ranked = rankCategories(event, definitions)
  const best = ranked[0]
  const second = ranked[1]

  if (!best) {
    return { category: UNCATEGORIZED_ID, score: 0, margin: 0 }
  }

  const margin = best.score - (second?.score ?? 0)

  if (best.score < MIN_SCORE || margin < MIN_MARGIN) {
    return { category: UNCATEGORIZED_ID, score: best.score, margin }
  }

  return { category: best.category, score: best.score, margin }
}

export function suggestCategory(
  event: CalendarEvent,
  definitions: CategoryDefinition[],
): Category {
  return suggestCategoryDetailed(event, definitions).category
}

export function emptyCategorizedEvents(
  definitions: CategoryDefinition[],
): CategorizedEvents {
  const next: CategorizedEvents = {}
  for (const category of definitions) {
    next[category.id] = []
  }
  if (!next[UNCATEGORIZED_ID]) next[UNCATEGORIZED_ID] = []
  return next
}

export function countEvents(categorized: CategorizedEvents): number {
  return Object.values(categorized).reduce((sum, list) => sum + list.length, 0)
}

export function categorizeEvents(
  events: CalendarEvent[],
  definitions: CategoryDefinition[],
): CategorizedEvents {
  const categorized = emptyCategorizedEvents(definitions)

  events.forEach((event) => {
    const category = suggestCategory(event, definitions)
    const bucket = categorized[category] ? category : UNCATEGORIZED_ID
    categorized[bucket].push({ ...event, category: bucket })
  })

  return categorized
}

/** Keep existing assignments when category ids change; drop unknowns into uncategorized. */
export function reshapeCategorizedEvents(
  categorized: CategorizedEvents,
  definitions: CategoryDefinition[],
): CategorizedEvents {
  const next = emptyCategorizedEvents(definitions)
  const valid = new Set(definitions.map((c) => c.id))

  Object.entries(categorized).forEach(([category, events]) => {
    events.forEach((event) => {
      const target =
        category && valid.has(category) ? category : UNCATEGORIZED_ID
      next[target].push({ ...event, category: target })
    })
  })

  return next
}

export function moveEvent(
  categorized: CategorizedEvents,
  eventId: string,
  toCategory: Category,
  definitions: CategoryDefinition[],
): CategorizedEvents {
  const next = emptyCategorizedEvents(definitions)
  let moved: CalendarEvent | null = null

  Object.keys(categorized).forEach((category) => {
    categorized[category].forEach((event) => {
      if (event.id === eventId) {
        moved = { ...event, category: toCategory }
      } else if (next[category]) {
        next[category].push(event)
      } else {
        next[UNCATEGORIZED_ID].push({ ...event, category: UNCATEGORIZED_ID })
      }
    })
  })

  const dest = next[toCategory] ? toCategory : UNCATEGORIZED_ID
  if (moved !== null) {
    const event = moved as CalendarEvent
    next[dest].push({ ...event, category: dest })
  }
  return next
}

export function deleteEvent(
  categorized: CategorizedEvents,
  eventId: string,
  definitions: CategoryDefinition[],
): CategorizedEvents {
  const next = emptyCategorizedEvents(definitions)
  Object.keys(categorized).forEach((category) => {
    if (!next[category]) return
    next[category] = categorized[category].filter((event) => event.id !== eventId)
  })
  return next
}
