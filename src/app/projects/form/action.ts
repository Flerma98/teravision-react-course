'use server'

import { redirect } from 'next/navigation'

export async function createProject(formData: FormData) {
    const name = formData.get('name')?.toString()
    const description = formData.get('description')?.toString()

    if (!name) {
        throw new Error('Name is required')
    }

    // Simula guardar en base de datos aquí
    console.log({ name, description })

    // Redirige a la lista de proyectos
    redirect('/projects')
}
