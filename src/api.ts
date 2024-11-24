import ApiCalendar from "react-google-calendar-api";

const config = {
    clientId:
        "630414025877-qea2q4pmk86335ul1m259uk3p0klgvit.apps.googleusercontent.com",
    apiKey: "AIzaSyAfDGFQrNL92O_92PZ2JD2pX_aXP9Ug1QE",
    scope: "https://www.googleapis.com/auth/calendar",
    discoveryDocs: [
        "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
    ],
};

class API {
    apiCalendar: ApiCalendar;
    constructor() {
        this.apiCalendar = new ApiCalendar(config);
    }

    getCalendarEvents = () => {
        return this.apiCalendar.listEvents({
            timeMin: new Date(2024, 0, 1).toISOString(),
            timeMax: new Date(2024, 12, 31).toISOString(),
            showDeleted: false,
            maxResults: 30,
            orderBy: "updated",
        }).then((response: any) => response.result.items);
    };

    handleAuthClick = (name: string, callBack?: () => void): void => {
        if (name === "sign-in") {
            this.apiCalendar.handleAuthClick().then(() => {
                callBack?.();
            });
        } else if (name === "sign-out") {
            this.apiCalendar.handleSignoutClick()
            callBack?.()
        }
    };
}

export const api = new API();