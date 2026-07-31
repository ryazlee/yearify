import type { CalendarEvent } from './types'

export interface YearifyDatastore {
  signIn(): Promise<void>
  signOut(): Promise<void>
  /** Restore a previously saved session. Returns true if still authenticated. */
  restoreSession(): Promise<boolean>
  listYearEvents(year: number): Promise<CalendarEvent[]>
}

