import { CalendarEvent } from "../types";
import Anthropic from '@anthropic-ai/sdk';

class llmClient {
    anthropic: any;
    constructor() {
        this.anthropic = new Anthropic({
            apiKey: 'redacted',
            dangerouslyAllowBrowser: true
        });
    }

    async createMessage(model: string, max_tokens: number, messages: { role: string, content: string }[]) {
        console.log("createMessage");
        return {
            model: model,
            max_tokens: max_tokens,
            messages: messages,
        };
    }

    async categorizeEventsWithLLM(calendarEvents: CalendarEvent[]) {
        console.log("categorizeEventsWithLLM");
        const msg = await this.anthropic.messages.create({
            model: "claude-3-5-sonnet-20241022",
            max_tokens: 1024,
            messages: [
                { role: "user", content: "you are a agent designed to categorize google calendar events.   i want there to be 3-4 categories with a preference of travel, sports, parties/events but you can add/replace categories as fits." },
                { role: "user", content: `categorize the following events in json format: ${JSON.stringify(calendarEvents)}` },
            ],
        });
        console.log(msg);
    }
}

export const llm = new llmClient();