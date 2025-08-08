"use client"
import { createProject } from '../action'
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from "lucide-react";
import { useState, useEffect } from 'react';
import { useProject } from '@/app/context/projectContext';

export default function ProjectForm() {
    const router = useRouter();
    const { editingProject } = useProject();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        console.log(editingProject)
        if (editingProject) {
            setTitle(editingProject.title);
            setDescription(editingProject.description);
        } else {
            setTitle('');
            setDescription('');
        }
    }, [editingProject]);

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
                <h1 className="text-xl font-bold">Editing {editingProject?.id}</h1>
            </header>

            {/* Content */}
            <main className="flex-grow flex justify-center items-start pt-10 px-4">
                <form
                    action={createProject}
                    className="w-full max-w-xl bg-white p-6 rounded-lg shadow-md space-y-6"
                >
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
