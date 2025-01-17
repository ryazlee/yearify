import React, { useEffect, useState } from "react";
import { Category, CategorizedEvents, CATEGORIES } from "../types";
import { Modal, Box, Button, Typography, IconButton, useMediaQuery, useTheme } from "@mui/material";
import LinkIcon from '@mui/icons-material/Link';

const CategorizationButtons = ({
    onCategorySelect,
    intialCategory,
}: {
    onCategorySelect: (category: Category) => void;
    intialCategory: Category;
}) => {
    return (
        <Box display="flex" gap="10px" flexWrap="wrap" justifyContent="center" marginBottom="20px">
            {CATEGORIES.map((category) => (
                <Button
                    key={category}
                    disabled={category === intialCategory}
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => onCategorySelect(category as Category)}
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
    setCategorizedEvents: React.Dispatch<React.SetStateAction<CategorizedEvents | null>>;
    initialCategory: Category;
}) => {
    const [currIndex, setCurrIndex] = useState(0);
    const [currEvent, setCurrEvent] = useState(categorizedEvents[initialCategory][currIndex]);

    useEffect(() => {
        setCurrEvent(categorizedEvents[initialCategory][currIndex]);
    }, [currIndex, categorizedEvents, initialCategory]);

    const handleNextEvent = () => {
        if (currIndex < categorizedEvents[initialCategory].length - 1) {
            setCurrIndex((prev) => prev + 1);
        }
    };

    const deleteEvent = (eventId: string) => {
        const updatedEvents: CategorizedEvents = {
            ...categorizedEvents,
            [initialCategory]: categorizedEvents[initialCategory].filter((event) => event.id !== eventId),
        };

        setCategorizedEvents(updatedEvents);
    }

    const categorizeEvent = (category: Category) => {
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
        <Box sx={{ maxWidth: "100%", overflow: "hidden" }}>
            <Typography variant="h5" marginBottom="10px">
                {currEvent.summary || "Unnamed Event"} <IconButton onClick={() => { window.open(currEvent.htmlLink) }}>
                    <LinkIcon />
                </IconButton>
            </Typography>
            <Typography
                variant="body1"
                sx={{
                    maxWidth: "100%",
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 4,
                }}
                marginBottom={"10px"}
                textOverflow={"ellipsis"}>
                {currEvent.description || "No description available."}
            </Typography>
            <Typography variant="body2" marginBottom="10px">
                Location: {currEvent.location || "No location specified."}
            </Typography>
            <Typography variant="body2" marginBottom="20px">
                {(new Date(currEvent.start)).toLocaleDateString()} - {(new Date(currEvent.end)).toLocaleDateString()}
            </Typography>
            <CategorizationButtons onCategorySelect={categorizeEvent} intialCategory={initialCategory} />
            <Button
                variant="outlined"
                color="primary"
                size="small"
                onClick={handleNextEvent}
                disabled={currIndex >= categorizedEvents[initialCategory].length - 1}
            >
                Skip Event
            </Button>
            <Button
                variant="outlined"
                color="primary"
                size="small"
                onClick={() => deleteEvent(currEvent.id)}
                style={{ marginLeft: "10px" }}
            >
                Delete Event
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
    category: Category;
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const [categorizedEvents, setCategorizedEvents] = useState<CategorizedEvents | null>(null);

    useEffect(() => {
        setCategorizedEvents(initialCategorizedEvents);
    }, [initialCategorizedEvents]);

    const saveCategoriesHandler = () => {
        if (!categorizedEvents) {
            return;
        }
        setCategories({ ...categorizedEvents });
        onModalClose();
    };

    const onModalCloseHandler = () => {
        setCategorizedEvents(initialCategorizedEvents);
        onModalClose();
    }

    const style = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: isMobile ? "90%" : "600px",
        bgcolor: "background.paper",
        border: "2px solid #000",
        boxShadow: 24,
        p: 4,
    };

    if (!categorizedEvents) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Modal open={isOpen} onClose={onModalClose}>
            <Box sx={style}>
                <EventCategorizer
                    categorizedEvents={categorizedEvents}
                    setCategorizedEvents={setCategorizedEvents}
                    initialCategory={category}
                />
                <Box display="flex" justifyContent="space-between" marginTop="20px">
                    <Button variant="contained" color="secondary" size="small" onClick={saveCategoriesHandler}>
                        Save Categories
                    </Button>
                    <Button variant="outlined" color="secondary" size="small" onClick={onModalCloseHandler}>
                        Close
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};