import { fetchUtils } from 'react-admin';
import { DataProvider } from 'react-admin';

const API_URL = 'http://127.0.0.1:8000/api/v1';

const httpClient = (url: string, options: any = {}) => {
    if (!options.headers) {
        options.headers = new Headers({ Accept: 'application/json' });
    }

    const token = localStorage.getItem('token');
    if (token) {
        options.headers.set('Authorization', `Token ${token}`);
    }

    return fetchUtils.fetchJson(url, options);
};

export const dataProvider: DataProvider = {
    getList: (resource, params) => {
        // Обработка участников мероприятия
        if (resource === 'event_players') {
            const eventId = params.filter?.event_id;
            if (!eventId) return Promise.resolve({ data: [], total: 0 });
            
            const url = `${API_URL}/events/${eventId}/players/`;
            return httpClient(url).then(({ json }) => ({
                data: json.map((item: any) => ({ ...item, id: item.id })),
                total: json.length,
        }));
    }

        // Стандартная обработка
        const url = `${API_URL}/${resource}/`;
        return httpClient(url).then(({ json }) => ({
            data: json,
            total: json.length,
        }));
    },

    getOne: (resource, params) =>
        httpClient(resource === 'users'
            ? `${API_URL}/users/list/${params.id}/`
            : `${API_URL}/${resource}/${params.id}/`
        ).then(({ json }) => ({
            data: json,
        })),
        

    getMany: (resource, params) => {
        const query = params.ids.map(id => `${API_URL}/${resource}/${id}`);
        return Promise.all(query.map(url => httpClient(url).then(({ json }) => json))).then(data => ({
            data,
        }));
    },

    getManyReference: (resource, params) => {
        return Promise.resolve({ data: [], total: 0 });
    },

    update: (resource, params) =>
        httpClient(`${API_URL}/${resource}/${params.id}/`, {
            method: 'PUT',
            body: JSON.stringify(params.data),
        }).then(({ json }) => ({ data: json })),

    create: (resource, params) => {
        // Обработка создания участника
            if (resource === 'event_players') {
            const eventId = params.data.event_id;
            const url = `${API_URL}/events/${eventId}/players/`;
            
            return httpClient(url, {
                method: 'POST',
                body: JSON.stringify({
                    first_name: params.data.first_name,
                    last_name: params.data.last_name,
                    group_name: params.data.group_name
                }),
            }).then(({ json }) => ({ data: json }));
        }
        // Стандартное создание для других ресурсов
        return httpClient(`${API_URL}/${resource}/`, {
            method: 'POST',
            body: JSON.stringify(params.data),
        }).then(({ json }) => ({ data: json }));
    },

    delete: (resource, params) =>
        httpClient(`${API_URL}/${resource}/${params.id}/`, {
            method: 'DELETE',
        }).then(({ json }) => ({ data: json })),

    deleteMany: (resource, params) => {
        return Promise.all(
            params.ids.map(id =>
                httpClient(`${API_URL}/${resource}/${id}/`, {
                    method: 'DELETE',
                })
            )
        ).then(() => ({ data: params.ids }));
    },

    updateMany: (resource, params) => {
        return Promise.all(
            params.ids.map(id =>
                httpClient(`${API_URL}/${resource}/${id}/`, {
                    method: 'PUT',
                    body: JSON.stringify(params.data),
                }).then(({ json }) => json)
            )
        ).then(data => ({ data: data.map(item => item.id) }));
    },
    
};



export const getEventPlayers = async (eventId: string) => {
    const token = localStorage.getItem('auth_token');
    const headers = new Headers({
        'Accept': 'application/json',
        'Authorization': `Token ${token}`,
    });

    const url = `http://127.0.0.1:8000/api/v1/events/${eventId}/players/`;

    const response = await fetch(url, { headers });
    if (!response.ok) {
        throw new Error('Ошибка при получении участников');
    }

    const json = await response.json();
    return json.map((player: any) => ({
        ...player,
        id: player.id, // RA требует поле id
    }));
};