import type { AuthProvider } from "@refinedev/core";
import { api } from "@/api";

export const authProvider: AuthProvider = {
  login: async ({ username, password }) => {
    try {
      const response = await api.post("/token/login/", {
        username,
        password,
      });

      const token = response.data.auth_token;

      if (token) {
        localStorage.setItem("token", token);
        return {
          success: true,
          redirectTo: "/",
        };
      }

      return {
        success: false,
        error: {
          name: " ",
          message: "Нет токена",
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          name: " ",
          message: "Неправильное имя пользователя или пароль",
        },
      };
    }
  },

  logout: async () => {
    try {
      await api.post("/token/logout/");
    } catch (error) {
      console.warn("Logout failed on server, but clearing token anyway");
    }
    localStorage.removeItem("token");

    return {
      success: true,
      redirectTo: "/login",
    };
  },

  check: async () => {
    console.log("Проверка");

    const token = localStorage.getItem("token");
    if (!token) {
      return { authenticated: false, redirectTo: "/login" };
    }

    try {
      await api.get("/users/me/");
      return { authenticated: true };
    } catch (error: any) {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        return { authenticated: false, redirectTo: "/login" };
      }
      return { authenticated: false, redirectTo: "/login" };
    }
  },

  getPermissions: async () => null,

  getIdentity: async () => {
    if (localStorage.getItem("token")) {
      try {
        const response = await api.get("/users/me/");

        return {
          id: response.data.id,
          name: response.data.username,
          avatar: response.data.avatar,
        };
      } catch (error: any) {
        console.error(error);
      }
    }
  },

  onError: async (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      localStorage.removeItem("token");
      return { logout: true, redirectTo: "/login" };
    }
    return { error };
  },
};
