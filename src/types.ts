export interface CalendarEvent {
    id: string;
    summary: string;
    start: string;
    end: string;
    category?: string;
    description?: string;
    location?: string;
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