import type { CalendarEvent } from './types'

export interface YearifyDatastore {
  signIn(): Promise<void>
  signOut(): Promise<void>
  listYearEvents(year: number): Promise<CalendarEvent[]>
}
