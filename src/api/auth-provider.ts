import { apiUrl, IUserData } from "../constants/constants";

const authProvider = {
  login: async ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => {
    const request = new Request(`${apiUrl}/token/login/`, {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: new Headers({ "Content-Type": "application/json" }),
    });

    const response = await fetch(request);
    if (!response.ok) {
      throw new Error("Ошибка авторизации");
    }

    const data = await response.json();
    localStorage.setItem("token", data.auth_token);
    return Promise.resolve();
  },

  logout: async () => {
    const token = localStorage.getItem("token");
    if (token) {
      await fetch(`${apiUrl}/token/logout/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      });
    }
    localStorage.removeItem("token");
    return Promise.resolve();
  },

  checkAuth: async () => {
    return localStorage.getItem("token")
      ? Promise.resolve()
      : Promise.reject({ redirectTo: "/login" });
  },

  checkError: async (error: any) => {
    const status = error.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem("token");
      return Promise.reject();
    }
    return Promise.resolve();
  },

  getPermissions: async () => Promise.resolve(),

  getIdentity: async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      return Promise.reject();
    }

    const response = await fetch(`${apiUrl}/users/me/`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    });
    if (!response.ok) {
      return Promise.reject();
    }

    const data: IUserData = await response.json();

    return Promise.resolve({
      id: data.id,
      fullName: data.username,
    });
  },
};

export default authProvider;
