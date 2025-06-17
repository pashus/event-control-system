const apiUrl = "http://127.0.0.1:8000/api/v1";

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
    localStorage.setItem("username", username);
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
    localStorage.removeItem("username");
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

  getPermissions: async () => Promise.resolve("admin"),

  getIdentity: async () => {
    const username = localStorage.getItem("username");
    return Promise.resolve({
      id: username ?? "admin",
      fullName: username ?? "Admin",
    });
  },
};

export default authProvider;
