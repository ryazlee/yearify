import React, { useState } from "react";
import {
    DragDropContext,
    Droppable,
    Draggable,
    DropResult,
} from "react-beautiful-dnd";
import { Box, Typography, IconButton, Paper } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { CalendarEvent, CategorizedEvents, CATEGORY_COLORS } from "../types";

// Individual Event Component
const EventComponent = ({
    calendarEvent,
    index,
    onDeleteCallback,
}: {
    calendarEvent: CalendarEvent;
    index: number;
    onDeleteCallback: (id: string) => void;
}) => {
    return (
        <Draggable draggableId={calendarEvent.id} index={index}>
            {(provided, snapshot) => (
                <Paper
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    elevation={snapshot.isDragging ? 6 : 1}
                    sx={{
                        p: 1,
                        mb: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        bgcolor: snapshot.isDragging ? "action.hover" : "background.paper",
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 1,
                    }}
                >
                    <Typography
                        variant="body2"
                        sx={{
                            maxWidth: 150,
                            overflow: "hidden",
                            whiteSpace: "wrap",
                            textOverflow: "ellipsis",
                        }}
                    >
                        {calendarEvent.summary}
                    </Typography>
                    <IconButton
                        size="small"
                        color="error"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDeleteCallback(calendarEvent.id);
                        }}
                        aria-label="Delete Event"
                    >
                        <DeleteIcon fontSize="small" sx={{ color: "gray" }} />
                    </IconButton>
                </Paper>
            )}
        </Draggable>
    );
};

// Drag and Drop Container
export const EventDragAndDrop = ({
    initialCategories,
    onUpdateCategories,
}: {
    initialCategories: CategorizedEvents;
    onUpdateCategories: (categorizedEvents: CategorizedEvents) => void;
}) => {
    const [categories, setCategories] = useState<CategorizedEvents>(
        initialCategories
    );

    const onDragEnd = (result: DropResult) => {
        const { source, destination } = result;

        // If dropped outside any droppable area, do nothing
        if (!destination) return;

        // If dropped in the same position, do nothing
        if (
            source.droppableId === destination.droppableId &&
            source.index === destination.index
        ) {
            return;
        }

        // Create a deep copy of the categories
        const updatedCategories = JSON.parse(JSON.stringify(categories));

        const sourceColumn = updatedCategories[source.droppableId];
        const destinationColumn = updatedCategories[destination.droppableId];
        const [movedItem] = sourceColumn.splice(source.index, 1);

        // If moving within the same column
        if (source.droppableId === destination.droppableId) {
            sourceColumn.splice(destination.index, 0, movedItem);
        } else {
            // If moving to a different column
            movedItem.category = destination.droppableId;
            destinationColumn.splice(destination.index, 0, movedItem);
        }

        // Update the state
        setCategories(updatedCategories);
        onUpdateCategories(updatedCategories);
    };


    const onDeleteCallbackHandler = (id: string) => {
        const updatedCategories = { ...categories };
        for (const category in updatedCategories) {
            updatedCategories[category as keyof CategorizedEvents] = updatedCategories[category as keyof CategorizedEvents].filter(
                (event) => event.id !== id
            );
        }

        setCategories(updatedCategories);
        onUpdateCategories(updatedCategories);
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Box
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 2,
                    p: 2,
                    justifyContent: "center",
                }}
            >
                {Object.entries(categories).map(([columnId, calendarEvents]) => (
                    <Droppable key={columnId} droppableId={columnId}>
                        {(provided) => (
                            <Box
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                sx={{
                                    bgcolor: CATEGORY_COLORS[columnId],
                                    p: 2,
                                    flex: "1 1 300px",
                                    maxWidth: 400,
                                    height: 400,
                                    borderRadius: 1,
                                    boxShadow: 1,
                                    overflowY: "auto",
                                    "@media (max-width: 600px)": {
                                        flex: "1 1 45%",
                                    },
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    sx={{
                                        mb: 2,
                                        bgcolor: "background.default",
                                        px: 1,
                                        py: 0.5,
                                        borderRadius: 1,
                                    }}
                                >
                                    {columnId} ({calendarEvents.length})
                                </Typography>
                                {calendarEvents.map((calendarEvent, index) => (
                                    <EventComponent
                                        key={calendarEvent.id}
                                        calendarEvent={calendarEvent}
                                        index={index}
                                        onDeleteCallback={onDeleteCallbackHandler}
                                    />
                                ))}
                                {provided.placeholder}
                            </Box>
                        )}
                    </Droppable>
                ))}
            </Box>
        </DragDropContext>
    );
};

export default EventDragAndDrop;
