export type ProductMode = 'yearify' | 'halfify' | 'quarterify' | 'monthify'

export type ProductModeConfig = {
  id: ProductMode
  name: string
  path: string
  tagline: string
  description: string
  snapshotLabel: string
  landingNote?: string
}

export const PRODUCT_MODES: Record<ProductMode, ProductModeConfig> = {
  yearify: {
    id: 'yearify',
    name: 'Yearify',
    path: '/',
    tagline: 'Your year, visualized.',
    description:
      'Turn your Google Calendar into a colorful snapshot of your year.',
    snapshotLabel: 'Your year',
  },
  halfify: {
    id: 'halfify',
    name: 'Halfify',
    path: '/halfify',
    tagline: 'Your half-year, visualized.',
    description:
      'Turn your Google Calendar into a colorful snapshot of H1 or H2.',
    snapshotLabel: 'Your half-year',
    landingNote:
      'Same flow as Yearify — connect your calendar, categorize, and share half a year.',
  },
  quarterify: {
    id: 'quarterify',
    name: 'Quarterify',
    path: '/quarterify',
    tagline: 'Your quarter, visualized.',
    description:
      'Turn your Google Calendar into a colorful snapshot of a single quarter.',
    snapshotLabel: 'Your quarter',
    landingNote:
      'Same flow as Yearify — connect your calendar, categorize, and share a quarter.',
  },
  monthify: {
    id: 'monthify',
    name: 'Monthify',
    path: '/monthify',
    tagline: 'Your month, visualized.',
    description:
      'Turn your Google Calendar into a colorful snapshot of a single month.',
    snapshotLabel: 'Your month',
    landingNote:
      'Same flow as Yearify — connect your calendar, categorize, and share a single month.',
  },
}

/** Nav order: broad → narrow. */
export const PRODUCT_MODE_LIST = [
  PRODUCT_MODES.yearify,
  PRODUCT_MODES.halfify,
  PRODUCT_MODES.quarterify,
  PRODUCT_MODES.monthify,
] as const

export const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const

export const QUARTERS = [
  { index: 0, label: 'Q1', months: [0, 1, 2] as const },
  { index: 1, label: 'Q2', months: [3, 4, 5] as const },
  { index: 2, label: 'Q3', months: [6, 7, 8] as const },
  { index: 3, label: 'Q4', months: [9, 10, 11] as const },
] as const

export const HALVES = [
  { index: 0, label: 'H1', months: [0, 1, 2, 3, 4, 5] as const },
  { index: 1, label: 'H2', months: [6, 7, 8, 9, 10, 11] as const },
] as const

export function daysInMonth(year: number, monthIndex: number): number {
  return new Date(year, monthIndex + 1, 0).getDate()
}

export function startDayOfMonth(year: number, monthIndex: number): number {
  return new Date(year, monthIndex, 1).getDay()
}

export function daysInMonths(year: number, monthIndexes: number[]): number {
  return monthIndexes.reduce(
    (sum, monthIndex) => sum + daysInMonth(year, monthIndex),
    0,
  )
}

export function currentQuarterIndex(date = new Date()): number {
  return Math.floor(date.getMonth() / 3)
}

export function currentHalfIndex(date = new Date()): number {
  return date.getMonth() < 6 ? 0 : 1
}

export type DayRef = { monthIndex: number; dayNum: number }

function daysForMonths(year: number, monthIndexes: number[]): DayRef[] {
  const days: DayRef[] = []
  monthIndexes.forEach((monthIndex) => {
    const count = daysInMonth(year, monthIndex)
    for (let dayNum = 1; dayNum <= count; dayNum += 1) {
      days.push({ monthIndex, dayNum })
    }
  })
  return days
}

/**
 * Quarter: 2 columns, split at the middle of the middle month
 * (e.g. Q1 → Jan + early Feb | late Feb + Mar).
 */
export function quarterDayColumns(
  year: number,
  quarterIndex: number,
): DayRef[][] {
  const quarter = QUARTERS[quarterIndex] ?? QUARTERS[0]
  const [first, middle, last] = quarter.months
  const midDays = daysInMonth(year, middle)
  const splitAt = Math.ceil(midDays / 2)

  const left: DayRef[] = [
    ...daysForMonths(year, [first]),
    ...Array.from({ length: splitAt }, (_, i) => ({
      monthIndex: middle,
      dayNum: i + 1,
    })),
  ]

  const right: DayRef[] = [
    ...Array.from({ length: midDays - splitAt }, (_, i) => ({
      monthIndex: middle,
      dayNum: splitAt + i + 1,
    })),
    ...daysForMonths(year, [last]),
  ]

  return [left, right]
}

/** Continuous day-grid columns for year / half (full months per column). */
export function periodDayColumns(
  mode: Exclude<ProductMode, 'monthify' | 'quarterify'>,
  year: number,
  periodIndex = 0,
): DayRef[][] {
  if (mode === 'yearify') {
    return [
      [0, 1, 2, 3],
      [4, 5, 6, 7],
      [8, 9, 10, 11],
    ].map((months) => daysForMonths(year, months))
  }
  const half = HALVES[periodIndex] ?? HALVES[0]
  const months = [...half.months]
  return [months.slice(0, 3), months.slice(3, 6)].map((group) =>
    daysForMonths(year, group),
  )
}

export function formatPeriodLabel(
  mode: ProductMode,
  year: number,
  opts: { monthIndex?: number; quarterIndex?: number; halfIndex?: number },
): string {
  if (mode === 'monthify') {
    return `${MONTH_NAMES[opts.monthIndex ?? 0]} ${year}`
  }
  if (mode === 'quarterify') {
    return `${QUARTERS[opts.quarterIndex ?? 0]?.label ?? 'Q1'} ${year}`
  }
  if (mode === 'halfify') {
    return `${HALVES[opts.halfIndex ?? 0]?.label ?? 'H1'} ${year}`
  }
  return String(year)
}
