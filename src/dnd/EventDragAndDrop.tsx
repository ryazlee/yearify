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
import { Categories, Event } from "./types";

export const EventComponent = ({ task, index }: { task: Event, index: number }) => {
    // Styling for individual task
    const taskStyle = (isDragging: boolean): React.CSSProperties => ({
        userSelect: 'none',
        padding: '12px',
        margin: '0 0 8px 0',
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
            key={task.id}
            draggableId={task.id}
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
                        ...taskStyle(snapshot.isDragging),
                        ...provided.draggableProps.style
                    }}
                >
                    {task.title}
                </div>
            )}
        </Draggable>
    );
};

export const EventDragAndDrop = ({ initialCategories }: { initialCategories: Categories }) => {
    // Initial state with tasks categorized
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

            setCategories({
                ...categories,
                [source.droppableId]: column
            });
        } else {
            // Move item between columns
            const sourceColumn = Array.from(categories[source.droppableId as keyof typeof categories]);
            const destinationColumn = Array.from(categories[destination.droppableId as keyof typeof categories]);
            const [movedItem] = sourceColumn.splice(source.index, 1);

            destinationColumn.splice(destination.index, 0, movedItem);

            setCategories({
                ...categories,
                [source.droppableId]: sourceColumn,
                [destination.droppableId]: destinationColumn
            });
        }
    };

    // Styling
    const containerStyle: CSSProperties = {
        display: 'flex',
        gap: '16px',
        padding: '20px',
        backgroundColor: '#f4f4f4',
        borderRadius: '8px',
        justifyContent: 'center'
    };

    const columnStyle: CSSProperties = {
        width: '250px',
        backgroundColor: '#ffffff',
        padding: '16px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div style={containerStyle}>
                {Object.entries(categories).map(([columnId, tasks]) => (
                    <Droppable key={columnId} droppableId={columnId}>
                        {(provided: DroppableProvided) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                style={columnStyle}
                            >
                                <h3>{columnId}</h3>
                                {tasks.map((task, index) => (
                                    <EventComponent key={task.id} task={task} index={index} />
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
