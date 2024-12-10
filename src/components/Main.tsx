import React, { useState, useEffect, useMemo, useCallback } from "react";
import { CalendarEvent, CategorizedEvents } from "./types";
import { api } from "../api";
import { categorizeEvents } from "./categorizer/utils";
import DownloadableComponent from "./downloadableImage/DownloadableComponent";
import { EventDragAndDrop } from "./dnd/EventDragAndDrop";
import { AuthButton } from "./auth/AuthButton";
import { CalendarGrid } from "./calendar/CalendarGrid";
import Box from "@mui/material/Box";
import UserStats from "./stats/UserStats";
import { Button, FormControlLabel, Link, Switch, Typography } from "@mui/material";
import { CategorizerModal } from "./dnd/CategorizerModal";

const Footer = () => (
    <Box
        component="footer"
        sx={{
            textAlign: 'center',
            padding: '2rem 0',
        }}
    >
        <Link
            href={`${process.env.PUBLIC_URL}/legal/privacy-policy.txt`}
            underline="hover"
            color="textSecondary"
            target="_blank"
            rel="noopener"
            sx={{
                fontSize: '0.75rem',
                marginRight: '1rem',
            }}
        >
            Privacy Policy
        </Link>
        <Link
            href={`${process.env.PUBLIC_URL}/legal/terms-of-service.txt`}
            underline="hover"
            color="textSecondary"
            target="_blank"
            rel="noopener"
            sx={{
                fontSize: '0.75rem',
            }}
        >
            Terms of Service
        </Link>
    </Box>
);

const Header = () => (
    <Box
        component="header"
        sx={{
            alignItems: "center",
            padding: "20px",
        }}
    >
        <Typography variant="h4">✨ Yearify ✨</Typography>
    </Box>
);

const LandingPage = () => (
    <Box
        sx={{
            maxWidth: "700px",
            margin: "0 auto",
            textAlign: "center",
            padding: "40px 20px",
        }}
    >
        <Header />
        <Typography variant="body1" gutterBottom>
            Yearify helps you rediscover your year through your Google Calendar events! 📅
        </Typography>
        <Typography variant="body1" gutterBottom>
            We'll fetch your events from the past year, organize them, and turn them into a clear, colorful snapshot of your time. It's your year, visualized! 🖼️
        </Typography>
        <Box
            component="img"
            src={`${process.env.PUBLIC_URL}/media/demo-image.png`}
            alt="Demo visualization"
            sx={{
                width: "100%",
                maxWidth: "500px",
                height: "auto",
                margin: "20px 0",
            }}
        />
        <Typography variant="body1">
            Click the button below to connect your Google Calendar and get started today!
        </Typography>
    </Box>
);

function Main() {
    const [authenticated, setAuthenticated] = useState(false);
    const [categorizedEvents, setCategorizedEvents] = useState<CategorizedEvents | null>(null);
    const [showStats, setShowStats] = useState(false);
    const [showCategorizerModal, setShowCategorizerModal] = useState(false);

    const allEvents = useMemo(() => {
        if (!categorizedEvents) return [];
        return Object.values(categorizedEvents).flat();
    }, [categorizedEvents]);

    const fetchCalendarEvents = useCallback(async () => {
        try {
            const events = await api.getCalendarEvents();
            const calendarEvents: CalendarEvent[] = events.map((event: any) => {
                const startDateTime = new Date(event.start?.dateTime || event.start?.date);
                startDateTime.setFullYear(2024);
                const endDateTime = new Date(event.end?.dateTime || event.end?.date);
                endDateTime.setFullYear(2024);

                return {
                    id: event.id,
                    summary: event.summary,
                    start: startDateTime.toISOString(),
                    end: endDateTime.toISOString(),
                    description: event.description,
                    location: event.location,
                };
            });
            setCategorizedEvents(categorizeEvents(calendarEvents));
        } catch (error) {
            console.error("Error fetching events:", error);
        }
    }, []);

    useEffect(() => {
        if (authenticated) {
            fetchCalendarEvents();
        }
    }, [authenticated, fetchCalendarEvents]);

    const onUpdateCategoriesHandler = (updatedCategorizedEvents: CategorizedEvents) => {
        setCategorizedEvents(updatedCategorizedEvents);
    };

    return (
        <Box paddingBottom={10}>
            {!authenticated ? (
                <>
                    <LandingPage />
                    <AuthButton isAuthenticated={authenticated} callback={() => setAuthenticated(true)} />
                    <Footer />
                </>
            ) : (
                <>
                    <Header />
                    <AuthButton isAuthenticated={authenticated} callback={() => setAuthenticated(false)} />
                    <Box>
                        Calendar Events Count: {allEvents.length}
                    </Box>
                    {categorizedEvents && (
                        <>
                            <Button onClick={() => setShowCategorizerModal(true)} variant="contained" color="primary">
                                Categorize Events
                            </Button>
                            <CategorizerModal
                                initialCategorizedEvents={categorizedEvents}
                                setCategories={onUpdateCategoriesHandler}
                                isOpen={showCategorizerModal}
                                onModalClose={() => setShowCategorizerModal(false)}
                                category="fitness" // Replace with the desired category
                            />

                            <EventDragAndDrop initialCategories={categorizedEvents} onUpdateCategories={onUpdateCategoriesHandler} />
                        </>
                    )}
                    {categorizedEvents && (
                        <>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={showStats}
                                        onChange={() => setShowStats(!showStats)}
                                        name="showStats"
                                        color="primary"
                                    />
                                }
                                label={showStats ? "Hide Stats" : "Show Stats"}
                            />
                            <DownloadableComponent>
                                <CalendarGrid categorizedEvents={categorizedEvents} />
                                {showStats && <UserStats categorizedEvents={categorizedEvents} />}
                            </DownloadableComponent>
                        </>
                    )}
                </>
            )}
        </Box>
    );
}

export default Main;