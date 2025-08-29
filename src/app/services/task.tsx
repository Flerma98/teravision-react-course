import { TaskModel } from "@/app/context/taskContext";

const base = "http://localhost:8080/api";

export type PaginatedResult<T> = {
  items: T[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
};

type ListParams = {
  pageNumber?: number;
  pageSize?: number;
  showAll?: boolean;
};

/**
 * Fetch tasks using server-side pagination.
 * URL shape: /api/task?showAll=false&pageNumber=1&pageSize=10
 */
export async function fetchTasks(
  params?: ListParams
): Promise<PaginatedResult<TaskModel>> {
  const url = new URL(`${base}/task`);
  // Defaults that match the backend contract
  url.searchParams.set("showAll", String(params?.showAll ?? false));
  url.searchParams.set("pageNumber", String(params?.pageNumber ?? 1));
  url.searchParams.set("pageSize", String(params?.pageSize ?? 10));

  const response = await fetch(url.toString(), { headers: { accept: "application/json" } });
  if (!response.ok) {
    throw new Error(`Failed to fetch tasks: ${response.status}`);
  }
  // Backend returns the full paginated envelope
  return response.json();
}
