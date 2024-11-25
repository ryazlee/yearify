import "./App.css";
import { CalendarGrid } from "./CalendarGrid";
import { api } from "./api"; // Assuming you have an API module
import { useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { createTheme } from "@mui/material/styles"; // Optional, only if you want to customize the theme
import { AuthButton } from "./AuthButton";
import { CalendarEvent } from "./types";
import Fuse from 'fuse.js'

const theme = createTheme();

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);

  const fetchPlaces = async (queries: string[]) => {
    const serverUrl = "http://localhost:5000/places";

    try {
      // Create fetch promises for each query
      const fetchPromises = queries.map((query) => {
        if (!query) return Promise.resolve(undefined);
        return fetch(`${serverUrl}?query=${encodeURIComponent(query)}`)
          .then((response) => {
            if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
            return response.json();
          })
          .then((data) => data.results) // Extract the results
          .catch((error) => {
            console.error(`Error fetching for query "${query}":`, error);
            return []; // Return an empty array on failure to prevent halting other requests
          })
      });

      // Wait for all fetches to complete
      const results = await Promise.all(fetchPromises);

      // Flatten the results into a single array
      return results.flat();
    } catch (error) {
      console.error("Error fetching places in bulk:", error);
      return [];
    }
  };

  type CategorizedEvents = {
    travel: CalendarEvent[];
    work: CalendarEvent[];
    social: CalendarEvent[];
    fitness: CalendarEvent[];
    personal: CalendarEvent[];
    uncategorized: CalendarEvent[];
  };

  function categorizeEvents2(events: CalendarEvent[]): CalendarEvent[] {
    const categories = {
      travel: [
        "flight", "travel", "vacation", "check-in", "hotel", "trip",
        "road trip", "cruise", "layover", "airport", "departure",
        "arrival", "itinerary", "tour", "resort", "luggage",
        "rental car", "train", "station", "journey", "getaway"
      ],
      work: [
        "meeting", "deadline", "presentation", "review", "project",
        "conference", "workshop", "client", "briefing", "proposal",
        "pitch", "brainstorm", "interview", "training", "planning",
        "strategy", "sprint", "task", "check-in", "team",
        "demo", "follow-up", "sync", "report", "stand-up",
        "quarterly", "OKR", "performance"
      ],
      social: [
        "party", "dinner", "event", "festival", "celebrate",
        "housewarming", "call", "birthday", "gathering",
        "hangout", "BBQ", "brunch", "reunion", "farewell",
        "movie", "concert", "show", "play", "game night",
        "club", "bar", "karaoke", "dance", "picnic",
        "engagement", "wedding", "shower", "anniversary"
      ],
      fitness: [
        "gym", "yoga", "run", "workout", "game",
        "tryout", "practice", "marathon", "race",
        "swim", "surf", "hike", "climb", "cycling",
        "biking", "walk", "training", "match", "tournament",
        "league", "pickleball", "soccer", "basketball", "tennis",
        "volleyball", "rowing", "triathlon", "pilates"
      ],
      personal: [
        "appointment", "errand", "family", "doctor", "pet",
        "therapy", "dentist", "optometrist", "spa", "massage",
        "haircut", "grocery", "shopping", "school", "pickup",
        "drop-off", "bank", "insurance", "lawyer", "taxes",
        "maintenance", "repair", "cleaning", "study", "home",
        "gardening", "chores", "delivery", "baby", "kids",
        "volunteer", "charity", "donation"
      ]
    };

    const options = { includeScore: true, threshold: 0.6 };
    const categorized: CategorizedEvents = {
      travel: [],
      work: [],
      social: [],
      fitness: [],
      personal: [],
      uncategorized: [],
    };

    events.forEach((event) => {
      let matched = false;

      // Skip categorization if `summary` is missing
      if (!event.summary) {
        categorized.uncategorized.push(event);
        return;
      }

      for (const [category, keywords] of Object.entries(categories)) {
        const fuse = new Fuse(keywords, options);
        const result = fuse.search(event.summary);

        if (result.length > 0) {
          categorized[category as keyof CategorizedEvents].push(event);
          matched = true;
          break;
        }
      }

      if (!matched) {
        categorized.uncategorized.push(event);
      }
    });

    console.log("CATEGORIES", categorized);

    // iterate through categorized and set CalendarEvent.category
    for (const [category, events] of Object.entries(categorized)) {
      events.forEach((event) => {
        event.category = category;
      });
    }

    console.log(fetchPlaces(events.map((event) => event.location || '')));
    // determine category based on location


    return events
  }

  // Fetching calendar events and categorizing them
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
      const categorizedEvents = categorizeEvents2(calendarEvents);
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
