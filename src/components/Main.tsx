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
            bottom: 10,
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
        <Box maxWidth={700} margin={"0 auto"}>
            <h1>Yearify</h1>
            <p>
                Welcome to Yearify!
            </p>
            <p>
                Yearify is a data visualization tool that helps you visualize how you spent your year! 📅
                <br />
                This app will fetch all your events over the past year in Google Calendar and will categorize them to build a visual representation of your year (such as the image below).
            </p>
            <img src={`${process.env.PUBLIC_URL}/media/demo-image.png`} width={"500px"} />
            <p>
                To get started, click the button below to authenticate with Google Calendar.
            </p>
            <Footer />
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