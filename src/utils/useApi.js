import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";

export const useApi = () => {
  const { accessToken, refreshAccessToken, logout } = useContext(AuthContext);

  const callApi = async (url, options = {}) => {
    let token = accessToken;

    const isFormData = options.body instanceof FormData;

    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
    };

    let response = await fetch(url, options);

    if (response.status === 401) {
      const newToken = await refreshAccessToken();

      if (!newToken) {
        logout();
        throw new Error("Session expired. Please login again.");
      }

      options.headers.Authorization = `Bearer ${newToken}`;
      response = await fetch(url, options);
    }

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(errText || "API request failed");
    }

    return response.json();
  };

  const get = (url, options = {}) => callApi(url, { ...options, method: "GET" });
  const post = (url, body, options = {}) =>
    callApi(url, { ...options, method: "POST", body });
  const put = (url, body, options = {}) =>
    callApi(url, { ...options, method: "PUT", body: JSON.stringify(body) });
  const del = (url, options = {}) => callApi(url, { ...options, method: "DELETE" });

  return { callApi, get, post, put, delete: del };
};

export default useApi;
