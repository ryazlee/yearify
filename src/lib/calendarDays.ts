import type { CalendarEvent } from '../datastore/types'
import { UNCATEGORIZED_ID } from './categories'
import { eventCategories } from '../components/categorizer/utils'

export type DayFillStyle = 'vertical' | 'horizontal' | 'pie' | 'squares'

export const DAY_FILL_STYLE_OPTIONS: ReadonlyArray<{
  id: DayFillStyle
  label: string
}> = [
  { id: 'vertical', label: 'Vertical' },
  { id: 'horizontal', label: 'Horizontal' },
  { id: 'pie', label: 'Pie' },
  { id: 'squares', label: 'Squares' },
]

export const DEFAULT_DAY_FILL_STYLE: DayFillStyle = 'pie'

const STORAGE_KEY = 'yearify.dayFillStyle.v1'

export function isDayFillStyle(value: unknown): value is DayFillStyle {
  return (
    value === 'vertical' ||
    value === 'horizontal' ||
    value === 'pie' ||
    value === 'squares'
  )
}

export function loadDayFillStyle(): DayFillStyle {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (isDayFillStyle(raw)) return raw
  } catch {
    // ignore
  }
  return DEFAULT_DAY_FILL_STYLE
}

export function saveDayFillStyle(style: DayFillStyle): void {
  localStorage.setItem(STORAGE_KEY, style)
}

/** Unique categorized colors for a day, in definition order. */
export function dayColors(
  events: CalendarEvent[],
  colorById: Record<string, string>,
  order: string[],
): string[] {
  const present = new Set<string>()
  events.forEach((event) => {
    eventCategories(event).forEach((category) => {
      if (category === UNCATEGORIZED_ID) return
      if (colorById[category]) present.add(category)
    })
  })

  const ordered = order.filter((category) => present.has(category))
  const extras = Array.from(present).filter(
    (category) => !ordered.includes(category),
  )

  return [...ordered, ...extras].map((category) => colorById[category])
}

export function adjustAllDayEnd(start: string, end: string): Date {
  const startDate = new Date(start)
  const endDate = new Date(end)

  const diffHours =
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60)

  if (diffHours === 24) {
    endDate.setDate(endDate.getDate() - 1)
  }
  return endDate
}

export function eventsForDay(
  events: CalendarEvent[],
  year: number,
  monthIndex: number,
  dayNum: number,
): CalendarEvent[] {
  const dayStart = new Date(year, monthIndex, dayNum, 0, 0, 0)
  const dayEnd = new Date(year, monthIndex, dayNum, 23, 59, 59)

  return events.filter((event) => {
    const eventStart = new Date(event.start)
    const eventEnd = adjustAllDayEnd(event.start, event.end)
    return eventStart <= dayEnd && eventEnd >= dayStart
  })
}

function bandStops(colors: string[]): string {
  const step = 100 / colors.length
  return colors
    .map((color, index) => {
      const start = step * index
      const end = step * (index + 1)
      return `${color} ${start}% ${end}%`
    })
    .join(', ')
}

/** Polar point for pie slices; 0° is 12 o'clock. */
function polar(cx: number, cy: number, r: number, angleDeg: number): [number, number] {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)]
}

/** SVG path for one equal pie slice (viewBox 0 0 100 100). */
export function pieSlicePath(index: number, total: number): string {
  if (total <= 0) return ''
  if (total === 1) {
    return 'M 50 0 A 50 50 0 1 1 49.999 0 Z'
  }

  const startAngle = (index / total) * 360
  const endAngle = ((index + 1) / total) * 360
  const [x1, y1] = polar(50, 50, 50, startAngle)
  const [x2, y2] = polar(50, 50, 50, endAngle)
  const largeArc = endAngle - startAngle > 180 ? 1 : 0
  return `M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArc} 1 ${x2} ${y2} Z`
}

/** Grid of equal squares (2→1×2, 3–4→2×2, 5–9→3×3, …). */
function squaresBackground(colors: string[], emptyFill: string): string {
  const n = colors.length
  const cols = Math.ceil(Math.sqrt(n))
  const rows = Math.ceil(n / cols)
  const sizeX = 100 / cols
  const sizeY = 100 / rows

  const layers = colors.map((color, index) => {
    const col = index % cols
    const row = Math.floor(index / cols)
    const posX = cols === 1 ? 0 : (col / (cols - 1)) * 100
    const posY = rows === 1 ? 0 : (row / (rows - 1)) * 100
    return `linear-gradient(${color}, ${color}) ${posX}% ${posY}% / ${sizeX}% ${sizeY}% no-repeat`
  })

  // Last layer paints behind any unused grid cells.
  layers.push(`linear-gradient(${emptyFill}, ${emptyFill})`)
  return layers.join(', ')
}

/**
 * CSS background for non-pie fills.
 * Pie uses inline SVG (html2canvas does not paint conic-gradient).
 */
export function dayBackground(
  events: CalendarEvent[],
  colorById: Record<string, string>,
  order: string[],
  style: DayFillStyle = DEFAULT_DAY_FILL_STYLE,
  emptyFill = '#fff',
): string {
  const colors = dayColors(events, colorById, order)
  if (colors.length === 0) return emptyFill
  if (colors.length === 1) return colors[0]

  switch (style) {
    case 'horizontal':
      return `linear-gradient(180deg, ${bandStops(colors)})`
    case 'vertical':
      return `linear-gradient(90deg, ${bandStops(colors)})`
    case 'squares':
      return squaresBackground(colors, emptyFill)
    case 'pie':
    default:
      // Fallback only — prefer SVG pie slices in the DOM for export.
      return `conic-gradient(from -90deg, ${bandStops(colors)})`
  }
}
