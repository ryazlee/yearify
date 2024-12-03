import Fuse from "fuse.js";
import { CATEGORIES_KEYWORDS, FUSE_OPTIONS } from "./config";
import { CalendarEvent, CategorizedEvents } from "../types";

export function categorizeEvents(events: CalendarEvent[]): CategorizedEvents {
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
            event.category = "uncategorized";
            categorized.uncategorized.push(event);
            return;
        }

        for (const [category, keywords] of Object.entries(CATEGORIES_KEYWORDS)) {
            const fuse = new Fuse(keywords, FUSE_OPTIONS);
            const result = fuse.search(event.summary);

            if (result.length > 0) {
                event.category = category
                categorized[category as keyof CategorizedEvents].push(event);
                matched = true;
                break;
            }
        }

        if (!matched) {
            event.category = "uncategorized";
            categorized.uncategorized.push(event);
        }
    });

    console.info("Categorized Events:", categorized);
    console.info("Count of events in categorized", Object.values(categorized).reduce((acc, val) => acc + val.length, 0));

    return categorized
}