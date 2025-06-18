import { AuthProvider } from "react-admin";
import { apiUrl } from "../constants/constants";
import httpClient from "./httpClient";

const authProvider: AuthProvider = {
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
    } catch (error) {
      throw new Error("Ошибка авторизации");
    }
  },

  logout: async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }

    const { json, status } = await httpClient(`${apiUrl}/token/logout`, {
      method: "POST",
    });
    if (status < 200 || status >= 300) {
      throw new Error();
    }

    localStorage.removeItem("token");
  },

  checkAuth: async () => {
    if (localStorage.getItem("token")) {
      return;
    }
    throw new Error();
  },

  checkError: async (error) => {
    const status = error.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem("token");
      throw new Error();
    }
    return;
  },

  getPermissions: async () => {},

  getIdentity: async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error();
    }

    const { json, status } = await httpClient(`${apiUrl}/users/me/`, {});
    if (status < 200 || status >= 300) {
      throw new Error();
    }

    return {
      id: json.id,
      fullName: json.username,
    };
  },
};

export default authProvider;
