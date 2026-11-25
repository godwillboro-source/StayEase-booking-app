import { afterEach, describe, expect, it, vi } from "vitest";
import {
  apiRequest,
  getAllPages,
  getAllPagesWithMetadata,
  SESSION_EXPIRED_EVENT
} from "../../src/services/api";

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

  it("signals an expired session for unauthorized API requests", async () => {
    const dispatchEvent = vi.spyOn(window, "dispatchEvent");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      headers: { get: () => "application/json" },
      json: async () => ({ error: "Session expired" }),
      ok: false,
      status: 401
    }));

    await expect(apiRequest("/bookings")).rejects.toMatchObject({ status: 401 });
    expect(dispatchEvent).toHaveBeenCalledWith(
      expect.objectContaining({ type: SESSION_EXPIRED_EVENT })
    );
  });

  it("does not treat invalid login credentials as an expired session", async () => {
    const dispatchEvent = vi.spyOn(window, "dispatchEvent");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      headers: { get: () => "application/json" },
      json: async () => ({ error: "Invalid credentials" }),
      ok: false,
      status: 401
    }));

    await expect(apiRequest("/auth/login")).rejects.toMatchObject({ status: 401 });
    expect(dispatchEvent).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: SESSION_EXPIRED_EVENT })
    );
  });

  it("does not treat the initial session check as an expired session", async () => {
    const dispatchEvent = vi.spyOn(window, "dispatchEvent");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      headers: { get: () => "application/json" },
      json: async () => ({ error: "Not authenticated" }),
      ok: false,
      status: 401
    }));

    await expect(apiRequest("/auth/me")).rejects.toMatchObject({ status: 401 });
    expect(dispatchEvent).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: SESSION_EXPIRED_EVENT })
    );
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

  it("returns backend page metadata for the collected collection", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      headers: { get: () => "application/json" },
      json: async () => ({
        items: [{ id: 1 }],
        page: 1,
        pages: 1,
        per_page: 8,
        total: 1
      }),
      ok: true
    }));

    await expect(getAllPagesWithMetadata("/bookings", {}, 8))
      .resolves.toEqual({
        items: [{ id: 1 }],
        page: 1,
        pages: 1,
        per_page: 8,
        total: 1
      });
  });
});
