import { EventModel } from "@/app/context/eventContext";
import { fetchEvents } from "@/app/services/event";

describe("EventModel", () => {
    const validEvent: EventModel = {
        id: 1,
        name: "First Event",
        description: "This is the first event",
        createdAt: new Date().toISOString(),
        updatedAt: null,
    };

    test("should have required fields", () => {
        expect(validEvent).toHaveProperty("id");
        expect(validEvent).toHaveProperty("name");
        expect(validEvent).toHaveProperty("description");
        expect(validEvent).toHaveProperty("createdAt");
    });

    test("should allow optional updatedAt", () => {
        const eventWithoutUpdatedAt: EventModel = {
            id: 2,
            name: "Event without update",
            description: "Still valid",
            createdAt: new Date().toISOString(),
        };

        expect(eventWithoutUpdatedAt.updatedAt).toBeUndefined();
    });

    test("should accept null in updatedAt", () => {
        expect(validEvent.updatedAt).toBeNull();
    });

    test("id should be a number", () => {
        expect(typeof validEvent.id).toBe("number");
    });

    test("createdAt should be a valid ISO date string", () => {
        expect(() => new Date(validEvent.createdAt)).not.toThrow();
    });
});

describe("fetchEvents", () => {
    beforeEach(() => {
        global.fetch = jest.fn(); // 👈 mock global fetch
    });

    test("should fetch and return events", async () => {
        const mockEvents: EventModel[] = [
            {
                id: 1,
                name: "First Event",
                description: "This is the first event",
                createdAt: new Date().toISOString(),
                updatedAt: null,
            },
        ];

        // mock implementación de fetch
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => mockEvents,
        });

        const result = await fetchEvents();

        expect(global.fetch).toHaveBeenCalledWith("http://localhost:8080/api/event");
        expect(result).toEqual(mockEvents);
    });

    test("should throw error if response is not ok", async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            status: 500,
        });

        await expect(fetchEvents()).rejects.toThrow("Failed to fetch events: 500");
    });
});