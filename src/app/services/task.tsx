import { TaskModel } from "@/app/context/taskContext";

type ListParams = {
  limit?: number;
  offset?: number;
  q?: string;
};

/**
 * Fetch task list with optional pagination params.
 * - Keeps backward compatibility: when no params, calls the plain endpoint (your tests expect this).
 */
export async function fetchTasks(params?: ListParams): Promise<TaskModel[]> {
  const base = "http://localhost:8080/api";
  const url = new URL(`${base}/task`);
  if (params?.limit != null) url.searchParams.set("limit", String(params.limit));
  if (params?.offset != null) url.searchParams.set("offset", String(params.offset));
  if (params?.q) url.searchParams.set("q", params.q);

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Failed to fetch tasks: ${response.status}`);
  }
  return response.json();
}
