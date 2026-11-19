import { afterEach, describe, expect, it, vi } from "vitest";
import { apiRequest, getAllPages } from "../../src/services/api";

describe("apiRequest", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("sends credentialed requests and parses JSON responses", async () => {
    const fetch = vi.fn().mockResolvedValue({
      headers: { get: () => "application/json; charset=utf-8" },
      json: async () => ({ id: 1 }),
      ok: true
    });
    vi.stubGlobal("fetch", fetch);

    await expect(apiRequest("/properties")).resolves.toEqual({ id: 1 });
    expect(fetch).toHaveBeenCalledWith("/api/properties", {
      credentials: "include",
      headers: { "Content-Type": "application/json" }
    });
  });

  it("returns null for successful non-JSON responses", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      headers: { get: () => "text/plain" },
      ok: true
    }));

    await expect(apiRequest("/health")).resolves.toBeNull();
  });

  it("throws an error with the response status and message", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      headers: { get: () => "application/json" },
      json: async () => ({ error: "Not authorized" }),
      ok: false,
      status: 401
    }));

    await expect(apiRequest("/private")).rejects.toMatchObject({
      message: "Not authorized",
      status: 401
    });
  });
});

describe("getAllPages", () => {
  it("collects each page and includes pagination parameters", async () => {
    const fetch = vi.fn()
      .mockResolvedValueOnce({
        headers: { get: () => "application/json" },
        json: async () => ({ items: [{ id: 1 }], pages: 2 }),
        ok: true
      })
      .mockResolvedValueOnce({
        headers: { get: () => "application/json" },
        json: async () => ({ items: [{ id: 2 }], pages: 2 }),
        ok: true
      });
    vi.stubGlobal("fetch", fetch);

    await expect(getAllPages("/properties", { status: "active" }))
      .resolves.toEqual([{ id: 1 }, { id: 2 }]);
    expect(fetch.mock.calls.map(([url]) => url)).toEqual([
      "/api/properties?status=active&page=1&per_page=50",
      "/api/properties?status=active&page=2&per_page=50"
    ]);
  });
});
