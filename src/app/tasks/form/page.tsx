"use client"
import { createTask } from './action'
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from "lucide-react";
import { useEffect, useState } from "react";

export type ProjectModel = {
    id: number;
    name: string;
    description: string;
    createdAt: string;
    updatedAt?: string | null;
};

export default function TaskForm() {
    const router = useRouter()
    const [projects, setProjects] = useState<ProjectModel[]>([]);

    // Cargar proyectos desde la API
    useEffect(() => {
        fetch("http://localhost:8080/api/project", {
            headers: { "Accept": "application/json" }
        })
            .then(res => res.json())
            .then((data: ProjectModel[]) => setProjects(data))
            .catch(err => console.error("Error cargando proyectos:", err));
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* AppBar */}
            <header className="bg-orange-500 text-white p-4 shadow-md flex items-center gap-4">
                <button
                    onClick={() => router.back()}
                    className="hover:text-orange-200 transition"
                    aria-label="Go back"
                >
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-bold">Create Task</h1>
            </header>

            {/* Content */}
            <main className="flex-grow flex justify-center items-start pt-10 px-4">
                <form
                    action={createTask}
                    className="w-full max-w-xl bg-white p-6 rounded-lg shadow-md space-y-6"
                >
                    {/* Nombre */}
                    <div>
                        <label className="block text-sm font-medium" htmlFor="name">
                            Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            className="mt-1 block w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                    </div>

                    {/* Descripción */}
                    <div>
                        <label className="block text-sm font-medium" htmlFor="description">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            rows={4}
                            className="mt-1 block w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
                        ></textarea>
                    </div>

                    {/* Select de Proyectos */}
                    <div>
                        <label className="block text-sm font-medium" htmlFor="projectId">
                            Project <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="projectId"
                            name="projectId"
                            required
                            className="mt-1 block w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
                        >
                            <option value="">-- Select a project --</option>
                            {projects.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Botón */}
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-700 transition"
                        >
                            Create
                        </button>
                    </div>
                </form>
            </main>
        </div>
    )
}
