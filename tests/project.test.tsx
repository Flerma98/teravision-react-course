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

describe("fetchProjects (paginated)", () => {
  beforeEach(() => {
    // mock global fetch
    (global.fetch as unknown as jest.Mock) = jest.fn();
  });

  test("should fetch and return paginated projects with defaults", async () => {
    const envelope = {
      items: [
        {
          id: 1,
          name: "Project1",
          description: "first test",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isDeleted: false,
        },
      ],
      totalCount: 1,
      currentPage: 1,
      pageSize: 10,
      totalPages: 1,
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => envelope,
    });

    const result = await fetchProjects();
    expect(global.fetch).toHaveBeenCalledTimes(1);

    // Assert URL shape with default params
    const calledUrl = (global.fetch as jest.Mock).mock.calls[0][0] as string;
    expect(calledUrl).toBe(
      "http://localhost:8080/api/project?showAll=false&pageNumber=1&pageSize=10"
    );

    expect(result).toEqual(envelope);
  });

  test("should use provided pageNumber/pageSize", async () => {
    const envelope = { items: [], totalCount: 0, currentPage: 2, pageSize: 20, totalPages: 1 };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => envelope,
    });

    const result = await fetchProjects({ pageNumber: 2, pageSize: 20, showAll: false });
    expect(result).toEqual(envelope);

    const calledUrl = (global.fetch as jest.Mock).mock.calls[0][0] as string;
    expect(calledUrl).toBe(
      "http://localhost:8080/api/project?showAll=false&pageNumber=2&pageSize=20"
    );
  });

  test("should throw error if response is not ok", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false, status: 500 });

    await expect(fetchProjects()).rejects.toThrow("Failed to fetch projects: 500");
  });
});
