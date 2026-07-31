import { useEffect, useState } from 'react'
import {
  Box,
  Chip,
  IconButton,
  Paper,
  Typography,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import LinkIcon from '@mui/icons-material/Link'
import { useCategories } from '../../contexts/CategoryContext'
import { UNCATEGORIZED_ID, type Category } from '../../lib/categories'
import type { CalendarEvent, CategorizedEvents } from '../types'
import {
  deleteEvent,
  eventCategories,
  setEventCategories,
  toggleEventCategory,
} from '../categorizer/utils'

type Props = {
  categorizedEvents: CategorizedEvents
  onUpdate: (next: CategorizedEvents) => void
  focusCategory?: Category
}

function formatWhen(event: CalendarEvent): string {
  const start = new Date(event.start)
  return start.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })
}

export function MobileEventList({
  categorizedEvents,
  onUpdate,
  focusCategory,
}: Props) {
  const { categories, actionCategories, colors } = useCategories()
  const [activeCategory, setActiveCategory] = useState<Category>(
    focusCategory ?? UNCATEGORIZED_ID,
  )

  useEffect(() => {
    if (focusCategory) setActiveCategory(focusCategory)
  }, [focusCategory])

  useEffect(() => {
    if (!categories.some((c) => c.id === activeCategory)) {
      setActiveCategory(UNCATEGORIZED_ID)
    }
  }, [categories, activeCategory])

  const events = categorizedEvents[activeCategory] ?? []

  return (
    <Box className="catMobile">
      <Box className="catMobile__tabs">
        {categories.map((category) => {
          const count = categorizedEvents[category.id]?.length ?? 0
          return (
            <button
              key={category.id}
              type="button"
              className={`catMobile__tab${
                activeCategory === category.id ? ' is-active' : ''
              }`}
              style={
                activeCategory === category.id
                  ? { background: colors[category.id] }
                  : undefined
              }
              onClick={() => setActiveCategory(category.id)}
            >
              <span className="catMobile__tabLabel">{category.label}</span>
              <span className="catMobile__tabCount">{count}</span>
            </button>
          )
        })}
      </Box>

      {events.length === 0 ? (
        <Typography
          color="text.secondary"
          sx={{ textAlign: 'center', py: 3, fontSize: '0.9rem' }}
        >
          No events in{' '}
          {categories.find((c) => c.id === activeCategory)?.label ??
            activeCategory}
          .
        </Typography>
      ) : (
        <Box className="catMobile__list">
          {events.map((event) => {
            const assigned = eventCategories(event)
            return (
              <Paper key={event.id} className="catMobile__card" elevation={0}>
                <Box className="catMobile__cardTop">
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        letterSpacing: '-0.01em',
                      }}
                      noWrap
                    >
                      {event.summary || 'Untitled event'}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: 'block' }}
                    >
                      {formatWhen(event)}
                      {event.location ? ` · ${event.location}` : ''}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 0.25 }}>
                    {event.htmlLink ? (
                      <IconButton
                        size="small"
                        aria-label="Open in Google Calendar"
                        onClick={() => window.open(event.htmlLink, '_blank')}
                      >
                        <LinkIcon fontSize="small" />
                      </IconButton>
                    ) : null}
                    <IconButton
                      size="small"
                      aria-label="Remove event"
                      onClick={() =>
                        onUpdate(
                          deleteEvent(categorizedEvents, event.id, categories),
                        )
                      }
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
                <Box className="catMobile__chips">
                  {actionCategories.map((category) => {
                    const selected = assigned.includes(category.id)
                    return (
                      <Chip
                        key={category.id}
                        size="small"
                        label={category.label}
                        clickable
                        onClick={() =>
                          onUpdate(
                            toggleEventCategory(
                              categorizedEvents,
                              event.id,
                              category.id,
                              categories,
                            ),
                          )
                        }
                        sx={{
                          bgcolor: selected
                            ? colors[category.id]
                            : 'transparent',
                          border: '1px solid',
                          borderColor: selected ? 'transparent' : 'divider',
                          fontWeight: selected ? 600 : 500,
                        }}
                      />
                    )
                  })}
                  {assigned.length > 0 ? (
                    <Chip
                      size="small"
                      label="Clear"
                      clickable
                      variant="outlined"
                      onClick={() =>
                        onUpdate(
                          setEventCategories(
                            categorizedEvents,
                            event.id,
                            [],
                            categories,
                          ),
                        )
                      }
                    />
                  ) : null}
                </Box>
              </Paper>
            )
          })}
        </Box>
      )}

      {activeCategory === UNCATEGORIZED_ID && events.length > 0 ? (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: 'block', textAlign: 'center', mt: 1 }}
        >
          Tap category chips to assign — events can have more than one.
        </Typography>
      ) : null}
    </Box>
  )
}
