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

export const DEFAULT_YEAR = new Date().getFullYear()
export const MIN_YEAR = 2015
export const MAX_YEAR = DEFAULT_YEAR

export function yearOptions(
  maxYear: number = MAX_YEAR,
  minYear: number = MIN_YEAR,
): number[] {
  const years: number[] = []
  for (let year = maxYear; year >= minYear; year -= 1) {
    years.push(year)
  }
  return years
}

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}

export function daysInYear(year: number): number {
  return isLeapYear(year) ? 366 : 365
}

export function parseYearParam(value: string | null): number | null {
  if (!value) return null
  const year = Number(value)
  if (!Number.isInteger(year) || year < MIN_YEAR || year > MAX_YEAR) return null
  return year
}
