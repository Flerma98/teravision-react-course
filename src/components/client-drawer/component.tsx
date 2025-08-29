'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu } from 'lucide-react';

export default function ClientDrawer({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="min-h-screen flex">
            {/* Mobile Menu Button */}
            <div className="absolute top-4 left-4 md:hidden z-50">
                <button onClick={() => setOpen(!open)}>
                    <Menu className="w-6 h-6" />
                </button>
            </div>

            {/* Sidebar */}
            <div
                className={`fixed z-40 top-0 left-0 h-full bg-white shadow-md p-4 w-64 transform transition-transform duration-300 md:static md:translate-x-0 ${
                    open ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <h2 className="text-lg font-bold mb-4">Menu</h2>
                <ul className="space-y-2">
                    <li><Link href="/users" onClick={() => setOpen(false)}>Users</Link></li>
                    <li><Link href="/projects" onClick={() => setOpen(false)}>Projects</Link></li>
                    <li><Link href="/tasks" onClick={() => setOpen(false)}>Tasks</Link></li>
                    <li><Link href="/events" onClick={() => setOpen(false)}>Events</Link></li>
                </ul>
            </div>

            {/* Page content */}
            <main className="flex-1 p-4 md:ml-64">{children}</main>
        </div>
    );
}
