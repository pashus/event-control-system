import { DataProvider } from "@refinedev/core";
import { api } from "./api";

const customDataProvider: DataProvider = {
  getList: async ({ resource, meta }) => {
    console.log(`LIST ${resource}`);

    let url: string;
    meta?.parent
      ? (url = `${meta?.parent.resource}/${meta?.parent.id}/${resource}/`)
      : (url = `${resource}/`);

    const response = await api.get(url);
    return {
      data: Array.isArray(response.data) ? response.data : [],
      total: Array.isArray(response.data) ? response.data.length : 0,
    };
  },

  // getMany: async ({ resource, ids }) => {
  //   console.log(`GET MANY ${resource} ${ids}`);

  //   const response = await Promise.all(
  //     ids.map((id) => api.get(`${resource}/${id}`).then((r) => r.data))
  //   );
  //   return { data: response };
  // },

  getOne: async ({ resource, id, meta }) => {
    console.log(`GET ONE ${resource} ${id}`);

    let url: string;
    meta?.parent
      ? (url = `${meta?.parent.resource}/${meta?.parent.id}/${resource}/${id}/`)
      : (url = `${resource}/${id}/`);

    const response = await api.get(url);
    return {
      data: response.data,
    };
  },

  create: async ({ resource, variables, meta }) => {
    console.log(`CREATE ${resource}, ${variables}`);

    let url: string;
    meta?.parent
      ? (url = `${meta?.parent.resource}/${meta?.parent.id}/${resource}/`)
      : (url = `${resource}/`);

    if (resource === "events") {
      url = `events/new/`;
    }

    const response = await api.post(url, variables);
    return {
      data: response.data,
    };
  },

  update: async ({ resource, id, variables, meta }) => {
    console.log(`UPDATE ${resource} ${id} ${variables}`);

    let url: string;
    meta?.parent
      ? (url = `${meta?.parent.resource}/${meta?.parent.id}/${resource}/${id}/`)
      : (url = `${resource}/${id}/`);

    const response = await api.patch(url, variables);
    return {
      data: response.data,
    };
  },

  deleteOne: async ({ resource, id, meta }) => {
    console.log(`DELETE ONE ${resource} ${id}`);

    let url: string;
    meta?.parent
      ? (url = `${meta?.parent.resource}/${meta?.parent.id}/${resource}/${id}/`)
      : (url = `${resource}/${id}/`);

    const response = await api.delete(url);
    return {
      data: response.data,
    };
  },

  getApiUrl: () => {
    return "http://localhost:8000/api/v1/";
  },
};

export default customDataProvider;
