import { useState, useEffect } from "react";
import { CalendarEvent, CategorizedEvents } from "./types";
import { api } from "../api";
import { categorizeEvents } from "./categorizer/utils";
import DownloadableComponent from "./downloadableImage/DownloadableComponent";
import { EventDragAndDrop } from "./dnd/EventDragAndDrop";
import { AuthButton } from "./auth/AuthButton";
import { CalendarGrid } from "./calendar/CalendarGrid";
import Box from "@mui/material/Box";
import UserStats from "./stats/UserStats";
import { FormControlLabel, Link, Switch, Typography } from "@mui/material";

const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
                position: "fixed",
                bottom: 5,
                right: 10,
            }}
        >
            <Link
                href="https://ryazlee.github.io/yearify/legal/privacy-policy.txt"
                underline="hover"
                color="textSecondary"
                target="_blank"
                rel="noopener"
                sx={{
                    fontSize: "0.875rem", // Small font size
                }}
            >
                Privacy Policy
            </Link>
        </Box>
    );
};

const Header = () => {
    return (
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
}

const LandingPage = () => {
    return (
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
};



function Main() {
    const [authenticated, setAuthenticated] = useState(false);
    const [categorizedEvents, setCategorizedEvents] = useState<CategorizedEvents | null>(null);
    const [allEvents, setAllEvents] = useState<CalendarEvent[]>([]);
    const [showStats, setShowStats] = useState(false);

    useEffect(() => {
        if (authenticated) {
            fetchCalendarEvents();
        }
    }, [authenticated]);

    useEffect(() => {
        if (categorizedEvents) {
            setAllEvents(getAllEvents());
        }
    }, [categorizedEvents]);

    const getAllEvents = () => {
        const events: CalendarEvent[] = [];
        if (categorizedEvents) {
            for (const [_, eventsInCategory] of Object.entries(categorizedEvents)) {
                events.push(...eventsInCategory);
            }
        }
        return events;
    };

    const fetchCalendarEvents = async () => {
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
            const categorizedEvents = categorizeEvents(calendarEvents);
            setCategorizedEvents(categorizedEvents);
        } catch (error) {
            console.error("Error fetching events:", error);
        }
    };

    const onUpdateCategoriesHandler = (categorizedEvents: CategorizedEvents) => {
        setCategorizedEvents(categorizedEvents);
        setAllEvents(getAllEvents());
    };

    return (
        <div>
            {!authenticated ? (
                <>
                    <LandingPage />
                    <AuthButton isAuthenticated={authenticated} callback={() => setAuthenticated(!authenticated)} />
                </>
            ) : (
                <>
                    <Header />
                    <AuthButton isAuthenticated={authenticated} callback={() => setAuthenticated(!authenticated)} />
                    <Box>
                        Calendar Events Count: {getAllEvents().length}
                    </Box>
                    {categorizedEvents && (
                        <EventDragAndDrop initialCategories={categorizedEvents} onUpdateCategories={onUpdateCategoriesHandler} />
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
                                <CalendarGrid calendarEvents={allEvents} />
                                {showStats && <UserStats calendarEvents={allEvents} />}
                            </DownloadableComponent>
                        </>
                    )}
                </>
            )}
            <Footer />
        </div>
    );
}

export default Main;