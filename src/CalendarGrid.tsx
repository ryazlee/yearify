import { Box, Typography, Grid2 as Grid } from '@mui/material';
import { CalendarEvent, DayProps, MonthDataProps } from './types';

export const categoryColors: { [key: string]: string } = {
    travel: '#FFDDC1',
    fitness: '#C1FFDD',
    social: '#C1DFFF',
    personal: '#DAB1DA',
    uncategorized: '#D3D3D3'
};

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

const DateSquare = ({ day, events, isEmpty }: { day: DayProps, events: CalendarEvent[], isEmpty: boolean }) => {
    const adjustEndDate = (start: string, end: string): Date => {
        const startDate = new Date(start);
        const endDate = new Date(end);

        const diffInMilliseconds = endDate.getTime() - startDate.getTime();
        const diffInSeconds = diffInMilliseconds / 1000;
        const diffInMinutes = diffInSeconds / 60;
        const diffInHours = diffInMinutes / 60;

        // check if the difference is exactly 24 hours, 0 minutes, and 0 seconds
        // this is a hack to fix the issue where the end date is set to the next day
        if (diffInHours === 24 && diffInMinutes % 60 === 0 && diffInSeconds % 60 === 0) {
            endDate.setDate(endDate.getDate() - 1);
        }
        return endDate;
    }

    const getDayEvents = events.filter((event) => {
        const eventStartDate = new Date(event.start || '');
        const eventEndDate = adjustEndDate(event.start ?? '', event.end ?? '');


        const currentDayStart = new Date(day.year, day.month, day.num, 0, 0, 0); // Start of the day
        const currentDayEnd = new Date(day.year, day.month, day.num, 23, 59, 59); // End of the day

        return (
            (eventStartDate <= currentDayEnd && eventEndDate >= currentDayStart)
        );
    });

    return (
        <Box
            sx={{
                width: '40px',
                height: '40px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: isEmpty || getDayEvents[0]?.category === 'uncategorized' ? 'white' : categoryColors[getDayEvents[0]?.category || ''],
                border: '0px solid lightgrey',
            }}
        >
            {!isEmpty && <Typography>{day.num}</Typography>}
        </Box>
    );
};

export const MonthsGrid = ({ monthIndexes, calendarEvents }: { monthIndexes: number[], calendarEvents: CalendarEvent[] }) => {
    const startMonth = monthsData[monthIndexes[0]];

    const startEmptyDays: DayProps[] = Array.from({ length: startMonth.startDay }, (_, i) => ({ year: 2024, num: i, month: 0, isEmpty: true }));
    let allDays: DayProps[] = [...startEmptyDays];

    monthIndexes.forEach((monthIndex) => {
        const month = monthsData[monthIndex];
        const monthDays: DayProps[] = Array.from({ length: month.days }, (_, i) => ({ year: 2024, num: i + 1, month: monthIndex, isEmpty: false }));
        allDays = [...allDays, ...monthDays];
    });

    return (
        <Grid container spacing={0} width={'280px'}>
            {allDays.map(day =>
                <Grid>
                    <DateSquare day={day} events={calendarEvents} isEmpty={day.isEmpty} />
                </Grid>
            )}
        </Grid>
    )
};

const ColorLegend = () => {
    return (
        <Box display={'flex'} flexDirection={'row'} gap={"10px"} padding={"10px 0"} >
            <Box display={'flex'} flexDirection={'row'} gap={"10px"} >
                <Box width={'20px'} height={'20px'} bgcolor={categoryColors.travel} />
                <Typography>Travel</Typography>
            </Box>
            <Box display={'flex'} flexDirection={'row'} gap={"10px"} >
                <Box width={'20px'} height={'20px'} bgcolor={categoryColors.fitness} />
                <Typography>Fitness</Typography>
            </Box>
            <Box display={'flex'} flexDirection={'row'} gap={"10px"} >
                <Box width={'20px'} height={'20px'} bgcolor={categoryColors.social} />
                <Typography>Social</Typography>
            </Box>
            <Box display={'flex'} flexDirection={'row'} gap={"10px"} >
                <Box width={'20px'} height={'20px'} bgcolor={categoryColors.personal} />
                <Typography>Personal</Typography>
            </Box>
        </Box >
    );
}

export const CalendarGrid = ({ calendarEvents }: { calendarEvents: CalendarEvent[] }) => {
    return (
        <Box style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '10px',
            borderRadius: '8px',
            width: '100%',
        }}>
            <Box display={'flex'} justifyContent={'center'}>
                <ColorLegend />
            </Box>
            <Box style={{
                display: 'flex',
                gap: '10px',
                padding: '10px',
                borderRadius: '8px',
                justifyContent: 'center',
            }}>
                <Box width={"auto"} display={'flex'} flexDirection={'row'} gap={"10px"}  >
                    <MonthsGrid monthIndexes={[0, 1, 2, 3]} calendarEvents={calendarEvents} />
                    <MonthsGrid monthIndexes={[4, 5, 6, 7]} calendarEvents={calendarEvents} />
                    <MonthsGrid monthIndexes={[8, 9, 10, 11]} calendarEvents={calendarEvents} />
                </Box >
            </Box>
        </Box>
    );
}


