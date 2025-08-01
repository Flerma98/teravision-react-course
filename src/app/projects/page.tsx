import Link from "next/link";
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'

export default function ProjectsPage() {
    const projects = Array(2).fill(null).map((_, idx) => ({
        id: idx,
        title: 'Title',
        description:
            'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s...'
    }));

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Projects</h1>

            {/* Search bar */}
            <div className="my-4 relative">
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                    type="text"
                    placeholder="Search"
                    className="w-full p-2 pl-10 rounded-full border border-gray-300"
                />
            </div>

            {/* Project list */}
            <div className="space-y-4">
                {projects.map((project) => (
                    <div key={project.id} className="bg-gray-200 rounded-2xl p-4">
                        <h2 className="font-bold text-lg">{project.title}</h2>
                        <p className="text-sm text-gray-700 mt-2">{project.description}</p>
                    </div>
                ))}
            </div>

            {/* Floating action button */}
            <Link href="/projects/form">
                <button className="fixed bottom-6 right-6 bg-orange-500 rounded-full w-14 h-14 text-white text-3xl flex items-center justify-center shadow-lg">
                    +
                </button>
            </Link>
        </div>
    );
}