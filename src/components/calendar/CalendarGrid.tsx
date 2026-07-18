import type { CategorizedEvents } from '../types'
import { CATEGORY_COLORS } from '../types'
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

const LEGEND_ITEMS = [
  { key: 'travel', label: 'Travel' },
  { key: 'social', label: 'Social' },
  { key: 'fitness', label: 'Fitness' },
  { key: 'personal', label: 'Personal' },
] as const

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
          {LEGEND_ITEMS.map((item) => (
            <span key={item.key} className="snapLegendItem">
              <span
                className="snapLegendItem__swatch"
                style={{ background: CATEGORY_COLORS[item.key] }}
              />
              <span className="snapLegendItem__label">{item.label}</span>
              {stats?.[item.key] ? (
                <span className="snapLegendItem__value">{stats[item.key]}</span>
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
