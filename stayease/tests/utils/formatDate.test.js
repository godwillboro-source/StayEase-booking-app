import { afterEach, describe, expect, it, vi } from "vitest";
import { calculateNights, formatDate, getToday } from "../../src/utils/formatDate";

afterEach(() => {
  vi.useRealTimers();
});

describe("formatDate", () => {
  it("handles missing and invalid values", () => {
    expect(formatDate("")).toBe("Not available");
    expect(formatDate("not-a-date")).toBe("Invalid date");
  });

  it("formats a valid date with a month name", () => {
    expect(formatDate("2026-01-02")).toMatch(/2 Jan 2026/);
  });
});

describe("getToday", () => {
  it("returns today's date in YYYY-MM-DD format", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 0, 2, 12));

    expect(getToday()).toBe("2026-01-02");
  });
});

describe("calculateNights", () => {
  it("calculates nights across month boundaries", () => {
    expect(calculateNights("2026-01-30", "2026-02-02")).toBe(3);
  });

  it("returns zero when either date is missing", () => {
    expect(calculateNights("", "2026-02-02")).toBe(0);
    expect(calculateNights("2026-02-01", "")).toBe(0);
  });
});
