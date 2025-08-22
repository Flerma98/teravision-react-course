import { ProjectModel } from "@/app/context/projectContext";
import { fetchProjects } from "@/app/services/project";

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

describe("fetchProjects", () => {
    beforeEach(() => {
        global.fetch = jest.fn(); // 👈 mock global fetch
    });

    test("should fetch and return projects", async () => {
        const mockProjects: ProjectModel[] = [
            {
                id: 1,
                name: "First Project",
                description: "This is the first project",
                createdAt: new Date().toISOString(),
                updatedAt: null,
            },
        ];

        // mock implementación de fetch
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => mockProjects,
        });

        const result = await fetchProjects();

        expect(global.fetch).toHaveBeenCalledWith("http://localhost:8080/api/project");
        expect(result).toEqual(mockProjects);
    });

    test("should throw error if response is not ok", async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            status: 500,
        });

        await expect(fetchProjects()).rejects.toThrow("Failed to fetch projects: 500");
    });
});