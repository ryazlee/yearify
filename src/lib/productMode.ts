export type ProductMode = 'yearify' | 'monthify'

export type ProductModeConfig = {
  id: ProductMode
  name: string
  path: string
  tagline: string
  description: string
  snapshotLabel: string
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
  monthify: {
    id: 'monthify',
    name: 'Monthify',
    path: '/monthify',
    tagline: 'Your month, visualized.',
    description:
      'Turn your Google Calendar into a colorful snapshot of a single month.',
    snapshotLabel: 'Your month',
  },
}

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

export function daysInMonth(year: number, monthIndex: number): number {
  return new Date(year, monthIndex + 1, 0).getDate()
}

export function startDayOfMonth(year: number, monthIndex: number): number {
  return new Date(year, monthIndex, 1).getDay()
}
