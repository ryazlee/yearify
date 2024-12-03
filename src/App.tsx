import "./App.css";
import { CalendarGrid } from "./CalendarGrid";
import { api } from "./api";
import { useState, useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { AuthButton } from "./AuthButton";
import { CalendarEvent, CategorizedEvents } from "./types";
import { categorizeEvents } from "./categorizer/utils";
import { EventDragAndDrop } from "./dnd/EventDragAndDrop";

const theme = createTheme();

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [categorizedEvents, setCategorizedEvents] = useState<CategorizedEvents | null>(null);
  const [allEvents, setAllEvents] = useState<CalendarEvent[]>([]);


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
  }

  const fetchCalendarEvents = async () => {
    try {
      const events = await api.getCalendarEvents();
      const calendarEvents: CalendarEvent[] = events.map((event: any) => {
        const startDateTime = new Date(event.start.dateTime || event.start.date);
        startDateTime.setFullYear(2024);
        const endDateTime = new Date(event.end.dateTime || event.end.date);
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
    console.log("Updated Categories:", categorizedEvents);
    setCategorizedEvents(categorizedEvents);
    setAllEvents(getAllEvents());
  }

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
              Calendar Events Count: {getAllEvents().length}
            </div>
            {categorizedEvents && <EventDragAndDrop initialCategories={categorizedEvents} onUpdateCategories={onUpdateCategoriesHandler} />}
            {categorizedEvents && <CalendarGrid calendarEvents={allEvents} />}
          </>
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;
