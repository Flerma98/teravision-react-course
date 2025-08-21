'use server'

import {redirect} from 'next/navigation';

export async function createProject(formData: FormData) {
    const name = formData.get('name')?.toString();
    const description = formData.get('description')?.toString();

    if (!name) {
        throw new Error('Name is required');
    }

    // Cuerpo de la petición
    const body = {name, description};

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    // Llamada POST al API
    const res = await fetch('http://localhost:7000/api/project', {
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
        throw new Error(`Error creating project: ${errorText}`);
    }

    // Redirige a la lista de proyectos si todo salió bien
    redirect('/projects');
}

export async function editProject(formData: FormData) {
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
    const res = await fetch(`http://localhost:7000/api/project/${id}/`, {
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
        throw new Error(`Error editing project: ${errorText}`);
    }

    // Redirige a la lista de proyectos si todo salió bien
    redirect('/projects');
}
