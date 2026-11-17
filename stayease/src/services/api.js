const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV
    ? "/api"
    : "https://stayease-backend-otqe.onrender.com/api");

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
    const error = new Error(
      data?.error || data?.message || `Request failed with status ${response.status}.`
    );
    error.status = response.status;
    throw error;
  }

  return data;
}

export async function getAllPages(endpoint, params = {}) {
  const items = [];
  let page = 1;

  while (true) {
    const query = new URLSearchParams({
      ...params,
      page: String(page),
      per_page: "50"
    });
    const result = await apiRequest(`${endpoint}?${query}`);
    items.push(...result.items);
    if (page >= result.pages) break;
    page += 1;
  }

  return items;
}