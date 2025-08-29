import { ProjectModel } from "@/app/context/projectContext";
type ListParams = {
  limit?: number;
  offset?: number;
  q?: string;
};


/**
 * Fetch project list with optional pagination params.
 * - Keeps backward compatibility: when no params, calls the plain endpoint (your tests expect this).
 */
export async function fetchProjects(params?: ListParams): Promise<ProjectModel[]> {
  const base = "http://localhost:8080/api";
  const url = new URL(`${base}/project`);
  if (params?.limit != null) url.searchParams.set("limit", String(params.limit));
  if (params?.offset != null) url.searchParams.set("offset", String(params.offset));
  if (params?.q) url.searchParams.set("q", params.q);

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Failed to fetch projects: ${response.status}`);
  }
  return response.json();
}