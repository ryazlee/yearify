export type CalendarEvent = {
  id: string
  summary: string
  start: string
  end: string
  category?: string
  description?: string
  location?: string
  htmlLink?: string
}

/** Year used for calendar snapshots (product is currently 2024-scoped). */
export const YEARIFY_YEAR = 2024
