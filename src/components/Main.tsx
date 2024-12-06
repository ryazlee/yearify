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
import { FormControlLabel, Switch } from "@mui/material";

const Footer = () => {
    return (
        <footer style={{
            position: 'fixed',
            bottom: 5,
            right: 10,
        }}>
            <a href="https://ryazlee.github.io/yearify/legal/privacy-policy.txt" >
                Privacy Policy
            </a>
        </footer >
    );
};

const LandingPage = () => {
    return (
        <div style={{ width: "600px", margin: "0 auto", textAlign: "center" }}>
            <h1>✨ Welcome to Yearify ✨</h1>
            <p>
                Yearify helps you rediscover your year through your Google Calendar events! 📅
            </p>
            <p>
                We'll fetch your events from the past year, organize them, and turn them into a clear, colorful snapshot of your time. It's your year, visualized! 🖼️
            </p>
            <img src={`${process.env.PUBLIC_URL}/media/demo-image.png`} width={"500px"} alt="Demo visualization" />
            <p>
                Click the button below to connect your Google Calendar and get started today!
            </p>
            <Footer />
        </div>
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
                    <h1>Yearify</h1>
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