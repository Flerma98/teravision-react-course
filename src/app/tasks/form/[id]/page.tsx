"use client"
import { editTask } from '../action'
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from "lucide-react";
import { useState, useEffect } from 'react';
import { useTask } from '@/app/context/taskContext';

export type ProjectModel = {
    id: number;
    name: string;
    description: string;
    createdAt: string;
    updatedAt?: string | null;
};

export default function TaskForm() {
    const router = useRouter();
    const { editingTask } = useTask();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [projectId, setProjectId] = useState<number | ''>('');
    const [projects, setProjects] = useState<ProjectModel[]>([]);

    // Cargar proyectos
    useEffect(() => {
        fetch("http://localhost:8080/api/project", {
            headers: { "Accept": "application/json" }
        })
            .then(res => res.json())
            .then((data: ProjectModel[]) => setProjects(data))
            .catch(err => console.error("Error cargando proyectos:", err));
    }, []);

    // Rellenar datos al editar
    useEffect(() => {
        if (editingTask) {
            setTitle(editingTask.name || '');
            setDescription(editingTask.description || '');
            setProjectId(editingTask.projectId || '');
        } else {
            setTitle('');
            setDescription('');
            setProjectId('');
        }
    }, [editingTask]);

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
                <h1 className="text-xl font-bold">Editing {editingTask?.id}</h1>
            </header>

            {/* Content */}
            <main className="flex-grow flex justify-center items-start pt-10 px-4">
                <form
                    action={editTask}
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
                            value={title}
                            onChange={e => setTitle(e.target.value)}
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
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                        ></textarea>
                    </div>

                    {/* Proyecto */}
                    <div>
                        <label className="block text-sm font-medium" htmlFor="projectId">
                            Project <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="projectId"
                            name="projectId"
                            required
                            className="mt-1 block w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
                            value={projectId}
                            onChange={e => setProjectId(Number(e.target.value))}
                        >
                            <option value="">-- Select a project --</option>
                            {projects.map(p => (
                                <option key={p.id} value={p.id}>
                                    {p.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Hidden ID */}
                    <input type="hidden" name="id" value={editingTask?.id} />

                    {/* Botón */}
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-700 transition"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </main>
        </div>
    )
}
