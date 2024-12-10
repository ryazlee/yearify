import { CalendarEvent, CategorizedEvents } from "../types";
import { CATEGORIES_KEYWORDS } from "./config";

export function categorizeEvents(events: CalendarEvent[]): CategorizedEvents {
    const categorized: CategorizedEvents = {
        travel: [],
        social: [],
        fitness: [],
        personal: [],
        uncategorized: [],
    };

    events.forEach((event) => {
        const summary = event.summary?.toLowerCase();
        const description = event.description?.toLowerCase();
        const location = event.location?.toLowerCase();

        if (summary || description || location) {
            let categorizedFlag = false;
            Object.keys(categorized).forEach((category) => {
                const categoryKey = category as keyof typeof categorized;
                if (categorizedFlag) {
                    return;
                }

                const keywords = CATEGORIES_KEYWORDS[categoryKey];
                if (keywords.some((keyword) => summary?.includes(keyword) || description?.includes(keyword) || location?.includes(keyword))) {
                    categorized[categoryKey].push(event);
                    event.category = categoryKey;
                    categorizedFlag = true;
                }
            });

            if (!categorizedFlag) {
                categorized.uncategorized.push(event);
                event.category = "uncategorized";
            }
        }
    });

    return categorized
}