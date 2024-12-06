import { Typography } from "@mui/material";
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
                    <Typography sx={{ fontSize: 8 }}>
                        {category}: {categorizedEvents[category as keyof CategorizedEvents].length}
                    </Typography>
                </div>
            ))}
        </>
    );
};

export default UserStats;
