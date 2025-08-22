import { TaskModel } from "@/app/context/taskContext";

describe("TaskModel", () => {
    const validTask: TaskModel = {
        id: 1,
        name: "First Task",
        description: "This is the first task",
        createdAt: new Date().toISOString(),
        updatedAt: null,
    };

    test("should have required fields", () => {
        expect(validTask).toHaveProperty("id");
        expect(validTask).toHaveProperty("name");
        expect(validTask).toHaveProperty("description");
        expect(validTask).toHaveProperty("createdAt");
    });

    test("should allow optional updatedAt", () => {
        const taskWithoutUpdatedAt: TaskModel = {
            id: 2,
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
