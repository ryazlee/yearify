import { CalendarEvent, CategorizedEvents } from "../types";
import Box from "@mui/material/Box";

const UserStats = ({ calendarEvents }: { calendarEvents: CalendarEvent[] }) => {
    const categorizedEvents: CategorizedEvents = calendarEvents.reduce(
        (acc, event) => {
            const category = event.category || "uncategorized";
            // Ensure the category is assigned to an array of CalendarEvent
            acc[category as keyof CategorizedEvents].push(event);
            return acc;
        },
        {
            travel: [] as CalendarEvent[],
            fitness: [] as CalendarEvent[],
            social: [] as CalendarEvent[],
            personal: [] as CalendarEvent[],
            uncategorized: [] as CalendarEvent[],
        }
    );

    return (
        <>
            {Object.keys(categorizedEvents).filter(category => category !== 'uncategorized').map((category) => (
                <div key={category}>
                    <Box>
                        {category}: {categorizedEvents[category as keyof CategorizedEvents].length}
                    </Box>
                </div>
            ))}
        </>
    );
};

export default UserStats;
