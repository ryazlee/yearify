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

export const EventComponent = ({
    calendarEvent,
    index,
    onDeleteCallback,
}: {
    calendarEvent: CalendarEvent;
    index: number;
    onDeleteCallback: (id: string) => void;
}) => {
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
        transition: 'all 0.2s ease',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    });

    const textStyle: React.CSSProperties = {
        wordWrap: 'break-word',
        maxWidth: '150px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    };

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
                        ...provided.draggableProps.style,
                    }}
                >
                    <span style={textStyle}>{calendarEvent.summary}</span>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDeleteCallback(calendarEvent.id);
                        }}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#888',
                            cursor: 'pointer',
                            fontSize: '12px',
                            marginLeft: '8px',
                        }}
                        aria-label="Delete Event"
                    >
                        ✕
                    </button>
                </div>
            )}
        </Draggable>
    );
};

export const EventDragAndDrop = ({
    initialCategories,
    onUpdateCategories,
}: {
    initialCategories: CategorizedEvents;
    onUpdateCategories: (categorizedEvents: CategorizedEvents) => void;
}) => {
    const [categories, setCategories] = useState<CategorizedEvents>(initialCategories);

    const onDragEnd = (result: DropResult) => {
        const { source, destination } = result;

        if (!destination) return;

        if (source.droppableId === destination.droppableId) {
            const column = Array.from(categories[source.droppableId as keyof CategorizedEvents]);
            const [movedItem] = column.splice(source.index, 1);
            column.splice(destination.index, 0, movedItem);
            movedItem.category = source.droppableId;

            const updatedCategories = {
                ...categories,
                [source.droppableId as keyof CategorizedEvents]: column
            };

            setCategories(updatedCategories);
            onUpdateCategories(updatedCategories);
        } else {
            const sourceColumn = Array.from(categories[source.droppableId as keyof CategorizedEvents]);
            const destinationColumn = Array.from(categories[destination.droppableId as keyof CategorizedEvents]);
            const [movedItem] = sourceColumn.splice(source.index, 1);

            destinationColumn.splice(destination.index, 0, movedItem);
            movedItem.category = destination.droppableId;

            const updatedCategories = {
                ...categories,
                [source.droppableId as keyof CategorizedEvents]: sourceColumn,
                [destination.droppableId as keyof CategorizedEvents]: destinationColumn
            };

            setCategories(updatedCategories);
            onUpdateCategories(updatedCategories);
        }
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

    // Styling
    const containerStyle: CSSProperties = {
        display: 'flex',
        gap: '8px',
        padding: '10px',
        borderRadius: '8px',
        justifyContent: 'center',
        flexWrap: 'wrap',
    };

    const columnStyle: CSSProperties = {
        maxWidth: '250px',
        maxHeight: '400px',
        padding: '8px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '10px',
        overflowY: 'auto',
    };

    const headerStyle: CSSProperties = {
        fontSize: '14px',
        fontWeight: 'bold',
        backgroundColor: '#fff',
        padding: '5px',
        position: 'sticky',
        top: 0,
        zIndex: 1,
        borderBottom: '1px solid #ddd',
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
                                    ...columnStyle,
                                }}
                            >
                                <h3 style={headerStyle}>{columnId}</h3>
                                {calendarEvents.map((calendarEvent, index) => (
                                    <EventComponent
                                        key={calendarEvent.id}
                                        calendarEvent={calendarEvent}
                                        index={index}
                                        onDeleteCallback={onDeleteCallbackHandler}
                                    />
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                ))}
            </div>
        </DragDropContext>
    );
};

