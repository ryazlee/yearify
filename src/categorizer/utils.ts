import Fuse from "fuse.js";
import { CalendarEvent, CategorizedEvents } from "../types";
import { CATEGORIES_KEYWORDS, FUSE_OPTIONS } from "./config";

export function categorizeEvents(events: CalendarEvent[]): CalendarEvent[] {
    const categorized: CategorizedEvents = {
        travel: [],
        social: [],
        fitness: [],
        personal: [],
        uncategorized: [],
    };

    events.forEach((event) => {
        let matched = false;

        if (!event.summary) {
            categorized.uncategorized.push(event);
            return;
        }

        for (const [category, keywords] of Object.entries(CATEGORIES_KEYWORDS)) {
            const fuse = new Fuse(keywords, FUSE_OPTIONS);
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

    console.log("Categorized Events:", categorized);
    console.log("Count of events in categorized", Object.values(categorized).reduce((acc, val) => acc + val.length, 0));

    // iterate through categorized and set CalendarEvent.category
    for (const [category, events] of Object.entries(categorized)) {
        events.forEach((event) => {
            event.category = category;
        });
    }
    return events
}