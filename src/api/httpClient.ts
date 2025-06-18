import { fetchUtils } from "react-admin";

const httpClient = (url: string, options: any = {}) => {
  if (!options.headers) {
    options.headers = new Headers({ Accept: "application/json" });
  }

  const token = localStorage.getItem("token");
  if (token) {
    options.headers.set("Authorization", `Token ${token}`);
  }

  return fetchUtils.fetchJson(url, options);
};

export default httpClient;
