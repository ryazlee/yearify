import "./App.css";
import { CalendarGrid } from "./CalendarGrid";
import { api } from "./api"; // Assuming you have an API module
import { useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { createTheme } from "@mui/material/styles"; // Optional, only if you want to customize the theme
import { AuthButton } from "./AuthButton";
import { CalendarEvent } from "./types";
import { categorizeEvents } from "./categorizer/utils";

const theme = createTheme();

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);

  const fetchCalendarEvents = async () => {
    try {
      const events = await api.getCalendarEvents();
      const calendarEvents: CalendarEvent[] = events.map((event: any) => {
        return {
          id: event.id,
          summary: event.summary,
          start: event.start?.dateTime || event.start?.date || '',
          end: event.end?.dateTime || event.end?.date || '',
          description: event.description,
          location: event.location,
        };
      });
      const categorizedEvents = categorizeEvents(calendarEvents);
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
        <AuthButton isAuthenticated={authenticated} callback={() => setAuthenticated(!authenticated)} />
        {authenticated && (
          <>
            <button onClick={fetchCalendarEvents}>
              Get Events
            </button>
            <div>
              Calendar Events Count: {calendarEvents.length}
            </div>
            {calendarEvents.length > 0 && <CalendarGrid calendarEvents={calendarEvents} />}
          </>
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;
