import { useEffect, useState } from 'react'
import {
  DragDropContext,
  Draggable,
  Droppable,
  type DropResult,
} from 'react-beautiful-dnd'
import { Box, IconButton, Paper, Typography } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import {
  CATEGORY_COLORS,
  type CalendarEvent,
  type CategorizedEvents,
  type Category,
} from '../types'
import { deleteEvent, emptyCategorizedEvents } from '../categorizer/utils'

function EventCard({
  calendarEvent,
  index,
  onDelete,
}: {
  calendarEvent: CalendarEvent
  index: number
  onDelete: (id: string) => void
}) {
  return (
    <Draggable draggableId={calendarEvent.id} index={index}>
      {(provided, snapshot) => (
        <Paper
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          elevation={0}
          sx={{
            p: 1,
            mb: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1,
            bgcolor: snapshot.isDragging ? 'action.hover' : 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1.5,
            boxShadow: snapshot.isDragging
              ? '0 4px 16px rgba(17, 24, 39, 0.12)'
              : 'none',
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
            aria-label="Remove event"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(calendarEvent.id)
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
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
  const [categories, setCategories] = useState(categorizedEvents)

  useEffect(() => {
    setCategories(categorizedEvents)
  }, [categorizedEvents])

  const total = Object.values(categories).reduce((sum, list) => sum + list.length, 0)

  const commit = (next: CategorizedEvents) => {
    setCategories(next)
    onUpdate(next)
  }

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result
    if (!destination) return
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return
    }

    const next = emptyCategorizedEvents()
    ;(Object.keys(categories) as Category[]).forEach((key) => {
      next[key] = [...categories[key]]
    })

    const sourceKey = source.droppableId as Category
    const destKey = destination.droppableId as Category
    const [moved] = next[sourceKey].splice(source.index, 1)
    if (!moved) return
    moved.category = destKey
    next[destKey].splice(destination.index, 0, moved)
    commit(next)
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Box className="catBoard">
        {(Object.keys(categories) as Category[]).map((columnId) => (
          <Droppable key={columnId} droppableId={columnId}>
            {(provided) => (
              <Box
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="catBoard__column"
                sx={{ bgcolor: CATEGORY_COLORS[columnId] }}
              >
                <Typography className="catBoard__heading">
                  {columnId}
                  <span>
                    {categories[columnId].length}/{total}
                  </span>
                </Typography>
                {categories[columnId].map((calendarEvent, index) => (
                  <EventCard
                    key={calendarEvent.id}
                    calendarEvent={calendarEvent}
                    index={index}
                    onDelete={(id) => commit(deleteEvent(categories, id))}
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
