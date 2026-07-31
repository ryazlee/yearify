import { useCategories } from '../../contexts/CategoryContext'
import type { CategorizedEvents } from '../types'
import { DEFAULT_YEAR } from '../../datastore/types'
import { APP_SITE_URL } from '../../lib/brand'
import {
  formatPeriodLabel,
  periodDayColumns,
  quarterDayColumns,
  type ProductMode,
} from '../../lib/productMode'
import { getMostEventfulDay, getStats } from '../stats/utils'
import { MonthGrid, PeriodGrid } from './MonthGrid'

type Props = {
  mode: ProductMode
  categorizedEvents: CategorizedEvents
  year?: number
  monthIndex?: number
  quarterIndex?: number
  halfIndex?: number
  showStats?: boolean
  totalDays?: number
}

export function SnapshotCalendar({
  mode,
  categorizedEvents,
  year = DEFAULT_YEAR,
  monthIndex = 0,
  quarterIndex = 0,
  halfIndex = 0,
  showStats = false,
  totalDays = 365,
}: Props) {
  const { actionCategories, colors } = useCategories()
  const events = Object.values(categorizedEvents).flat()
  const period = formatPeriodLabel(mode, year, {
    monthIndex,
    quarterIndex,
    halfIndex,
  })

  const stats =
    showStats && Object.keys(categorizedEvents).length > 0
      ? getStats(categorizedEvents, totalDays)
      : null
  const mostEventfulDay =
    showStats && Object.keys(categorizedEvents).length > 0
      ? getMostEventfulDay(categorizedEvents)
      : null

  return (
    <div className="snapCard">
      <header className="snapCard__header">
        <h2 className="snapCard__period">{period}</h2>
        <div
          className="snapCard__legend"
          aria-label={showStats ? 'Category stats' : 'Category legend'}
        >
          {actionCategories.map((item) => (
            <span key={item.id} className="snapLegendItem">
              <span
                className="snapLegendItem__swatch"
                style={{ background: colors[item.id] }}
              />
              <span className="snapLegendItem__label">{item.label}</span>
              {stats?.[item.id] ? (
                <span className="snapLegendItem__value">{stats[item.id]}</span>
              ) : null}
            </span>
          ))}
        </div>
        {mostEventfulDay ? (
          <p className="snapCard__meta">
            Busiest day · {mostEventfulDay.date} ·{' '}
            {mostEventfulDay.events.length}{' '}
            {mostEventfulDay.events.length === 1 ? 'event' : 'events'}
          </p>
        ) : null}
      </header>

      <div className="snapCard__body">
        {mode === 'monthify' ? (
          <MonthGrid
            year={year}
            monthIndex={monthIndex}
            events={events}
            size="lg"
            showWeekdays
          />
        ) : mode === 'quarterify' ? (
          <PeriodGrid
            year={year}
            events={events}
            columns={quarterDayColumns(year, quarterIndex)}
            density="wide"
          />
        ) : (
          <PeriodGrid
            year={year}
            events={events}
            columns={periodDayColumns(
              mode,
              year,
              mode === 'halfify' ? halfIndex : 0,
            )}
            density={mode === 'halfify' ? 'comfortable' : 'default'}
          />
        )}
      </div>

      <footer className="snapCard__footer">
        {APP_SITE_URL.replace(/^https?:\/\//, '')}
      </footer>
    </div>
  )
}