export interface CalendarEvent {
    id: string;
    summary: string;
    start: {
        dateTime?: string;
        date?: string;
    };
    end: {
        dateTime?: string;
        date?: string;
    };
    category?: string;
}

export interface MonthDataProps {
    name: string;
    number: number;
    days: number;
    startDay: number;
}

export interface DayProps {
    month: number;
    num: number;
    isEmpty: boolean;
}