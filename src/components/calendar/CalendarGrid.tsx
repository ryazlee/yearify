import { Box, Typography, Grid2 as Grid } from '@mui/material';
import { CalendarEvent, CategorizedEvents, CATEGORY_COLORS, DayProps, MONTHS_DATA } from '../types';
import { ColorLegend } from './ColorLegend';

const DateSquare = ({ day, events, isEmpty }: { day: DayProps, events: CalendarEvent[], isEmpty: boolean }) => {
    const adjustEndDate = (start: string, end: string): Date => {
        const startDate = new Date(start);
        const endDate = new Date(end);

        const diffInMilliseconds = endDate.getTime() - startDate.getTime();
        const diffInSeconds = diffInMilliseconds / 1000;
        const diffInMinutes = diffInSeconds / 60;
        const diffInHours = diffInMinutes / 60;

        if (diffInHours === 24 && diffInMinutes % 60 === 0 && diffInSeconds % 60 === 0) {
            endDate.setDate(endDate.getDate() - 1);
        }
        return endDate;
    };

    const getDayEvents = events.filter((event) => {
        const eventStartDate = new Date(event.start || '');
        const eventEndDate = adjustEndDate(event.start ?? '', event.end ?? '');

        const currentDayStart = new Date(day.year, day.month, day.num, 0, 0, 0); // Start of the day
        const currentDayEnd = new Date(day.year, day.month, day.num, 23, 59, 59); // End of the day

        return (
            eventStartDate <= currentDayEnd && eventEndDate >= currentDayStart
        );
    });

    // Get the top two colors
    const colors = getDayEvents
        .map(event => CATEGORY_COLORS[event.category || ''])
        .filter(color => color !== CATEGORY_COLORS['uncategorized'])
        .filter(Boolean);
    const [color1, color2] = colors.length > 0 ? [colors[0], colors[1] || colors[0]] : ['white', 'white'];

    return (
        <Box
            sx={{
                width: '18px',
                height: '18px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: isEmpty
                    ? 'white'
                    : `linear-gradient(135deg, ${color1} 50%, ${color2} 50%)`,
                border: '0px solid lightgrey',
            }}
        >
            {!isEmpty && <Typography sx={{ fontSize: 8 }}>{day.num}</Typography>}
        </Box>
    );
};


export const MonthsGrid = ({ monthIndexes, calendarEvents }: { monthIndexes: number[], calendarEvents: CalendarEvent[] }) => {
    const startMonth = MONTHS_DATA[monthIndexes[0]];

    const startEmptyDays: DayProps[] = Array.from({ length: startMonth.startDay }, (_, i) => ({ year: 2024, num: i, month: 0, isEmpty: true }));
    let allDays: DayProps[] = [...startEmptyDays];

    monthIndexes.forEach((monthIndex) => {
        const month = MONTHS_DATA[monthIndex];
        const monthDays: DayProps[] = Array.from({ length: month.days }, (_, i) => ({ year: 2024, num: i + 1, month: monthIndex, isEmpty: false }));
        allDays = [...allDays, ...monthDays];
    });

    return (
        <Grid container width={'130px'}>
            {allDays.map((day, index) => (
                <Grid key={`${day.month}-${day.num}-${index}`}>
                    <DateSquare day={day} events={calendarEvents} isEmpty={day.isEmpty} />
                </Grid>
            ))}
        </Grid>
    )
};

export const CalendarGrid = ({ categorizedEvents }: { categorizedEvents: CategorizedEvents }) => {
    const calendarEvents = Object.values(categorizedEvents).flat();

    return (
        <Box style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '5px',
            borderRadius: '8px',
            width: '100%',
        }}>
            <Box display={'flex'} justifyContent={'center'}>
                <ColorLegend />
            </Box>
            <Box style={{
                display: 'flex',
                borderRadius: '8px',
                justifyContent: 'center',
            }}>
                <Box width={"auto"} display={'flex'} flexDirection={'row'} gap={"0px"} >
                    <MonthsGrid monthIndexes={[0, 1, 2, 3]} calendarEvents={calendarEvents} />
                    <MonthsGrid monthIndexes={[4, 5, 6, 7]} calendarEvents={calendarEvents} />
                    <MonthsGrid monthIndexes={[8, 9, 10, 11]} calendarEvents={calendarEvents} />
                </Box >
            </Box>
        </Box>
    );
}


