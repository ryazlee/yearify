import "./App.css";
import { api } from "./api";
import React, { useState } from "react";

function App() {
  const [autheticated, setAuthenticated] = useState(false);
  const [calendarEvents, setCalendarEvents] = useState<any>([]);

  const categorizeEvents = (events: any) => {
    // randomly set events to travel, sports, events, appointments
    return events.map((event: any) => {
      const categories = ["travel", "sports", "events", "appointments"];
      event.category = categories[Math.floor(Math.random() * categories.length)];
      return event;
    });
  }

  const fetchCalendarEvents = async () => {
    const events = await api.getCalendarEvents();
    const categorizedEvents = categorizeEvents(events);
    setCalendarEvents(categorizedEvents);
  }

  return (
    <div className="App">
      <h1>Yearify</h1>
      <h2> You are {autheticated ? "autheticated" : "not autheticated"}</h2>
      <button onClick={(e) => api.handleAuthClick("sign-in", () => setAuthenticated(true))}>
        sign-in
      </button>
      <button onClick={(e) => api.handleAuthClick("sign-out", () => setAuthenticated(false))}>
        sign-out
      </button>

      {autheticated && <>
        <button onClick={fetchCalendarEvents}>
          get events
        </button>
        {calendarEvents.map((event: any) => (
          <div key={event.id}>
            <h3>{event.summary}</h3>
            <p>{new Date(event.start.dateTime || event.start.date).toLocaleString()}</p>
            <p>{new Date(event.end.dateTime || event.end.date).toLocaleString()}</p>
            <p>{event.category}</p>
          </div>
        ))}

      </>}
    </div>
  );
}

export default App;
