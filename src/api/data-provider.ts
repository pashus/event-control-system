import { DataProvider } from "react-admin";
import { apiUrl } from "../constants/constants";
import httpClient from "./httpClient";

export const dataProvider: DataProvider = {
  getList: (resource, params) => {
    const url =
      resource === "users" ? `${apiUrl}/users/list/` : `${apiUrl}/${resource}/`;

    return httpClient(url).then(({ json }) => ({
      data: json,
      total: json.length,
    }));
  }, //мб без условия

  getOne: (resource, params) =>
    httpClient(
      resource === "users"
        ? `${apiUrl}/users/list/${params.id}/`
        : `${apiUrl}/${resource}/${params.id}/`,
    ).then(({ json }) => ({
      data: json,
    })),

  getMany: (resource, params) => {
    const query = params.ids.map((id) => `${apiUrl}/${resource}/${id}`);
    return Promise.all(
      query.map((url) => httpClient(url).then(({ json }) => json)),
    ).then((data) => ({
      data,
    }));
  },

  getManyReference: () => {
    return Promise.resolve({ data: [], total: 0 });
  },

  update: (resource, params) =>
    httpClient(`${apiUrl}/${resource}/${params.id}/`, {
      method: "PUT",
      body: JSON.stringify(params.data),
    }).then(({ json }) => ({ data: json })),

  create: (resource, params) =>
    httpClient(`${apiUrl}/${resource}/`, {
      method: "POST",
      body: JSON.stringify(params.data),
    }).then(({ json }) => ({ data: json })),

  delete: (resource, params) =>
    httpClient(`${apiUrl}/${resource}/${params.id}/`, {
      method: "DELETE",
    }).then(({ json }) => ({ data: json })),

  deleteMany: (resource, params) => {
    return Promise.all(
      params.ids.map((id) =>
        httpClient(`${apiUrl}/${resource}/${id}/`, {
          method: "DELETE",
        }),
      ),
    ).then(() => ({ data: params.ids }));
  },

  updateMany: (resource, params) => {
    return Promise.all(
      params.ids.map((id) =>
        httpClient(`${apiUrl}/${resource}/${id}/`, {
          method: "PUT",
          body: JSON.stringify(params.data),
        }).then(({ json }) => json),
      ),
    ).then((data) => ({ data: data.map((item) => item.id) }));
  },
};
