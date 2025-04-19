type TAuth = {
    username: string;
    password?: string;
}

const authProvider = {
    login: ({ username }: TAuth) => {
        localStorage.setItem('username', username);
        return Promise.resolve();
    },
    logout: () => {
        localStorage.removeItem('username');
        return Promise.resolve();
    },
    checkAuth: () => {
        return localStorage.getItem('username')
            ? Promise.resolve()
            : Promise.reject();
    },
    checkError: (error: any) => {
        return Promise.resolve(); 
    },
    getPermissions: () => {
        const username = localStorage.getItem('username');
        return Promise.resolve(username === 'admin' ? 'admin' : 'user');
    },
};

export default authProvider;
