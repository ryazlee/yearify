import React from 'react';
import { Box, Typography, Paper, Tooltip, Grid2 as Grid } from '@mui/material';
import { CalendarEvent } from './App';


const categoryColors: { [key: string]: string } = {
    travel: '#FFDDC1',
    sports: '#C1FFDD',
    events: '#C1DFFF',
    appointments: '#FFD700'
};

interface MonthDataProps {
    name: string;
    number: number;
    days: number;
    startDay: number;
}

interface DayProps {
    month: number;
    num: number;
    isEmpty: boolean;
}


const monthsData: MonthDataProps[] = [
    { name: "January", number: 1, days: 31, startDay: 1 },
    { name: "February", number: 2, days: 29, startDay: 4 },
    { name: "March", number: 3, days: 31, startDay: 3 },
    { name: "April", number: 4, days: 30, startDay: 0 },
    { name: "May", number: 5, days: 31, startDay: 2 },
    { name: "June", number: 6, days: 30, startDay: 5 },
    { name: "July", number: 7, days: 31, startDay: 2 },
    { name: "August", number: 8, days: 31, startDay: 3 },
    { name: "September", number: 9, days: 30, startDay: 6 },
    { name: "October", number: 10, days: 31, startDay: 6 },
    { name: "November", number: 11, days: 30, startDay: 5 },
    { name: "December", number: 12, days: 31, startDay: 2 }
];

// create a date square component
const DateSquare = ({ day, events, isEmpty }: { day: DayProps, events: CalendarEvent[], isEmpty: boolean }) => {
    const dayEvents = events.filter((event) => {
        const eventDate = new Date(event.start?.dateTime || event.start?.date || '');
        return eventDate.getDate() === day.num && eventDate.getMonth() === day.month;
    });


    return (
        <Box
            sx={{
                width: '40px',
                height: '40px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: isEmpty ? 'white' : categoryColors[dayEvents[0]?.category || ''],
                border: '0px solid lightgrey',
            }}
        >
            {!isEmpty && <Typography>{day.num}</Typography>}
        </Box>
    );
};

// create a month grid component
export const MonthsGrid = ({ monthIndexes, calendarEvents }: { monthIndexes: number[], calendarEvents: CalendarEvent[] }) => {

    const startMonth = monthsData[monthIndexes[0]];

    const startEmptyDays: DayProps[] = Array.from({ length: startMonth.startDay }, (_, i) => ({ num: i, month: 0, isEmpty: true }));
    let allDays: DayProps[] = [...startEmptyDays];

    monthIndexes.forEach((monthIndex) => {
        const month = monthsData[monthIndex];
        const monthDays: DayProps[] = Array.from({ length: month.days }, (_, i) => ({ num: i + 1, month: monthIndex, isEmpty: false }));
        allDays = [...allDays, ...monthDays];
    });

    return (
        <Box>
            <Grid container spacing={0} width={'280px'}>
                {allDays.map(day =>
                    <Grid>
                        <DateSquare day={day} events={calendarEvents} isEmpty={day.isEmpty} />
                    </Grid>
                )}
            </Grid>
        </Box>
    )
};

export const CalendarGrid2 = ({ calendarEvents }: { calendarEvents: CalendarEvent[] }) => {
    return (
        <Box width={"auto"} display={'flex'} flexDirection={'row'} gap={"10px"} >
            <MonthsGrid monthIndexes={[0, 1, 2]} calendarEvents={calendarEvents} />
            <MonthsGrid monthIndexes={[3, 4, 5]} calendarEvents={calendarEvents} />
            <MonthsGrid monthIndexes={[6, 7, 8]} calendarEvents={calendarEvents} />
            <MonthsGrid monthIndexes={[9, 10, 11]} calendarEvents={calendarEvents} />
        </Box >
    );
}


