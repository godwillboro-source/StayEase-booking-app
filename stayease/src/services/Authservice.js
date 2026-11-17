import { apiRequest } from "./api";

export const authService = {
  async login(email, password) {
    const response = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: email.trim(), password })
    });
    return response.user;
  },

  async register(formData) {
    const response = await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone?.trim() || undefined,
        password: formData.password,
        role: formData.role
      })
    });
    return response;
  },

  async me() {
    return apiRequest("/auth/me");
  },

  async logout() {
    return apiRequest("/auth/logout", { method: "POST" });
  }
};