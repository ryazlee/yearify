import type { CalendarEvent, CategorizedEvents, Category } from '../types'
import { CATEGORIES_KEYWORDS } from './config'

export const ACTION_CATEGORIES: ReadonlyArray<Exclude<Category, 'uncategorized'>> = [
  'travel',
  'fitness',
  'social',
  'personal',
]

export type ActionCategory = (typeof ACTION_CATEGORIES)[number]

const SCORED_CATEGORIES = ACTION_CATEGORIES

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
    // Phrases are high-confidence; length rewards specificity.
    return 10 + kw.length * 2
  }

  // Always require word boundaries for single tokens (avoids "run" in "brunch").
  const bounded = new RegExp(`\\b${escapeRegex(kw)}\\b`, 'i')
  if (!bounded.test(haystack)) return 0

  // Short tokens are weaker / more ambiguous.
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

  // Strongest hit full credit; additional distinct hits add diminishing value.
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

  // Common "SFO Airport" / "JFK T4" style locations
  if (/\b[a-z]{3}\s+(airport|terminal|intl|international)\b/.test(hay)) {
    return 14
  }

  return 0
}

function scoreCategory(
  event: CalendarEvent,
  category: ActionCategory,
): number {
  const keywords = CATEGORIES_KEYWORDS[category]
  let score =
    fieldScore(event.summary, keywords, 4) +
    fieldScore(event.location, keywords, 2.5) +
    fieldScore(event.description, keywords, 1)

  if (category === 'travel') {
    score += travelLocationBonus(event.location)
  }

  return score
}

export type CategorySuggestion = {
  category: Category
  score: number
  margin: number
}

/** Best keyword score across categories (0 if nothing matched). */
export function bestMatchScore(event: CalendarEvent): number {
  let best = 0
  for (const category of SCORED_CATEGORIES) {
    best = Math.max(best, scoreCategory(event, category))
  }
  return best
}

export function rankCategories(
  event: CalendarEvent,
): Array<{ category: ActionCategory; score: number }> {
  return SCORED_CATEGORIES.map((category) => ({
    category,
    score: scoreCategory(event, category),
  })).sort((a, b) => b.score - a.score)
}

export function suggestCategoryDetailed(
  event: CalendarEvent,
): CategorySuggestion {
  const ranked = rankCategories(event)
  const best = ranked[0]
  const second = ranked[1]
  const margin = best.score - (second?.score ?? 0)

  if (best.score < MIN_SCORE || margin < MIN_MARGIN) {
    return { category: 'uncategorized', score: best.score, margin }
  }

  return { category: best.category, score: best.score, margin }
}

export function suggestCategory(event: CalendarEvent): Category {
  return suggestCategoryDetailed(event).category
}

export function emptyCategorizedEvents(): CategorizedEvents {
  return {
    travel: [],
    fitness: [],
    social: [],
    personal: [],
    uncategorized: [],
  }
}

export function countEvents(categorized: CategorizedEvents): number {
  return (Object.keys(categorized) as Category[]).reduce(
    (sum, key) => sum + categorized[key].length,
    0,
  )
}

export function categorizeEvents(events: CalendarEvent[]): CategorizedEvents {
  const categorized = emptyCategorizedEvents()

  events.forEach((event) => {
    const category = suggestCategory(event)
    categorized[category].push({ ...event, category })
  })

  return categorized
}

export function moveEvent(
  categorized: CategorizedEvents,
  eventId: string,
  toCategory: Category,
): CategorizedEvents {
  const next = emptyCategorizedEvents()
  let moved: CalendarEvent | null = null

  ;(Object.keys(categorized) as Category[]).forEach((category) => {
    categorized[category].forEach((event) => {
      if (event.id === eventId) {
        moved = { ...event, category: toCategory }
      } else {
        next[category].push(event)
      }
    })
  })

  if (moved) next[toCategory].push(moved)
  return next
}

export function deleteEvent(
  categorized: CategorizedEvents,
  eventId: string,
): CategorizedEvents {
  const next = emptyCategorizedEvents()
  ;(Object.keys(categorized) as Category[]).forEach((category) => {
    next[category] = categorized[category].filter((event) => event.id !== eventId)
  })
  return next
}
