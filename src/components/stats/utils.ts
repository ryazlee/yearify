import { CalendarEvent, CategorizedEvents, Category } from "../types";

export const getStats = (categorizedEvents: CategorizedEvents) => {
    const stats: { [key: string]: number | string } = {};
    for (const category in categorizedEvents) {
        stats[category] = categorizedEvents[category as Category].length;
    }
    return stats;
}

const extractDate = (dateTime: string): string => {
    const date = new Date(dateTime);
    return date.toDateString().split(' ').slice(1, 4).join(' ');
};

export const getMostEventfulDay = (categorizedEvents: CategorizedEvents): { date: string; events: CalendarEvent[] } | null => {
    const eventMap: Record<string, CalendarEvent[]> = {};

    Object.values(categorizedEvents).forEach((events) => {
        events.forEach((event) => {
            const date = extractDate(event.start);
            if (!eventMap[date]) {
                eventMap[date] = [];
            }
            eventMap[date].push(event);
        });
    });

    let maxDate: string | null = null;
    let maxEvents: CalendarEvent[] = [];

    Object.entries(eventMap).forEach(([date, events]) => {
        if (events.length > maxEvents.length) {
            maxDate = date;
            maxEvents = events;
        }
    });

    if (maxDate) {
        return { date: maxDate, events: maxEvents };
    }

    return null;
};