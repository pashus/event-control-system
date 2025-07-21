import { DataProvider } from "@refinedev/core";
import { api } from "./api";

const customDataProvider: DataProvider = {
  getList: async ({ resource }) => {
    console.log(`LIST ${resource}`);
    if (resource.startsWith("events/")) {
      const [, eventId, subresource] = resource.split("/");

      const response = await api.get(`events/${eventId}/${subresource}`, {});

      return {
        data: response.data,
        total: response.data.length,
      };
    }

    const response = await api.get(`${resource}`, {});

    return {
      data: response.data,
      total: response.data.length,
    };
  },

  getMany: async ({ resource, ids }) => {
    console.log(`GET MANY ${resource} ${ids}`);
    if (resource.startsWith("events/")) {
      const [, eventId, subresource] = resource.split("/");

      const response = await Promise.all(
        ids.map((id) =>
          api.get(`events/${eventId}/${subresource}/${id}`).then((r) => r.data)
        )
      );

      return { data: response };
    }

    const response = await Promise.all(
      ids.map((id) => api.get(`${resource}/${id}`).then((r) => r.data))
    );

    return { data: response };
  },

  getOne: async ({ resource, id }) => {
    console.log(`GET ONE ${resource} ${id}`);
    if (resource.startsWith("events/")) {
      const [, eventId, subresource] = resource.split("/");
      const response = await api.get(`events/${eventId}/${subresource}/${id}`);

      return { data: response.data };
    }

    const response = await api.get(`${resource}/${id}`);

    return { data: response.data };
  },

  create: async ({ resource, variables }) => {
    console.log(`CREATE ${resource}, ${variables}`);
    if (resource.startsWith("events/")) {
      const [, eventId, subresource] = resource.split("/");
      const response = await api.post(
        `events/${eventId}/${subresource}/`,
        variables
      );

      return { data: response.data };
    } else if (resource === "events") {
      const response = await api.post("events/new/", variables);

      return { data: response.data };
    }

    const response = await api.post(`${resource}/`, variables);
    return { data: response.data };
  },

  update: async ({ resource, id, variables }) => {
    console.log(`UPDATE ${resource} ${id} ${variables}`);
    if (resource.startsWith("events/")) {
      const [, eventId, subresource] = resource.split("/");
      const response = await api.patch(
        `events/${eventId}/${subresource}/${id}/`,
        variables
      );

      return { data: response.data };
    }

    const response = await api.patch(`${resource}/${id}/`, variables);
    return { data: response.data };
  },

  deleteOne: async ({ resource, id }) => {
    console.log(`DELETE ONE ${resource} ${id}`);
    if (resource.startsWith("events/")) {
      const [, eventId, subresource] = resource.split("/");
      const response = await api.delete(
        `events/${eventId}/${subresource}/${id}/`
      );

      return { data: response.data };
    }

    const response = await api.delete(`${resource}/${id}/`);
    return { data: response.data };
  },

  getApiUrl: () => {
    return "http://localhost:8000/api/v1";
  },
};

export default customDataProvider;
