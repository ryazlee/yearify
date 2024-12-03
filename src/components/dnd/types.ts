export interface Event {
    id: string;
    title: string;
}

export interface Categories {
    [key: string]: Event[];
};