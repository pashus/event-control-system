import { apiUrl } from "../constants/constants";
import httpClient from "./httpClient";

const authProvider = {
  login: async ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => {
    try {
      const { json, status } = await httpClient(`${apiUrl}/token/login/`, {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });

      localStorage.setItem("token", json.auth_token);
      return Promise.resolve();
    } catch (error) {
      throw new Error("Ошибка авторизации");
    }
  },

  logout: async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      return Promise.resolve();
    }

    const { json, status } = await httpClient(`${apiUrl}/token/logout`, {
      method: "POST",
    });
    if (status < 200 || status >= 300) {
      return Promise.reject();
    }

    localStorage.removeItem("token");
    return Promise.resolve();
  },

  checkAuth: async () => {
    return localStorage.getItem("token") ? Promise.resolve() : Promise.reject();
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

    const { json, status } = await httpClient(`${apiUrl}/users/me/`, {});
    if (status < 200 || status >= 300) {
      return Promise.reject();
    }

    return Promise.resolve({
      id: json.id,
      fullName: json.username,
    });
  },
};

export default authProvider;
