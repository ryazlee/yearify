
export const CATEGORY_COLORS: { [key: string]: string } = {
    travel: '#FFDDC1',
    fitness: '#C1FFDD',
    social: '#C1DFFF',
    personal: '#DAB1DA',
    uncategorized: '#D3D3D3'
};

export const MONTHS_DATA: MonthDataProps[] = [
    { index: 0, name: "January", number: 1, days: 31, startDay: 1 },
    { index: 1, name: "February", number: 2, days: 29, startDay: 4 },
    { index: 2, name: "March", number: 3, days: 31, startDay: 5 },
    { index: 3, name: "April", number: 4, days: 30, startDay: 1 },
    { index: 4, name: "May", number: 5, days: 31, startDay: 3 },
    { index: 5, name: "June", number: 6, days: 30, startDay: 6 },
    { index: 6, name: "July", number: 7, days: 31, startDay: 2 },
    { index: 7, name: "August", number: 8, days: 31, startDay: 4 },
    { index: 8, name: "September", number: 9, days: 30, startDay: 0 },
    { index: 9, name: "October", number: 10, days: 31, startDay: 2 },
    { index: 10, name: "November", number: 11, days: 30, startDay: 5 },
    { index: 11, name: "December", number: 12, days: 31, startDay: 0 }
];

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
    index: number;
    name: string;
    number: number;
    days: number;
    startDay: number;
}

export interface DayProps {
    year: number;
    month: number;
    num: number;
    isEmpty: boolean;
}

export type CategorizedEvents = {
    travel: CalendarEvent[];
    fitness: CalendarEvent[];
    social: CalendarEvent[];
    personal: CalendarEvent[];
    uncategorized: CalendarEvent[];
};