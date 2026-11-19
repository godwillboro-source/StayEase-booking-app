import { beforeEach, describe, expect, it, vi } from "vitest";
import { authService } from "../../src/services/Authservice";
import { apiRequest } from "../../src/services/api";

vi.mock("../../src/services/api", () => ({ apiRequest: vi.fn() }));

describe("authService", () => {
  beforeEach(() => vi.clearAllMocks());

  it("trims email and returns the logged-in user", async () => {
    const user = { id: 5 };
    vi.mocked(apiRequest).mockResolvedValue({ user });

    await expect(authService.login("  a@example.com ", "secret")).resolves.toBe(user);
    expect(apiRequest).toHaveBeenCalledWith("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: "a@example.com", password: "secret" })
    });
  });

  it("trims registration fields and omits an empty phone number", async () => {
    vi.mocked(apiRequest).mockResolvedValue({ message: "Created" });

    await authService.register({
      name: "  Alex Doe ",
      email: " alex@example.com ",
      phone: "  ",
      password: "secret",
      role: "customer"
    });

    expect(apiRequest).toHaveBeenCalledWith("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name: "Alex Doe",
        email: "alex@example.com",
        password: "secret",
        role: "customer"
      })
    });
  });

  it("uses the current-user endpoint and deletes the session on logout", async () => {
    vi.mocked(apiRequest).mockResolvedValue(null);

    await authService.me();
    await authService.logout();

    expect(apiRequest).toHaveBeenNthCalledWith(1, "/auth/me");
    expect(apiRequest).toHaveBeenNthCalledWith(2, "/auth/logout", { method: "DELETE" });
  });
});
