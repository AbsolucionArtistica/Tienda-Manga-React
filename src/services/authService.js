const API_URL = 'http://localhost:8080/api/auth';

export const login = async (username, password) => {
    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
        throw new Error('Credenciales inválidas');
    }

    return await response.json();
};

export const register = async (username, password, role = 'CLIENTE') => {
    const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, role }),
    });

    if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Error en el registro');
    }

    return await response.text();
};
