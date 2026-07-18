import type { CalendarEvent } from '../datastore/types'

export type { CalendarEvent }

export const CATEGORY_COLORS: { [key: string]: string } = {
  travel: '#FFDDC1',
  fitness: '#C1FFDD',
  social: '#C1DFFF',
  personal: '#DAB1DA',
  uncategorized: '#D3D3D3',
}

export type CategorizedEvents = {
  travel: CalendarEvent[]
  fitness: CalendarEvent[]
  social: CalendarEvent[]
  personal: CalendarEvent[]
  uncategorized: CalendarEvent[]
}

export type Category = keyof CategorizedEvents

export const CATEGORIES = Object.keys(CATEGORY_COLORS) as Category[]
