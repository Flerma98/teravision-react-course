import { ProjectModel } from "@/app/context/projectContext";

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
 * Fetch projects using server-side pagination.
 * URL shape: /api/project?showAll=false&pageNumber=1&pageSize=10
 */
export async function fetchProjects(
  params?: ListParams
): Promise<PaginatedResult<ProjectModel>> {
  const url = new URL(`${base}/project`);
  // Defaults that match the backend contract
  url.searchParams.set("showAll", String(params?.showAll ?? false));
  url.searchParams.set("pageNumber", String(params?.pageNumber ?? 1));
  url.searchParams.set("pageSize", String(params?.pageSize ?? 10));

  const response = await fetch(url.toString(), { headers: { accept: "application/json" } });
  if (!response.ok) {
    throw new Error(`Failed to fetch projects: ${response.status}`);
  }
  // Backend returns the full paginated envelope
  return response.json();
}
