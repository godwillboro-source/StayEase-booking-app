const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV
    ? "/api"
    : "https://stayease-backend-otqe.onrender.com/api");

export const SESSION_EXPIRED_EVENT = "stayease:session-expired";

export async function apiRequest(endpoint, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...options.headers
  };
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: "include"
  });
  const contentType = response.headers.get("content-type");
  const data = contentType?.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    if (
      response.status === 401 &&
      !["/auth/login", "/auth/register", "/auth/me"].includes(endpoint) &&
      typeof window !== "undefined"
    ) {
      window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
    }

    const error = new Error(
      data?.error || data?.message || `Request failed with status ${response.status}.`
    );
    error.status = response.status;
    throw error;
  }

  return data;
}

export async function getAllPagesWithMetadata(
  endpoint,
  params = {},
  perPage = 50
) {
  const items = [];
  let page = 1;
  let metadata;

  while (true) {
    const query = new URLSearchParams({
      ...params,
      page: String(page),
      per_page: String(perPage)
    });
    const result = await apiRequest(`${endpoint}?${query}`);
    items.push(...result.items);
    metadata = {
      page: Number(result.page) || page,
      pages: Number(result.pages) || 1,
      per_page: Number(result.per_page) || perPage,
      total: Number(result.total) || items.length
    };
    if (metadata.page >= metadata.pages) break;
    page = metadata.page + 1;
  }

  return { ...metadata, items };
}

export async function getAllPages(endpoint, params = {}) {
  const result = await getAllPagesWithMetadata(endpoint, params);
  return result.items;
}