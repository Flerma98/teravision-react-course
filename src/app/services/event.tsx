import { EventModel } from "@/app/context/eventContext";

export async function fetchEvents(): Promise<EventModel[]> {
    const response = await fetch("http://localhost:8080/api/event");
    if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.status}`);
    }
    return response.json();
}