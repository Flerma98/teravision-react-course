'use client';
import {useState, useEffect} from "react";
import {MagnifyingGlassIcon} from '@heroicons/react/24/solid'
import {useRouter} from 'next/navigation';
import {useProject, ProjectModel} from '../context/projectContext';

export default function ProjectsPage() {
    const router = useRouter();
    const {setEditingProject} = useProject();

    const [projects, setProjects] = useState<ProjectModel[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await fetch("http://localhost:7000/api/project", {
                    method: "GET",
                    headers: {"accept": "application/json"}
                });
                if (!res.ok) throw new Error("Error al obtener proyectos");
                const data: ProjectModel[] = await res.json();
                setProjects(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const deleteProject = async (id: number) => {
        const res = await fetch(`http://localhost:7000/api/project/${id}/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        });

        if (!res.ok) {
            // Manejo de errores
            const errorText = await res.text();
            throw new Error(`Error deleting project: ${errorText}`);
        }

        // Redirige a la lista de proyectos si todo salió bien
        setProjects(prev => prev.filter(project => project.id !== id));
    };

    const editProject = (project: ProjectModel) => {
        setEditingProject(project);
        router.push(`projects/form/${project.id}`);
    };

    const addProject = () => {
        setEditingProject(null);
        router.push('projects/form');
    }

    return (
        <div>
            <header className="bg-orange-500 text-white p-4 shadow-md flex items-center gap-4">
                <h1 className="text-xl font-bold">Projects</h1>
            </header>

            {/* Search bar */}
            <div className="my-4 relative">
                <MagnifyingGlassIcon
                    className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"/>
                <input
                    type="text"
                    placeholder="Search"
                    className="w-full p-2 pl-10 rounded-full border border-gray-300"
                />
            </div>

            {/* Loading */}
            {loading && <p className="text-gray-500">Loading projects...</p>}

            {/* Project list */}
            <div className="space-y-4">
                {projects.map((project) => (
                    <div key={project.id} className="bg-gray-200 rounded-2xl p-4 flex items-center justify-between">
                        <div>
                            <h2 className="font-bold text-lg">{project.name}</h2>
                            <p className="text-sm text-gray-700 mt-2">{project.description}</p>
                        </div>

                        <div className="flex gap-4">
                            <button onClick={() => editProject(project)}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-8 h-8 text-blue-500 hover:text-blue-700"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                                    />
                                </svg>
                            </button>

                            <button onClick={() => deleteProject(project.id)}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-8 h-8 text-red-500 hover:text-red-700"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Floating action button */}
            <button
                onClick={addProject}
                className="fixed bottom-6 right-6 bg-orange-500 rounded-full w-14 h-14 text-white text-3xl flex items-center justify-center shadow-lg">
                +
            </button>
        </div>
    );
}
