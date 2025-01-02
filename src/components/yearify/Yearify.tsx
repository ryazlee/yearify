import React, { useState, useEffect, useCallback } from "react";
import { CalendarEvent, CategorizedEvents } from "../types";
import { api } from "../../api";
import { categorizeEvents } from "../categorizer/utils";
import DownloadableComponent from "../downloadableImage/DownloadableComponent";
import { EventDragAndDrop } from "../dnd/EventDragAndDrop";
import { AuthButton } from "../auth/AuthButton";
import { CalendarGrid, CalendarGridWaterMark } from "../calendar/CalendarGrid";
import Box from "@mui/material/Box";
import UserStats from "../stats/UserStats";
import {
    FormControlLabel,
    Switch,
    Typography,
} from "@mui/material";
import LaunchIcon from '@mui/icons-material/Launch';

const LandingPage = () => (
    <Box
        sx={{
            maxWidth: "700px",
            margin: "0 auto",
            textAlign: "center",
            paddingBottom: "1rem",
        }}
    >
        <Typography variant="body1" gutterBottom>
            Yearify helps you rediscover your year through your Google Calendar
            events! 📅
        </Typography>
        <Typography variant="body1" gutterBottom>
            We'll fetch your events from the past year, organize them, and turn them
            into a clear, colorful snapshot of your time. It's your year, visualized!
            🖼️
        </Typography>
        <Box
            component="img"
            src={`/media/demo-image.png`}
            alt="Demo visualization"
            sx={{
                width: "100%",
                maxWidth: "500px",
                height: "auto",
                margin: "20px 0",
            }}
        />
        <Typography variant="body1">
            Click the button below to connect your Google Calendar and get started!
        </Typography>
    </Box>
);

function Yearify() {
    const [authenticated, setAuthenticated] = useState(false);
    const [categorizedEvents, setCategorizedEvents] =
        useState<CategorizedEvents | null>(null);
    const [showStats, setShowStats] = useState(false);

    const fetchCalendarEvents = useCallback(async () => {
        try {
            const events = await api.getCalendarEvents();
            const calendarEvents: CalendarEvent[] = events.map((event: any) => {
                const startDateTime = new Date(
                    event.start?.dateTime || event.start?.date
                );
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
                    htmlLink: event.htmlLink,
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

    const onUpdateCategoriesHandler = (
        updatedCategorizedEvents: CategorizedEvents
    ) => {
        setCategorizedEvents(updatedCategorizedEvents);
    };

    return (
        <Box>
            {!authenticated ? (
                <>
                    <LandingPage />
                    <AuthButton
                        isAuthenticated={authenticated}
                        callback={() => setAuthenticated(true)}
                    />
                </>
            ) : (
                <>
                    <AuthButton
                        isAuthenticated={authenticated}
                        callback={() => setAuthenticated(false)}
                    />
                    {categorizedEvents ? (
                        <>
                            <Typography marginTop={2} sx={{ fontStyle: "italic" }}>
                                Drag and drop or click the
                                <LaunchIcon fontSize="small" sx={{ verticalAlign: "middle", marginX: 0.5 }} />
                                icon to categorize events!
                            </Typography>

                            <EventDragAndDrop
                                initialCategories={categorizedEvents}
                                onUpdateCategories={onUpdateCategoriesHandler}
                            />
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
                                {showStats && (
                                    <UserStats categorizedEvents={categorizedEvents} />
                                )}
                                <CalendarGridWaterMark />
                            </DownloadableComponent>
                        </>
                    ) : (
                        <Typography sx={{ padding: 5 }}>Loading your events...</Typography>
                    )}
                </>
            )}
        </Box>
    );
}

export default Yearify;
