import { DataProvider } from "react-admin";
import { apiUrl } from "../constants/constants";
import httpClient from "./httpClient";

export const baseProvider: DataProvider = {
  getList: async (resource) => {
    const url =
      resource === "users" ? `${apiUrl}/users/list/` : `${apiUrl}/${resource}/`;

    const { json } = await httpClient(url);
    return {
      data: json,
      total: json.length,
    };
  }, //мб без условия

  getOne: async (resource, params) => {
    const url =
      resource === "users"
        ? `${apiUrl}/users/list/${params.id}/`
        : `${apiUrl}/${resource}/${params.id}/`;

    const { json } = await httpClient(url);
    return { data: json };
  },

  getMany: async (resource, params) => {
    const results = await Promise.all(
      params.ids.map((id) =>
        httpClient(`${apiUrl}/${resource}/${id}`).then(({ json }) => json),
      ),
    );

    return { data: results }; //
  },

  getManyReference: async () => {
    return { data: [], total: 0 };
  },

  update: async (resource, params) => {
    const { json } = await httpClient(`${apiUrl}/${resource}/${params.id}/`, {
      method: "PUT",
      body: JSON.stringify(params.data),
    });

    return { data: json };
  },

  create: async (resource, params) => {
    const { json } = await httpClient(`${apiUrl}/${resource}/`, {
      method: "POST",
      body: JSON.stringify(params.data),
    });

    return { data: json };
  },

  delete: async (resource, params) => {
    const { json } = await httpClient(`${apiUrl}/${resource}/${params.id}/`, {
      method: "DELETE",
    });

    return { data: json };
  },

  deleteMany: async (resource, params) => {
    await Promise.all(
      params.ids.map((id) =>
        httpClient(`${apiUrl}/${resource}/${id}/`, {
          method: "DELETE",
        }),
      ),
    );

    return { data: params.ids };
  },

  updateMany: async (resource, params) => {
    const results = await Promise.all(
      params.ids.map((id) =>
        httpClient(`${apiUrl}/${resource}/${id}/`, {
          method: "PUT",
          body: JSON.stringify(params.data),
        }).then(({ json }) => json),
      ),
    );

    return { data: results.map((item) => item.id) };
  },
};

export const dataProvider = {
  ...baseProvider,

  postNewEvent: async (payload: any) => {
    const { json } = await httpClient(`${apiUrl}/events/new/`, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    return { data: json };
  },

  getPlayerQrCode: async (eventId: string, playerId: string) => {
    const response = await fetch(
      `${apiUrl}/events/${eventId}/players/${playerId}/qr-code/`,
      {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
          Accept: "image/png",
        },
      },
    );

    if (!response.ok) {
      throw new Error("Ошибка при получении QR-кода");
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob);
  },
};
