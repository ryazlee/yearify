import "./App.css";
import CalendarGrid from "./CalendarGrid";
import { api } from "./api"; // Assuming you have an API module
import React, { useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { createTheme } from "@mui/material/styles"; // Optional, only if you want to customize the theme



// Event type definition for better type-checking
export interface CalendarEvent {
  id: string;
  summary: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
  };
  category?: string; // Category like travel, sports, etc.
}

const theme = createTheme();


function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);

  // Categorizing events with random categories
  const categorizeEvents = (events: CalendarEvent[]) => {
    return events.map((event) => {
      const categories = ["travel", "sports", "events", "appointments"];
      event.category = categories[Math.floor(Math.random() * categories.length)];
      return event;
    });
  };

  // Fetching calendar events and categorizing them
  const fetchCalendarEvents = async () => {
    try {
      const events = await api.getCalendarEvents();
      const categorizedEvents = categorizeEvents(events);
      setCalendarEvents(categorizedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <h1>Yearify</h1>
        <h2>You are {authenticated ? "authenticated" : "not authenticated"}</h2>
        <button onClick={(e) => api.handleAuthClick("sign-in", () => setAuthenticated(true))}>
          Sign In
        </button>
        <button onClick={(e) => api.handleAuthClick("sign-out", () => setAuthenticated(false))}>
          Sign Out
        </button>

        {authenticated && (
          <>
            <button onClick={fetchCalendarEvents}>
              Get Events
            </button>
            {calendarEvents.length > 0 && <CalendarGrid calendarEvents={calendarEvents} />}
            {calendarEvents.length > 0 ? (
              <div className="events-list">
                {calendarEvents.map((event) => (
                  <div key={event.id} className="event-item">
                    <h3>{event.summary}</h3>
                    <p>{new Date(event.start.dateTime || event.start.date || '').toLocaleString()}</p>
                    <p>{new Date(event.end.dateTime || event.end.date || '').toLocaleString()}</p>
                    <p>Category: {event.category}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No events available.</p>
            )}
          </>
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;
