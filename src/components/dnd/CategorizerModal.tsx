import React, { useEffect, useState } from "react";
import { CategorizedEvents } from "../types";
import { Modal, Box, Button, Typography, IconButton } from "@mui/material";
import LinkIcon from '@mui/icons-material/Link';

const CategorizationButtons = ({
    onCategorySelect,
}: {
    onCategorySelect: (category: keyof CategorizedEvents) => void;
}) => {
    return (
        <Box display="flex" gap="10px" flexWrap="wrap" justifyContent="center" marginBottom="20px">
            {["travel", "fitness", "social", "personal"].map((category) => (
                <Button
                    key={category}
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => onCategorySelect(category as keyof CategorizedEvents)}
                >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                </Button>
            ))}
        </Box>
    );
};

const EventCategorizer = ({
    categorizedEvents,
    setCategorizedEvents,
    initialCategory,
}: {
    categorizedEvents: CategorizedEvents;
    setCategorizedEvents: React.Dispatch<React.SetStateAction<CategorizedEvents>>;
    initialCategory: keyof CategorizedEvents;
}) => {
    const [currIndex, setCurrIndex] = useState(0);
    const [currEvent, setCurrEvent] = useState(categorizedEvents[initialCategory][currIndex]);

    useEffect(() => {
        setCurrEvent(categorizedEvents[initialCategory][currIndex]);
    }, [currIndex, categorizedEvents[initialCategory]]);

    const handleNextEvent = () => {
        if (currIndex < categorizedEvents[initialCategory].length - 1) {
            setCurrIndex((prev) => prev + 1);
        }
    };

    const categorizeEvent = (category: keyof CategorizedEvents) => {
        if (!currEvent) return;

        const updatedCurrEvent = { ...currEvent, category };

        const updatedEvents: CategorizedEvents = {
            ...categorizedEvents,
            [initialCategory]: categorizedEvents[initialCategory].filter((_, index) => index !== currIndex),
            [category]: [...categorizedEvents[category], updatedCurrEvent],
        };

        setCategorizedEvents(updatedEvents);
    };

    if (!currEvent) {
        return <Typography>No more events in the {initialCategory} category!</Typography>;
    }

    return (
        <Box>
            <Typography variant="h6" marginBottom="10px">
                {currEvent.summary || "Unnamed Event"} <IconButton onClick={() => { window.open(currEvent.htmlLink) }}>
                    <LinkIcon />
                </IconButton>
            </Typography>
            <Typography variant="body1" marginBottom="10px" textOverflow={"ellipsis"}>
                {currEvent.description || "No description available."}
            </Typography>
            <Typography variant="body2" marginBottom="10px">
                Location: {currEvent.location || "No location specified."}
            </Typography>
            <Typography variant="body2" marginBottom="20px">
                {(new Date(currEvent.start)).toLocaleDateString()} - {(new Date(currEvent.end)).toLocaleDateString()}
            </Typography>
            <CategorizationButtons onCategorySelect={categorizeEvent} />
            <Button
                variant="outlined"
                color="primary"
                size="small"
                onClick={handleNextEvent}
                disabled={currIndex >= categorizedEvents[initialCategory].length - 1}
            >
                Skip Event
            </Button>
        </Box>
    );
};

export default EventCategorizer;

export const CategorizerModal = ({
    isOpen,
    onModalClose,
    initialCategorizedEvents,
    setCategories,
    category,
}: {
    isOpen: boolean;
    onModalClose: () => void;
    initialCategorizedEvents: CategorizedEvents;
    setCategories: (categorizedEvents: CategorizedEvents) => void;
    category: keyof CategorizedEvents;
}) => {
    const [categorizedEvents, setCategorizedEvents] = useState<CategorizedEvents>({ ...initialCategorizedEvents });

    const saveCategories = () => {
        setCategories({ ...categorizedEvents });
        onModalClose();
    };

    const style = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        maxWidth: 500,
        bgcolor: "background.paper",
        border: "2px solid #000",
        boxShadow: 24,
        p: 4,
    };

    return (
        <Modal open={isOpen} onClose={onModalClose}>
            <Box sx={style}>
                <EventCategorizer
                    categorizedEvents={categorizedEvents}
                    setCategorizedEvents={setCategorizedEvents}
                    initialCategory={category}
                />
                <Box display="flex" justifyContent="space-between" marginTop="20px">
                    <Button variant="contained" color="secondary" size="small" onClick={saveCategories}>
                        Save Categories
                    </Button>
                    <Button variant="outlined" color="secondary" size="small" onClick={onModalClose}>
                        Close
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};