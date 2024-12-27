import React, { useState, useEffect, useCallback } from "react";
import { CalendarEvent, CategorizedEvents } from "./types";
import { api } from "../api";
import { categorizeEvents } from "./categorizer/utils";
import DownloadableComponent from "./downloadableImage/DownloadableComponent";
import { EventDragAndDrop } from "./dnd/EventDragAndDrop";
import { AuthButton } from "./auth/AuthButton";
import { CalendarGrid, CalendarGridWaterMark } from "./calendar/CalendarGrid";
import Box from "@mui/material/Box";
import UserStats from "./stats/UserStats";
import { FormControlLabel, Link, Switch, Typography } from "@mui/material";
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DemoImage from "../assets/images/demo-image.png";
import PrivacyPolicy from "../assets/legal/privacy-policy.txt";
import TermsOfService from "../assets/legal/terms-of-service.txt";

const Footer = () => (
    <Box
        component="footer"
        sx={{
            textAlign: 'center',
            paddingTop: '1rem',
        }}
    >
        <Link
            href={PrivacyPolicy}
            underline="hover"
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
            href={TermsOfService}
            underline="hover"
            target="_blank"
            rel="noopener"
            sx={{
                fontSize: '0.75rem',
            }}
        >
            Terms of Service
        </Link>
        <Typography color="textSecondary" sx={{ fontSize: '0.75rem', fontStyle: 'italic' }}>
            If you have any questions or concerns, please <Link href="mailto:ryan.j.lee99@gmail.com">email me</Link> or fill out the <Link href="https://docs.google.com/forms/d/e/1FAIpQLSdPgeP1zRy7N_lK9NKIeoIz8FwEY9OWyllDHgd5Q0PUWz4R1g/viewform?usp=sharing">feedback form</Link>
        </Typography>
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
            padding: "20px 0",
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
            src={DemoImage}
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

function Main() {
    const [authenticated, setAuthenticated] = useState(false);
    const [categorizedEvents, setCategorizedEvents] = useState<CategorizedEvents | null>(null);
    const [showStats, setShowStats] = useState(false);

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
                    htmlLink: event.htmlLink
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
        <Box paddingBottom={"2rem"}>
            {!authenticated ? (
                <>
                    <LandingPage />
                    <AuthButton isAuthenticated={authenticated} callback={() => setAuthenticated(true)} />
                </>
            ) : (
                <>
                    <Header />
                    <AuthButton isAuthenticated={authenticated} callback={() => setAuthenticated(false)} />
                    {categorizedEvents ? (
                        <>
                            <Typography marginTop={2} sx={{ fontStyle: 'italic' }}>
                                Drag and drop or click the <ModeEditIcon fontSize="small" /> icon to categorize events!
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
                                {showStats && <UserStats categorizedEvents={categorizedEvents} />}
                                <CalendarGridWaterMark />
                            </DownloadableComponent>
                        </>
                    ) : (
                        <Typography sx={{ padding: 5 }}>Loading your events...</Typography>
                    )}
                </>
            )}
            <Footer />
        </Box>
    );
}

export default Main;