import axios from "axios";

/**
 * Base API client. Real endpoints aren't wired up in this iteration — the
 * frontend uses local mock data — but the client is kept here so backend
 * integration can drop in without a refactor.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000",
});

export default api;
