import { afterEach, describe, expect, it, vi } from "vitest";
import {
  validateEmail,
  validatePassword,
  validatePositiveNumber,
  validateRequired,
  validateStay
} from "../../src/utils/Validation";

afterEach(() => {
  vi.useRealTimers();
});

describe("validateRequired", () => {
  it.each([undefined, null, "", "   "])("rejects an empty value: %s", (value) => {
    expect(validateRequired(value, "Name")).toBe("Name is required.");
  });

  it("accepts non-empty values including zero", () => {
    expect(validateRequired("  Alex  ", "Name")).toBe("");
    expect(validateRequired(0, "Count")).toBe("");
  });
});

describe("validateEmail", () => {
  it("accepts a trimmed email and rejects malformed addresses", () => {
    expect(validateEmail("  alex@example.com ")).toBe(true);
    expect(validateEmail("alex@localhost")).toBe(false);
    expect(validateEmail("alex example.com")).toBe(false);
  });
});

describe("validatePassword", () => {
  it("requires a strong password", () => {
    expect(validatePassword("")).toBe("Password is required.");
    expect(validatePassword("Short1")).toBe("Password must contain at least 8 characters.");
    expect(validatePassword("alllowercase1!")).toBe("Password must contain at least one uppercase letter.");
    expect(validatePassword("ALLUPPERCASE1!")).toBe("Password must contain at least one lowercase letter.");
    expect(validatePassword("StrongPassword!")).toBe("Password must contain at least one number.");
    expect(validatePassword("StrongPassword1")).toBe("Password must contain at least one symbol.");
    expect(validatePassword("Strong1!")).toBe("");
    expect(validatePassword("StrongPass1!")).toBe("");
  });
});

describe("validatePositiveNumber", () => {
  it("accepts positive numeric values and rejects zero, negatives, and non-numbers", () => {
    expect(validatePositiveNumber("12.5", "Price")).toBe("");
    expect(validatePositiveNumber(0, "Price")).toBe("Price must be greater than zero.");
    expect(validatePositiveNumber(-2, "Price")).toBe("Price must be greater than zero.");
    expect(validatePositiveNumber("many", "Price")).toBe("Price must be greater than zero.");
  });
});

describe("validateStay", () => {
  it("checks required, valid, past, and ordered stay dates", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2030, 0, 10, 12));

    expect(validateStay("", "")).toBe("Please select both check-in and check-out dates.");
    expect(validateStay("not-a-date", "2030-01-12")).toBe("Please select valid dates.");
    expect(validateStay("2030-01-09", "2030-01-12")).toBe("Check-in cannot be in the past.");
    expect(validateStay("2030-01-11", "2030-01-11")).toBe("Check-out must be after check-in.");
    expect(validateStay("2030-01-11", "2030-01-12")).toBe("");
  });
});
