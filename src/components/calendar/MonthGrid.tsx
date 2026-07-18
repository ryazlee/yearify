import type { CalendarEvent } from '../../datastore/types'
import { dayBackground, dayColors, eventsForDay } from '../../lib/calendarDays'
import {
  daysInMonth,
  MONTH_NAMES,
  startDayOfMonth,
  type DayRef,
} from '../../lib/productMode'

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

type DayCellProps = {
  year: number
  monthIndex: number
  dayNum: number | null
  events: CalendarEvent[]
  size: 'sm' | 'lg'
  showNumber?: boolean
}

function DayCell({
  year,
  monthIndex,
  dayNum,
  events,
  size,
  showNumber = true,
}: DayCellProps) {
  if (dayNum == null) {
    return <div className={`snapDay snapDay--empty snapDay--${size}`} />
  }

  const dayEvents = eventsForDay(events, year, monthIndex, dayNum)
  const colors = dayColors(dayEvents)
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
        <span
          className="snapDay__fill"
          style={{ background: dayBackground(dayEvents) }}
          aria-hidden
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
