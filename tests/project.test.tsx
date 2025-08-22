import { ProjectModel } from "@/app/context/projectContext";

describe("ProjectModel", () => {
    const validProject: ProjectModel = {
        id: 1,
        name: "First Project",
        description: "This is the first project",
        createdAt: new Date().toISOString(),
        updatedAt: null,
    };

    test("should have required fields", () => {
        expect(validProject).toHaveProperty("id");
        expect(validProject).toHaveProperty("name");
        expect(validProject).toHaveProperty("description");
        expect(validProject).toHaveProperty("createdAt");
    });

    test("should allow optional updatedAt", () => {
        const projectWithoutUpdatedAt: ProjectModel = {
            id: 2,
            name: "Project without update",
            description: "Still valid",
            createdAt: new Date().toISOString(),
        };

        expect(projectWithoutUpdatedAt.updatedAt).toBeUndefined();
    });

    test("should accept null in updatedAt", () => {
        expect(validProject.updatedAt).toBeNull();
    });

    test("id should be a number", () => {
        expect(typeof validProject.id).toBe("number");
    });

    test("createdAt should be a valid ISO date string", () => {
        expect(() => new Date(validProject.createdAt)).not.toThrow();
    });
});
