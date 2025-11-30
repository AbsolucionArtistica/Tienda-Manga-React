const API_URL = 'http://localhost:8080/api/mangas';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const getAllMangas = async () => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Error al obtener mangas');
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getMangaById = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) {
            throw new Error('Error al obtener manga');
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const createManga = async (manga) => {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader()
            },
            body: JSON.stringify(manga),
        });
        if (!response.ok) {
            throw new Error('Error al crear manga');
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const updateManga = async (id, manga) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader()
            },
            body: JSON.stringify(manga),
        });
        if (!response.ok) {
            throw new Error('Error al actualizar manga');
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const deleteManga = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
            headers: {
                ...getAuthHeader()
            }
        });
        if (!response.ok) {
            throw new Error('Error al eliminar manga');
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
};
