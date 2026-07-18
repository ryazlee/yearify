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
import {
  CATEGORIES,
  CATEGORY_COLORS,
  type CalendarEvent,
  type CategorizedEvents,
  type Category,
} from '../types'
import { deleteEvent, moveEvent } from '../categorizer/utils'

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
  const [activeCategory, setActiveCategory] = useState<Category>(
    focusCategory ?? 'uncategorized',
  )

  useEffect(() => {
    if (focusCategory) setActiveCategory(focusCategory)
  }, [focusCategory])

  const events = categorizedEvents[activeCategory]

  return (
    <Box className="catMobile">
      <Box className="catMobile__tabs">
        {CATEGORIES.map((category) => {
          const count = categorizedEvents[category].length
          return (
            <button
              key={category}
              type="button"
              className={`catMobile__tab${
                activeCategory === category ? ' is-active' : ''
              }`}
              style={
                activeCategory === category
                  ? { background: CATEGORY_COLORS[category] }
                  : undefined
              }
              onClick={() => setActiveCategory(category)}
            >
              <span className="catMobile__tabLabel">{category}</span>
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
          No events in {activeCategory}.
        </Typography>
      ) : (
        <Box className="catMobile__list">
          {events.map((event) => (
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
                    onClick={() => onUpdate(deleteEvent(categorizedEvents, event.id))}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
              <Box className="catMobile__chips">
                {CATEGORIES.filter((c) => c !== 'uncategorized').map(
                  (category) => (
                    <Chip
                      key={category}
                      size="small"
                      label={category}
                      clickable
                      onClick={() =>
                        onUpdate(
                          moveEvent(categorizedEvents, event.id, category),
                        )
                      }
                      sx={{
                        textTransform: 'capitalize',
                        bgcolor:
                          event.category === category
                            ? CATEGORY_COLORS[category]
                            : 'transparent',
                        border: '1px solid',
                        borderColor:
                          event.category === category
                            ? 'transparent'
                            : 'divider',
                        fontWeight: event.category === category ? 600 : 500,
                      }}
                    />
                  ),
                )}
                {event.category && event.category !== 'uncategorized' ? (
                  <Chip
                    size="small"
                    label="Clear"
                    clickable
                    variant="outlined"
                    onClick={() =>
                      onUpdate(
                        moveEvent(categorizedEvents, event.id, 'uncategorized'),
                      )
                    }
                  />
                ) : null}
              </Box>
            </Paper>
          ))}
        </Box>
      )}

      {activeCategory === 'uncategorized' && events.length > 0 ? (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: 'block', textAlign: 'center', mt: 1 }}
        >
          Tap a category chip to file each event.
        </Typography>
      ) : null}
    </Box>
  )
}
