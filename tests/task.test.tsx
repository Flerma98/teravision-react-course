import { TaskModel } from "@/app/context/taskContext";
import { fetchTasks } from "@/app/services/task";

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

describe("fetchTasks (paginated)", () => {
  beforeEach(() => {
    (global.fetch as unknown as jest.Mock) = jest.fn();
  });

  test("should fetch and return paginated tasks with defaults", async () => {
    const envelope = {
      items: [
        {
          id: 10,
          projectId: 1,
          name: "T1",
          description: "",
          createdAt: new Date().toISOString(),
          updatedAt: null,
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

    const result = await fetchTasks();
    expect(global.fetch).toHaveBeenCalledTimes(1);

    const calledUrl = (global.fetch as jest.Mock).mock.calls[0][0] as string;
    expect(calledUrl).toBe(
      "http://localhost:8080/api/task?showAll=false&pageNumber=1&pageSize=10"
    );

    expect(result).toEqual(envelope);
  });

  test("should use provided pageNumber/pageSize", async () => {
    const envelope = { items: [], totalCount: 0, currentPage: 3, pageSize: 50, totalPages: 1 };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => envelope,
    });

    const result = await fetchTasks({ pageNumber: 3, pageSize: 50, showAll: false });
    expect(result).toEqual(envelope);

    const calledUrl = (global.fetch as jest.Mock).mock.calls[0][0] as string;
    expect(calledUrl).toBe(
      "http://localhost:8080/api/task?showAll=false&pageNumber=3&pageSize=50"
    );
  });

  test("should throw error if response is not ok", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false, status: 500 });

    await expect(fetchTasks()).rejects.toThrow("Failed to fetch tasks: 500");
  });
});
