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
        "rental car", "train", "station", "journey", "getaway",
        "adventure", "backpacking", "holiday", "exploration", "sightseeing",
        "road trip", "overnight", "glamping", "staycation", "excursion",
        "bus tour", "cabin", "hostel", "Airbnb", "resort", "stay"
      ],
      work: [
        "meeting", "deadline", "presentation", "review", "project",
        "conference", "workshop", "client", "briefing", "proposal",
        "pitch", "brainstorm", "interview", "training", "planning",
        "strategy", "sprint", "task", "check-in", "team",
        "demo", "follow-up", "sync", "report", "stand-up",
        "quarterly", "OKR", "performance", "collaboration", "retrospective",
        "scrum", "one-on-one", "seminar", "conference call", "huddle",
        "conference room", "networking", "presentation", "webinar", "coaching"
      ],
      social: [
        "party", "dinner", "event", "festival", "celebrate",
        "housewarming", "call", "birthday", "gathering",
        "hangout", "BBQ", "brunch", "reunion", "farewell",
        "movie", "concert", "show", "play", "game night",
        "club", "bar", "karaoke", "dance", "picnic",
        "engagement", "wedding", "shower", "anniversary", "family reunion",
        "baby shower", "graduation", "holiday party", "theatre",
        "sporting event", "reception", "potluck", "friendsgiving",
        "fundraiser", "baby announcement", "open house", "bonfire",
        "tailgate", "cheer", "celebration", "hangout", "night out"
      ],
      fitness: [
        "gym", "yoga", "workout", "game", "tryout", "practice", "training",
        "match", "tournament", "league", "pickleball", "spinning", "boxing",
        "kickboxing", "MMA", "zumba", "HIIT", "aerobics", "strength training",
        "bodybuilding", "football", "rugby", "golf", "bowling", "ice skating",
        "skateboarding", "climbing", "dance class", "fitness test", "marathon",
        "race", "swim", "surf", "hike", "climb", "cycling", "biking", "walk",
        "soccer", "basketball", "tennis", "volleyball", "rowing", "triathlon",
        "pilates", "crossfit", "baseball", "hockey", "cricket", "handball", "ping pong",
        "lacrosse", "track and field", "badminton", "wrestling", "boxing",
        "motorsport", "snowboarding", "skiing", "snowshoeing", "swimming",
        "archery", "equestrian", "fencing", "martial arts", "softball",
        "ultimate frisbee"
      ],
      personal: [
        "appointment", "errand", "family", "doctor", "pet",
        "therapy", "dentist", "optometrist", "spa", "massage",
        "haircut", "grocery", "shopping", "school", "pickup",
        "drop-off", "bank", "insurance", "lawyer", "taxes",
        "maintenance", "repair", "cleaning", "study", "home",
        "gardening", "chores", "delivery", "baby", "kids",
        "volunteer", "charity", "donation", "homework", "routine",
        "personal care", "grooming", "laundry", "house cleaning",
        "car maintenance", "vet visit", "house repair", "renovation",
        "massage", "nail appointment", "hair coloring", "self-care",
        "counseling", "doctor's visit", "dentist appointment",
        "physical therapy", "health check-up", "emergency"
      ]
    };

    const options = {
      includeScore: true,
      includeMatches: true,
      isCaseSensitive: false,
      threshold: 0.5,
      findAllMatches: true,
      ignoreLocation: true,
      distance: 400
    };
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
