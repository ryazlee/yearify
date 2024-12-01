import React, { useState } from "react";
import {
    DragDropContext,
    Droppable,
    Draggable,
    DropResult,
    DroppableProvided,
    DraggableProvided,
    DraggableStateSnapshot
} from "react-beautiful-dnd";

// Define an interface for the task
interface Task {
    id: number;
    title: string;
}

// Initial tasks with explicit type
const initialTasks: Task[] = [
    {
        id: 1,
        title: "Task 1",
    },
    {
        id: 2,
        title: "Task 2",
    },
    {
        id: 3,
        title: "Task 3",
    },
];

function DndScratch() {
    // Specify the type for useState
    const [tasks, setTasks] = useState<Task[]>(initialTasks);

    // Add type annotations for the onDragEnd handler
    const onDragEnd = (result: DropResult) => {
        // Early return if no destination
        if (!result.destination) return;

        // Create a copy of tasks
        const items = Array.from(tasks);

        // Remove the dragged item and insert it at the new position
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        // Update state
        setTasks(items);
    };

    // Styling constants
    const containerStyle: React.CSSProperties = {
        maxWidth: '300px',
        margin: '0 auto',
        padding: '20px',
        backgroundColor: '#f4f4f4',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    };

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
        <div style={containerStyle}>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="taskList">
                    {(provided: DroppableProvided) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                        >
                            {tasks.map((task, index) => (
                                <Draggable
                                    key={task.id}
                                    draggableId={task.id.toString()}
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
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
}

export default DndScratch;