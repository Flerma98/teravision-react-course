import { TaskModel } from "@/app/context/taskContext";
import {fetchTasks} from "@/app/services/task";

describe("TaskModel", () => {
    const validTask: TaskModel = {
        id: 1,
        projectId: 1,
        name: "First Task",
        description: "This is the first task",
        createdAt: new Date().toISOString(),
        updatedAt: null,
    };

    test("should have required fields", () => {
        expect(validTask).toHaveProperty("id");
        expect(validTask).toHaveProperty("projectId");
        expect(validTask).toHaveProperty("name");
        expect(validTask).toHaveProperty("description");
        expect(validTask).toHaveProperty("createdAt");
    });

    test("should allow optional updatedAt", () => {
        const taskWithoutUpdatedAt: TaskModel = {
            id: 2,
            projectId: 2,
            name: "Task without update",
            description: "Still valid",
            createdAt: new Date().toISOString(),
        };

        expect(taskWithoutUpdatedAt.updatedAt).toBeUndefined();
    });

    test("should accept null in updatedAt", () => {
        expect(validTask.updatedAt).toBeNull();
    });

    test("id should be a number", () => {
        expect(typeof validTask.id).toBe("number");
    });

    test("createdAt should be a valid ISO date string", () => {
        expect(() => new Date(validTask.createdAt)).not.toThrow();
    });
});

describe("fetchTasks", () => {
    beforeEach(() => {
        global.fetch = jest.fn(); // 👈 mock global fetch
    });

    test("should fetch and return tasks", async () => {
        const mockTasks: TaskModel[] = [
            {
                id: 1,
                projectId: 1,
                name: "First Task",
                description: "This is the first task",
                createdAt: new Date().toISOString(),
                updatedAt: null,
            },
        ];

        // mock implementación de fetch
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => mockTasks,
        });

        const result = await fetchTasks();

        expect(global.fetch).toHaveBeenCalledWith("http://localhost:8080/api/task");
        expect(result).toEqual(mockTasks);
    });

    test("should throw error if response is not ok", async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            status: 500,
        });

        await expect(fetchTasks()).rejects.toThrow("Failed to fetch tasks: 500");
    });
});