import type { CalendarEvent } from '../../datastore/types'
import {
  UNCATEGORIZED_ID,
  type CategorizedEvents,
  type Category,
  type CategoryDefinition,
} from '../../lib/categories'

/** Minimum absolute score to assign a category. */
const MIN_SCORE = 10

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

function scoredCategoryDefs(
  definitions: CategoryDefinition[],
): CategoryDefinition[] {
  return definitions.filter((c) => c.id !== UNCATEGORIZED_ID)
}

/** Normalized category ids on an event (never includes uncategorized). */
export function eventCategories(event: CalendarEvent): string[] {
  if (Array.isArray(event.categories) && event.categories.length > 0) {
    return Array.from(
      new Set(
        event.categories.filter(
          (id) => typeof id === 'string' && id && id !== UNCATEGORIZED_ID,
        ),
      ),
    )
  }
  if (event.category && event.category !== UNCATEGORIZED_ID) {
    return [event.category]
  }
  return []
}

export function withEventCategories(
  event: CalendarEvent,
  categories: string[],
): CalendarEvent {
  const cleaned = Array.from(
    new Set(
      categories.filter(
        (id) => typeof id === 'string' && id && id !== UNCATEGORIZED_ID,
      ),
    ),
  )
  return {
    ...event,
    categories: cleaned,
    category: cleaned[0],
  }
}

export function rankCategories(
  event: CalendarEvent,
  definitions: CategoryDefinition[],
): Array<{ category: Category; score: number }> {
  return scoredCategoryDefs(definitions)
    .map((category) => ({
      category: category.id,
      score: scoreCategory(event, category),
    }))
    .sort((a, b) => b.score - a.score)
}

/** All categories that clear the confidence floor (multi-label). */
export function suggestCategories(
  event: CalendarEvent,
  definitions: CategoryDefinition[],
): string[] {
  return rankCategories(event, definitions)
    .filter((entry) => entry.score >= MIN_SCORE)
    .map((entry) => entry.category)
}

export function emptyCategorizedEvents(
  definitions: CategoryDefinition[],
): CategorizedEvents {
  const next: CategorizedEvents = {}
  // Preserve definition order (uncategorized first).
  for (const category of definitions) {
    next[category.id] = []
  }
  if (!next[UNCATEGORIZED_ID]) {
    return { [UNCATEGORIZED_ID]: [], ...next }
  }
  return next
}

/** Unique events across buckets (multi-category events appear once). */
export function uniqueEvents(categorized: CategorizedEvents): CalendarEvent[] {
  const byId = new Map<string, CalendarEvent>()
  Object.values(categorized).forEach((list) => {
    list.forEach((event) => {
      const existing = byId.get(event.id)
      if (!existing) {
        byId.set(event.id, withEventCategories(event, eventCategories(event)))
        return
      }
      byId.set(
        event.id,
        withEventCategories(event, [
          ...eventCategories(existing),
          ...eventCategories(event),
        ]),
      )
    })
  })
  return Array.from(byId.values())
}

export function countEvents(categorized: CategorizedEvents): number {
  return uniqueEvents(categorized).length
}

/** Build column buckets from events (an event may appear in multiple columns). */
export function indexCategorizedEvents(
  events: CalendarEvent[],
  definitions: CategoryDefinition[],
): CategorizedEvents {
  const categorized = emptyCategorizedEvents(definitions)
  const valid = new Set(
    definitions.map((c) => c.id).filter((id) => id !== UNCATEGORIZED_ID),
  )

  events.forEach((event) => {
    const cats = eventCategories(event).filter((id) => valid.has(id))
    const normalized = withEventCategories(event, cats)
    if (cats.length === 0) {
      categorized[UNCATEGORIZED_ID].push(normalized)
      return
    }
    cats.forEach((id) => {
      categorized[id].push(normalized)
    })
  })

  return categorized
}

export function categorizeEvents(
  events: CalendarEvent[],
  definitions: CategoryDefinition[],
): CategorizedEvents {
  return indexCategorizedEvents(
    events.map((event) =>
      withEventCategories(event, suggestCategories(event, definitions)),
    ),
    definitions,
  )
}

/** Keep assignments when category ids change; drop removed ids. */
export function reshapeCategorizedEvents(
  categorized: CategorizedEvents,
  definitions: CategoryDefinition[],
): CategorizedEvents {
  const valid = new Set(
    definitions.map((c) => c.id).filter((id) => id !== UNCATEGORIZED_ID),
  )
  return indexCategorizedEvents(
    uniqueEvents(categorized).map((event) =>
      withEventCategories(
        event,
        eventCategories(event).filter((id) => valid.has(id)),
      ),
    ),
    definitions,
  )
}

export function setEventCategories(
  categorized: CategorizedEvents,
  eventId: string,
  categories: string[],
  definitions: CategoryDefinition[],
): CategorizedEvents {
  const valid = new Set(
    definitions.map((c) => c.id).filter((id) => id !== UNCATEGORIZED_ID),
  )
  const events = uniqueEvents(categorized).map((event) => {
    if (event.id !== eventId) return event
    return withEventCategories(
      event,
      categories.filter((id) => valid.has(id)),
    )
  })
  return indexCategorizedEvents(events, definitions)
}

export function toggleEventCategory(
  categorized: CategorizedEvents,
  eventId: string,
  categoryId: Category,
  definitions: CategoryDefinition[],
): CategorizedEvents {
  if (categoryId === UNCATEGORIZED_ID) {
    return setEventCategories(categorized, eventId, [], definitions)
  }

  const event = uniqueEvents(categorized).find((item) => item.id === eventId)
  if (!event) return categorized

  const current = eventCategories(event)
  const next = current.includes(categoryId)
    ? current.filter((id) => id !== categoryId)
    : [...current, categoryId]

  return setEventCategories(categorized, eventId, next, definitions)
}

/** Add a category without removing others (used by board drag-onto). */
export function addEventCategory(
  categorized: CategorizedEvents,
  eventId: string,
  categoryId: Category,
  definitions: CategoryDefinition[],
): CategorizedEvents {
  if (categoryId === UNCATEGORIZED_ID) {
    return setEventCategories(categorized, eventId, [], definitions)
  }
  const event = uniqueEvents(categorized).find((item) => item.id === eventId)
  if (!event) return categorized
  const current = eventCategories(event)
  if (current.includes(categoryId)) return categorized
  return setEventCategories(
    categorized,
    eventId,
    [...current, categoryId],
    definitions,
  )
}

/** Remove one category; event becomes uncategorized if none remain. */
export function removeEventCategory(
  categorized: CategorizedEvents,
  eventId: string,
  categoryId: Category,
  definitions: CategoryDefinition[],
): CategorizedEvents {
  const event = uniqueEvents(categorized).find((item) => item.id === eventId)
  if (!event) return categorized
  return setEventCategories(
    categorized,
    eventId,
    eventCategories(event).filter((id) => id !== categoryId),
    definitions,
  )
}

export function deleteEvent(
  categorized: CategorizedEvents,
  eventId: string,
  definitions: CategoryDefinition[],
): CategorizedEvents {
  return indexCategorizedEvents(
    uniqueEvents(categorized).filter((event) => event.id !== eventId),
    definitions,
  )
}
