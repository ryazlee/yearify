import React from 'react';
import { Box, Grid, Typography, Paper, Tooltip } from '@mui/material';
import { CalendarEvent } from './App';

const categoryColors: { [key: string]: string } = {
    travel: '#FFDDC1',
    sports: '#C1FFDD',
    events: '#C1DFFF',
    appointments: '#FFD700'
};

interface MonthGridProps {
    month: {
        name: string;
        number: number;
        days: number;
        startDay: number;
    };
    monthIndex: number;
    calendarEvents: CalendarEvent[];
}

const MonthGrid: React.FC<MonthGridProps> = ({ month, monthIndex, calendarEvents }) => {
    const getEventsForDay = (day: number) => {
        return calendarEvents.filter((event: CalendarEvent) => {
            const eventDate = new Date(event.start.dateTime || event.start.date || '');
            return eventDate.getMonth() === monthIndex && eventDate.getDate() === day;
        });
    };

    const createEventTooltip = (events: CalendarEvent[]) => {
        return (
            <Box sx={{ p: 1 }}>
                {events.map(event => (
                    <Box key={event.id}>
                        <Typography variant="body2">{event.summary}</Typography>
                        <Typography variant="caption" display="block">
                            {new Date(event.start.dateTime || event.start.date || '').toLocaleString()}
                        </Typography>
                    </Box>
                ))}
            </Box>
        );
    };

    const renderDays = () => {
        const days = [];

        // Empty boxes before the first day of the month
        for (let i = 0; i < month.startDay; i++) {
            days.push(
                <Box key={`empty-${i}`} sx={{ width: '20px', height: '20px' }} />
            );
        }

        // Render actual days
        for (let day = 1; day <= month.days; day++) {
            const dayEvents = getEventsForDay(day);
            const hasEvents = dayEvents.length > 0;
            const category = hasEvents ? dayEvents[0].category : null;

            const dayCell = (
                <Box
                    sx={{
                        width: '20px',
                        height: '20px',
                        backgroundColor: category ? categoryColors[category] : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        borderRight: '1px solid',
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        position: 'relative',
                        cursor: hasEvents ? 'pointer' : 'default',
                        '&:hover': hasEvents ? {
                            opacity: 0.8,
                        } : {}
                    }}
                >
                    {day}
                    {hasEvents && dayEvents.length > 1 && (
                        <Box
                            sx={{
                                position: 'absolute',
                                top: -2,
                                right: -2,
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                backgroundColor: 'primary.main',
                            }}
                        />
                    )}
                </Box>
            );

            days.push(
                hasEvents ? (
                    <Tooltip key={day} title={createEventTooltip(dayEvents)} arrow>
                        {dayCell}
                    </Tooltip>
                ) : (
                    <Box key={day}>{dayCell}</Box>
                )
            );
        }

        return days;
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant="caption" sx={{ minWidth: '20px', textAlign: 'right', mr: 1 }}>
                {month.number}
            </Typography>
            <Paper
                elevation={0}
                sx={{
                    flex: 1,
                    backgroundColor: 'background.default',
                    border: '1px solid',
                    borderColor: 'divider',
                    overflow: 'hidden',
                }}
            >
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(7, 20px)', // 7 days in a row
                    gridAutoRows: '20px',
                    width: '140px', // 7 days * 20px
                    gap: 0, // No gap between day cells
                }}>
                    {renderDays()}
                </Box>
            </Paper>
        </Box>
    );
};

interface CalendarGridProps {
    calendarEvents: CalendarEvent[];
}

const CalendarGrid: React.FC<CalendarGridProps> = ({ calendarEvents }) => {
    // Reorganize months into rows
    const monthRows = [
        [
            { name: "January", number: 1, days: 31, startDay: 1 },  // January 1, 2024 is a Monday
            { name: "April", number: 4, days: 30, startDay: 0 },    // April 1, 2024 is a Monday
            { name: "July", number: 7, days: 31, startDay: 2 },     // July 1, 2024 is a Monday
            { name: "October", number: 10, days: 31, startDay: 6 }  // October 1, 2024 is a Tuesday
        ],
        [
            { name: "February", number: 2, days: 29, startDay: 4 }, // February 1, 2024 is a Thursday
            { name: "May", number: 5, days: 31, startDay: 2 },      // May 1, 2024 is a Wednesday
            { name: "August", number: 8, days: 31, startDay: 3 },    // August 1, 2024 is a Thursday
            { name: "November", number: 11, days: 30, startDay: 5 }  // November 1, 2024 is a Friday
        ],
        [
            { name: "March", number: 3, days: 31, startDay: 3 },     // March 1, 2024 is a Friday
            { name: "June", number: 6, days: 30, startDay: 5 },      // June 1, 2024 is a Saturday
            { name: "September", number: 9, days: 30, startDay: 6 }, // September 1, 2024 is a Sunday
            { name: "December", number: 12, days: 31, startDay: 2 }  // December 1, 2024 is a Sunday
        ]
    ];

    return (
        <Box >
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                {monthRows.map((row, rowIndex) => (
                    <Box key={rowIndex} sx={{ display: 'flex' }}>
                        {row.map((month, monthIndex) => (
                            <Box key={month.name} sx={{ flex: 1 }}>
                                <MonthGrid
                                    month={month}
                                    monthIndex={(rowIndex * 4) + monthIndex}
                                    calendarEvents={calendarEvents}
                                />
                            </Box>
                        ))}
                    </Box>
                ))}
            </Box>

            <Box sx={{
                display: 'flex',
                gap: 2,
                mt: 2,
                flexWrap: 'wrap',
            }}>
                {Object.entries(categoryColors).map(([category, color]) => (
                    <Box key={category} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Box sx={{
                            width: 12,
                            height: 12,
                            backgroundColor: color,
                        }} />
                        <Typography variant="caption" sx={{ textTransform: 'capitalize' }}>
                            {category}
                        </Typography>
                    </Box>
                ))}
            </Box>
        </Box >
    );
};

export default CalendarGrid;
