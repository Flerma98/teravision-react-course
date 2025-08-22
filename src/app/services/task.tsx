import { TaskModel } from "@/app/context/taskContext";

export async function fetchTasks(): Promise<TaskModel[]> {
    const response = await fetch("http://localhost:8080/api/task");
    if (!response.ok) {
        throw new Error(`Failed to fetch tasks: ${response.status}`);
    }
    return response.json();
}