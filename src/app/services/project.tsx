import { ProjectModel } from "@/app/context/projectContext";

export async function fetchProjects(): Promise<ProjectModel[]> {
    const response = await fetch("http://localhost:8080/api/project");
    if (!response.ok) {
        throw new Error(`Failed to fetch projects: ${response.status}`);
    }
    return response.json();
}