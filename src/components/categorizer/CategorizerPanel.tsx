import { useState } from 'react'
import { Box, Button, Collapse, Typography, useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { UNCATEGORIZED_ID } from '../../lib/categories'
import type { CategorizedEvents } from '../types'
import { countEvents } from '../categorizer/utils'
import { CategoriesSettingsModal } from './CategoriesSettingsModal'
import { DesktopCategoryBoard } from './DesktopCategoryBoard'
import { MobileEventList } from './MobileEventList'
import { ReviewDeck } from './ReviewDeck'

type Props = {
  categorizedEvents: CategorizedEvents
  onUpdate: (next: CategorizedEvents) => void
  canUndo?: boolean
  onUndo?: () => void
}

export default function CategorizerPanel({
  categorizedEvents,
  onUpdate,
  canUndo = false,
  onUndo,
}: Props) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const uncategorizedCount = categorizedEvents[UNCATEGORIZED_ID]?.length ?? 0
  const total = countEvents(categorizedEvents)
  const needsReview = uncategorizedCount > 0

  const [editing, setEditing] = useState(false)
  const [reviewOpen, setReviewOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)

  return (
    <section
      className={`catPanel${needsReview ? ' catPanel--attention' : ''}`}
      aria-label="Refine categories"
    >
      <Box className="catPanel__header">
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <p className="section-label" style={{ marginBottom: 4 }}>
            Refine
          </p>
          <Typography sx={{ fontSize: '0.9rem', color: 'text.secondary' }}>
            {needsReview
              ? `${uncategorizedCount} event${uncategorizedCount === 1 ? '' : 's'} still need a category`
              : `All ${total} events are categorized`}
          </Typography>
        </Box>

        <Box className="catPanel__actions">
          {canUndo && onUndo ? (
            <Button
              variant="text"
              size="small"
              onClick={onUndo}
              sx={{ color: 'text.secondary', flexShrink: 0 }}
            >
              Undo
            </Button>
          ) : null}
          <Button
            variant="text"
            size="small"
            onClick={() => setSettingsOpen(true)}
            sx={{ color: 'text.secondary', flexShrink: 0 }}
          >
            Categories
          </Button>
          {needsReview ? (
            <Button
              variant="contained"
              size="medium"
              onClick={() => setReviewOpen(true)}
              fullWidth={isMobile}
            >
              Review
            </Button>
          ) : null}
          <Button
            variant="text"
            size="small"
            onClick={() => setEditing((value) => !value)}
            sx={{ color: 'text.secondary', flexShrink: 0 }}
          >
            {editing ? 'Done' : 'Edit all'}
          </Button>
        </Box>
      </Box>

      <Collapse in={editing} timeout="auto" unmountOnExit>
        <Box className="catPanel__body">
          {isMobile ? (
            <MobileEventList
              categorizedEvents={categorizedEvents}
              onUpdate={onUpdate}
              focusCategory={needsReview ? UNCATEGORIZED_ID : undefined}
            />
          ) : (
            <DesktopCategoryBoard
              categorizedEvents={categorizedEvents}
              onUpdate={onUpdate}
            />
          )}
        </Box>
      </Collapse>

      <ReviewDeck
        isOpen={reviewOpen}
        onClose={() => setReviewOpen(false)}
        categorizedEvents={categorizedEvents}
        onUpdate={onUpdate}
        canUndo={canUndo}
        onUndo={onUndo}
      />

      <CategoriesSettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </section>
  )
}
