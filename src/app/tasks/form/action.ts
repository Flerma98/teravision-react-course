'use server'

import {redirect} from 'next/navigation';

export async function createTask(formData: FormData) {
    const name = formData.get('name')?.toString();
    const description = formData.get('description')?.toString();

    if (!name) {
        throw new Error('Name is required');
    }

    // Cuerpo de la petición
    const body = {name, description};

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    // Llamada POST al API
    const res = await fetch('http://localhost:8080/api/task', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify(body)
    });

    if (!res.ok) {
        // Manejo de errores
        const errorText = await res.text();
        throw new Error(`Error creating task: ${errorText}`);
    }

    // Redirige a la lista de proyectos si todo salió bien
    redirect('/tasks');
}

export async function editTask(formData: FormData) {
    const id = formData.get('id')?.toString();
    const name = formData.get('name')?.toString();
    const description = formData.get('description')?.toString();

    if (!name) {
        throw new Error('Name is required');
    }

    // Cuerpo de la petición
    const body = {name, description};

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    // Llamada POST al API
    const res = await fetch(`http://localhost:8080/api/task/${id}/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify(body)
    });

    if (!res.ok) {
        // Manejo de errores
        const errorText = await res.text();
        throw new Error(`Error editing task: ${errorText}`);
    }

    // Redirige a la lista de proyectos si todo salió bien
    redirect('/tasks');
}
