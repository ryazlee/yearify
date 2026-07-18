import type { CalendarEvent } from '../../datastore/types'
import { dayBackground, dayColors, eventsForDay } from '../../lib/calendarDays'
import {
  daysInMonth,
  MONTH_NAMES,
  startDayOfMonth,
} from '../../lib/productMode'

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

type DayRef = { monthIndex: number; dayNum: number }

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

/** Year view: three tight columns of continuous days (like the classic Yearify image). */
export function YearGrid({
  year,
  events,
}: {
  year: number
  events: CalendarEvent[]
}) {
  const columns = [
    [0, 1, 2, 3],
    [4, 5, 6, 7],
    [8, 9, 10, 11],
  ]

  return (
    <div className="snapYearColumns">
      {columns.map((monthIndexes) => {
        const leadPad = startDayOfMonth(year, monthIndexes[0])
        const cells: Array<DayRef | null> = Array.from(
          { length: leadPad },
          () => null,
        )

        monthIndexes.forEach((monthIndex) => {
          const days = daysInMonth(year, monthIndex)
          for (let dayNum = 1; dayNum <= days; dayNum += 1) {
            cells.push({ monthIndex, dayNum })
          }
        })

        return (
          <div key={monthIndexes[0]} className="snapYearColumn">
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
                  key={`pad-${monthIndexes[0]}-${index}`}
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
