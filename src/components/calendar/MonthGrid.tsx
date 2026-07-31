import type { CalendarEvent } from '../../datastore/types'
import { useCategories } from '../../contexts/CategoryContext'
import { useDayFillStyle } from '../../contexts/DayFillStyleContext'
import {
  dayBackground,
  dayColors,
  eventsForDay,
  pieSlicePath,
  type DayFillStyle,
} from '../../lib/calendarDays'
import {
  daysInMonth,
  MONTH_NAMES,
  startDayOfMonth,
  type DayRef,
} from '../../lib/productMode'

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

function DayFill({
  colors,
  fillStyle,
  dayEvents,
  colorById,
  categoryOrder,
}: {
  colors: string[]
  fillStyle: DayFillStyle
  dayEvents: CalendarEvent[]
  colorById: Record<string, string>
  categoryOrder: string[]
}) {
  // Inline SVG pies survive html2canvas; CSS conic-gradient does not.
  if (fillStyle === 'pie' && colors.length > 1) {
    return (
      <span className="snapDay__fill" aria-hidden>
        <svg
          className="snapDay__pie"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {colors.map((color, index) => (
            <path
              key={`${color}-${index}`}
              d={pieSlicePath(index, colors.length)}
              fill={color}
            />
          ))}
        </svg>
      </span>
    )
  }

  return (
    <span
      className="snapDay__fill"
      style={{
        background: dayBackground(
          dayEvents,
          colorById,
          categoryOrder,
          fillStyle,
        ),
      }}
      aria-hidden
    />
  )
}

type DayCellProps = {
  year: number
  monthIndex: number
  dayNum: number | null
  events: CalendarEvent[]
  size: 'sm' | 'lg'
  showNumber?: boolean
  colorById: Record<string, string>
  categoryOrder: string[]
  fillStyle: DayFillStyle
}

function DayCell({
  year,
  monthIndex,
  dayNum,
  events,
  size,
  showNumber = true,
  colorById,
  categoryOrder,
  fillStyle,
}: DayCellProps) {
  if (dayNum == null) {
    return <div className={`snapDay snapDay--empty snapDay--${size}`} />
  }

  const dayEvents = eventsForDay(events, year, monthIndex, dayNum)
  const colors = dayColors(dayEvents, colorById, categoryOrder)
  const hasFill = colors.length > 0

  return (
    <div
      className={[
        'snapDay',
        `snapDay--${size}`,
        hasFill ? 'snapDay--filled' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      title={
        dayEvents.length > 0
          ? dayEvents.map((e) => e.summary).join(', ')
          : undefined
      }
    >
      {hasFill ? (
        <DayFill
          colors={colors}
          fillStyle={fillStyle}
          dayEvents={dayEvents}
          colorById={colorById}
          categoryOrder={categoryOrder}
        />
      ) : null}
      {showNumber ? <span className="snapDay__num">{dayNum}</span> : null}
    </div>
  )
}

type MonthGridProps = {
  year: number
  monthIndex: number
  events: CalendarEvent[]
  size: 'sm' | 'lg'
  showWeekdays?: boolean
  showMonthLabel?: boolean
}

export function MonthGrid({
  year,
  monthIndex,
  events,
  size,
  showWeekdays = false,
  showMonthLabel = false,
}: MonthGridProps) {
  const { colors, actionCategories } = useCategories()
  const { fillStyle } = useDayFillStyle()
  const categoryOrder = actionCategories.map((c) => c.id)
  const days = daysInMonth(year, monthIndex)
  const startDay = startDayOfMonth(year, monthIndex)
  const cells: Array<number | null> = [
    ...Array.from({ length: startDay }, () => null),
    ...Array.from({ length: days }, (_, i) => i + 1),
  ]

  while (cells.length % 7 !== 0) cells.push(null)

  return (
    <div className={`snapMonth snapMonth--${size}`}>
      {showMonthLabel ? (
        <div className="snapMonth__label">{MONTH_NAMES[monthIndex]}</div>
      ) : null}
      {showWeekdays ? (
        <div className="snapMonth__weekdays">
          {WEEKDAYS.map((day, i) => (
            <span key={`${day}-${i}`}>{day}</span>
          ))}
        </div>
      ) : null}
      <div className="snapMonth__grid">
        {cells.map((dayNum, index) => (
          <DayCell
            key={`${monthIndex}-${index}`}
            year={year}
            monthIndex={monthIndex}
            dayNum={dayNum}
            events={events}
            size={size}
            showNumber={size === 'lg'}
            colorById={colors}
            categoryOrder={categoryOrder}
            fillStyle={fillStyle}
          />
        ))}
      </div>
    </div>
  )
}

/** Year / half / quarter view: continuous day columns (classic Yearify layout). */
export function PeriodGrid({
  year,
  events,
  columns,
  density = 'default',
}: {
  year: number
  events: CalendarEvent[]
  columns: DayRef[][]
  density?: 'default' | 'comfortable' | 'wide'
}) {
  const { colors, actionCategories } = useCategories()
  const { fillStyle } = useDayFillStyle()
  const categoryOrder = actionCategories.map((c) => c.id)

  return (
    <div
      className={`snapYearColumns${
        density === 'wide'
          ? ' snapYearColumns--wide'
          : density === 'comfortable'
            ? ' snapYearColumns--comfortable'
            : ''
      }`}
    >
      {columns.map((days, columnIndex) => {
        const first = days[0]
        const leadPad = first
          ? new Date(year, first.monthIndex, first.dayNum).getDay()
          : 0
        const cells: Array<DayRef | null> = [
          ...Array.from({ length: leadPad }, () => null),
          ...days,
        ]

        return (
          <div
            key={first ? `${first.monthIndex}-${first.dayNum}` : columnIndex}
            className="snapYearColumn"
          >
            {cells.map((cell, index) =>
              cell ? (
                <DayCell
                  key={`${cell.monthIndex}-${cell.dayNum}`}
                  year={year}
                  monthIndex={cell.monthIndex}
                  dayNum={cell.dayNum}
                  events={events}
                  size="sm"
                  showNumber
                  colorById={colors}
                  categoryOrder={categoryOrder}
                  fillStyle={fillStyle}
                />
              ) : (
                <div
                  key={`pad-${columnIndex}-${index}`}
                  className="snapDay snapDay--empty snapDay--sm"
                />
              ),
            )}
          </div>
        )
      })}
    </div>
  )
}

/** Full-year three-column grid. */
export function YearGrid({
  year,
  events,
}: {
  year: number
  events: CalendarEvent[]
}) {
  return (
    <PeriodGrid
      year={year}
      events={events}
      columns={[
        [0, 1, 2, 3],
        [4, 5, 6, 7],
        [8, 9, 10, 11],
      ].map((months) => {
        const days: DayRef[] = []
        months.forEach((monthIndex) => {
          const count = daysInMonth(year, monthIndex)
          for (let dayNum = 1; dayNum <= count; dayNum += 1) {
            days.push({ monthIndex, dayNum })
          }
        })
        return days
      })}
    />
  )
}
