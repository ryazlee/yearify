import React, { CSSProperties, useState } from "react";
import {
    DragDropContext,
    Droppable,
    Draggable,
    DropResult,
    DroppableProvided,
    DraggableProvided,
    DraggableStateSnapshot
} from "react-beautiful-dnd";
import { CalendarEvent, CategorizedEvents, CATEGORY_COLORS } from "../types";

export const EventComponent = ({ calendarEvent, index }: { calendarEvent: CalendarEvent, index: number }) => {
    const eventStyle = (isDragging: boolean): React.CSSProperties => ({
        userSelect: 'none',
        padding: '5px',
        margin: '0 0 4px 0',
        borderRadius: '4px',
        backgroundColor: isDragging ? '#e6f3ff' : '#ffffff',
        border: '1px solid #ddd',
        boxShadow: isDragging
            ? '0 4px 6px rgba(0,0,0,0.1)'
            : '0 2px 3px rgba(0,0,0,0.05)',
        transition: 'all 0.2s ease'
    });

    return (
        <Draggable
            key={calendarEvent.id}
            draggableId={calendarEvent.id}
            index={index}
        >
            {(
                provided: DraggableProvided,
                snapshot: DraggableStateSnapshot
            ) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                        ...eventStyle(snapshot.isDragging),
                        ...provided.draggableProps.style
                    }}
                >
                    {calendarEvent.summary}
                </div>
            )}
        </Draggable>
    );
};

export const EventDragAndDrop = ({ initialCategories, onUpdateCategories }: { initialCategories: CategorizedEvents, onUpdateCategories: (categorizedEvents: CategorizedEvents) => void }) => {
    const [categories, setCategories] = useState(initialCategories);

    // Handle drag and drop
    const onDragEnd = (result: DropResult) => {
        const { source, destination } = result;

        // If no destination, do nothing
        if (!destination) return;

        // If the item was dropped in the same column, reorder within the column
        if (source.droppableId === destination.droppableId) {
            const column = Array.from(categories[source.droppableId as keyof typeof categories]);
            const [movedItem] = column.splice(source.index, 1);
            column.splice(destination.index, 0, movedItem);
            movedItem.category = source.droppableId;

            const updatedCategories = {
                ...categories,
                [source.droppableId]: column
            };

            setCategories(updatedCategories);
            onUpdateCategories(updatedCategories);
        } else {
            // Move item between columns
            const sourceColumn = Array.from(categories[source.droppableId as keyof typeof categories]);
            const destinationColumn = Array.from(categories[destination.droppableId as keyof typeof categories]);
            const [movedItem] = sourceColumn.splice(source.index, 1);

            destinationColumn.splice(destination.index, 0, movedItem);
            movedItem.category = destination.droppableId;

            const updatedCategories = {
                ...categories,
                [source.droppableId]: sourceColumn,
                [destination.droppableId]: destinationColumn
            };

            setCategories(updatedCategories);
            onUpdateCategories(updatedCategories);
        }
    };

    // Styling
    const containerStyle: CSSProperties = {
        display: 'flex',
        gap: '8px',
        padding: '10px',
        borderRadius: '8px',
        justifyContent: 'center'
    };

    const columnStyle: CSSProperties = {
        width: '250px',
        padding: '8px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div style={containerStyle}>
                {Object.entries(categories).map(([columnId, calendarEvents]) => (
                    <Droppable key={columnId} droppableId={columnId}>
                        {(provided: DroppableProvided) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                style={{
                                    backgroundColor: CATEGORY_COLORS[columnId],
                                    ...columnStyle
                                }}
                            >
                                <h3>{columnId}</h3>
                                {calendarEvents.map((calendarEvent, index) => (
                                    <EventComponent key={calendarEvent.id} calendarEvent={calendarEvent} index={index} />
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                ))}
            </div>
        </DragDropContext >
    );
};
