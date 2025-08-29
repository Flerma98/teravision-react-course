"use client"
import {editEvent} from '../action'
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from "lucide-react";
import { useState, useEffect } from 'react';
import { useEvent } from '@/app/context/eventContext';

export default function EventForm() {
    const router = useRouter();
    const { editingEvent } = useEvent();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        console.log(editingEvent)
        if (editingEvent) {
            setTitle(editingEvent.name);
            setDescription(editingEvent.description);
        } else {
            setTitle('');
            setDescription('');
        }
    }, [editingEvent]);

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
                <h1 className="text-xl font-bold">Editing {editingEvent?.id}</h1>
            </header>

            {/* Content */}
            <main className="flex-grow flex justify-center items-start pt-10 px-4">
                <form
                    action={editEvent}
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

                    <input type="hidden" name="id" value={editingEvent?.id} />
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
