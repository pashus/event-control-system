import { AuthProvider } from 'react-admin';

type TAuth = {
    username: string;
    password: string;
}

const apiUrl = '/api';

export const authProvider: AuthProvider = {
    login: async ({ username, password }: TAuth) => {
        try {
            const response = await fetch(`${apiUrl}/token/login/`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ 
                    username: username.trim(),
                    password: password.trim()
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                const errorDetails = errorData.detail || errorData.message || JSON.stringify(errorData);
                throw new Error(errorDetails || `HTTP ${response.status}`);
            }

            const data = await response.json();
            
            const token = data.auth_token;
            if (!token) {
                console.error('Формат ответа сервера:', data);
                throw new Error('Токен не найден в ответе');
            }

            localStorage.setItem('auth_token', token);
            localStorage.setItem('username', username);
            return Promise.resolve();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
            console.error('Ошибка авторизации:', errorMessage);
            return Promise.reject(errorMessage);
        }
    },

    logout: async () => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            try {
                await fetch(`${apiUrl}/token/logout/`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Token ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
            } catch (error) {
                console.error('Ошибка при выходе:', error);
            }
        }
        
        localStorage.removeItem('auth_token');
        localStorage.removeItem('username');
        return Promise.resolve();
    },

    checkAuth: () => {
        return localStorage.getItem('auth_token') 
            ? Promise.resolve() 
            : Promise.reject('Токен отсутствует');
    },

    checkError: (error) => {
        if (error?.status === 401 || error?.status === 403) {
            localStorage.removeItem('auth_token');
            return Promise.reject();
        }
        return Promise.resolve();
    },

    getPermissions: () => {
        const username = localStorage.getItem('username');
        return Promise.resolve(username === 'admin' ? 'admin' : 'user');
    },
};

export default authProvider;