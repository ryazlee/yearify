import { useEffect, useState } from 'react'
import {
  DragDropContext,
  Draggable,
  Droppable,
  type DropResult,
} from 'react-beautiful-dnd'
import { Box, Chip, IconButton, Paper, Typography } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { useCategories } from '../../contexts/CategoryContext'
import { UNCATEGORIZED_ID, type Category } from '../../lib/categories'
import type { CalendarEvent, CategorizedEvents } from '../types'
import {
  addEventCategory,
  deleteEvent,
  eventCategories,
  removeEventCategory,
  setEventCategories,
  toggleEventCategory,
} from '../categorizer/utils'

function EventCard({
  calendarEvent,
  index,
  columnId,
  onRemoveFromColumn,
  onDelete,
  onToggleCategory,
  actionLabels,
  colors,
}: {
  calendarEvent: CalendarEvent
  index: number
  columnId: Category
  onRemoveFromColumn: (id: string) => void
  onDelete: (id: string) => void
  onToggleCategory: (eventId: string, categoryId: Category) => void
  actionLabels: Array<{ id: string; label: string }>
  colors: Record<string, string>
}) {
  const assigned = eventCategories(calendarEvent)

  return (
    <Draggable draggableId={`${columnId}:${calendarEvent.id}`} index={index}>
      {(provided, snapshot) => (
        <Paper
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          elevation={0}
          sx={{
            p: 1,
            mb: 1,
            bgcolor: snapshot.isDragging ? 'action.hover' : 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1.5,
            boxShadow: snapshot.isDragging
              ? '0 4px 16px rgba(17, 24, 39, 0.12)'
              : 'none',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: 1,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {calendarEvent.summary || 'Untitled event'}
            </Typography>
            <IconButton
              size="small"
              aria-label={
                columnId === UNCATEGORIZED_ID
                  ? 'Remove event'
                  : 'Remove from category'
              }
              title={
                columnId === UNCATEGORIZED_ID
                  ? 'Remove event'
                  : 'Remove from this category'
              }
              onClick={(e) => {
                e.stopPropagation()
                if (columnId === UNCATEGORIZED_ID) onDelete(calendarEvent.id)
                else onRemoveFromColumn(calendarEvent.id)
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
          {columnId === UNCATEGORIZED_ID ? (
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 0.5,
                mt: 0.75,
              }}
            >
              {actionLabels.map((category) => {
                const selected = assigned.includes(category.id)
                return (
                  <Chip
                    key={category.id}
                    size="small"
                    label={category.label}
                    clickable
                    onClick={(e) => {
                      e.stopPropagation()
                      onToggleCategory(calendarEvent.id, category.id)
                    }}
                    sx={{
                      height: 22,
                      fontSize: '0.7rem',
                      bgcolor: selected ? colors[category.id] : 'transparent',
                      border: '1px solid',
                      borderColor: selected ? 'transparent' : 'divider',
                      fontWeight: selected ? 600 : 500,
                    }}
                  />
                )
              })}
            </Box>
          ) : assigned.length > 1 ? (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: 'block', mt: 0.5 }}
            >
              Also{' '}
              {assigned
                .filter((id) => id !== columnId)
                .map(
                  (id) =>
                    actionLabels.find((c) => c.id === id)?.label ?? id,
                )
                .join(', ')}
            </Typography>
          ) : null}
        </Paper>
      )}
    </Draggable>
  )
}

type Props = {
  categorizedEvents: CategorizedEvents
  onUpdate: (next: CategorizedEvents) => void
}

export function DesktopCategoryBoard({ categorizedEvents, onUpdate }: Props) {
  const { categories, actionCategories, colors } = useCategories()
  const [board, setBoard] = useState(categorizedEvents)

  useEffect(() => {
    setBoard(categorizedEvents)
  }, [categorizedEvents])

  const totalUnique = new Set(
    Object.values(board)
      .flat()
      .map((event) => event.id),
  ).size
  const columnIds = categories.map((c) => c.id)
  const actionLabels = actionCategories.map((c) => ({
    id: c.id,
    label: c.label,
  }))

  const commit = (next: CategorizedEvents) => {
    setBoard(next)
    onUpdate(next)
  }

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result
    if (!destination) return
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return
    }

    const eventId = draggableId.includes(':')
      ? draggableId.slice(draggableId.indexOf(':') + 1)
      : draggableId
    const destKey = destination.droppableId as Category
    const sourceKey = source.droppableId as Category

    if (destKey === UNCATEGORIZED_ID) {
      commit(setEventCategories(board, eventId, [], categories))
      return
    }

    // Dropping onto a category adds it. Leaving another category column
    // removes that one, so a normal drag still feels like a move while
    // chips / extra drops can stack multiple categories.
    let next = addEventCategory(board, eventId, destKey, categories)
    if (sourceKey !== UNCATEGORIZED_ID && sourceKey !== destKey) {
      next = removeEventCategory(next, eventId, sourceKey, categories)
    }
    commit(next)
  }

  const labelFor = (id: string) =>
    categories.find((c) => c.id === id)?.label ?? id

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Box className="catBoard">
        {columnIds.map((columnId) => (
          <Droppable key={columnId} droppableId={columnId}>
            {(provided) => (
              <Box
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="catBoard__column"
                sx={{ bgcolor: colors[columnId] }}
              >
                <Typography className="catBoard__heading">
                  {labelFor(columnId)}
                  <span>
                    {(board[columnId] ?? []).length}/{totalUnique}
                  </span>
                </Typography>
                {(board[columnId] ?? []).map((calendarEvent, index) => (
                  <EventCard
                    key={`${columnId}:${calendarEvent.id}`}
                    calendarEvent={calendarEvent}
                    index={index}
                    columnId={columnId}
                    actionLabels={actionLabels}
                    colors={colors}
                    onRemoveFromColumn={(id) =>
                      commit(
                        removeEventCategory(board, id, columnId, categories),
                      )
                    }
                    onDelete={(id) =>
                      commit(deleteEvent(board, id, categories))
                    }
                    onToggleCategory={(eventId, categoryId) =>
                      commit(
                        toggleEventCategory(
                          board,
                          eventId,
                          categoryId,
                          categories,
                        ),
                      )
                    }
                  />
                ))}
                {provided.placeholder}
              </Box>
            )}
          </Droppable>
        ))}
      </Box>
    </DragDropContext>
  )
}
