import { describe, expect, it } from "vitest";
import formatCurrency, { formatCurrency as namedFormatCurrency } from "../../src/utils/formatCurrency";

describe("formatCurrency", () => {
  it("formats numeric input as Kenyan shillings with no decimal places", () => {
    const formatted = formatCurrency("1234.5");

    expect(formatted).toMatch(/(?:KES|Ksh)\s*1,235/);
    expect(namedFormatCurrency(0)).toContain("0");
  });

  it("uses the zero fallback for non-finite values", () => {
    expect(formatCurrency("not a number")).toBe("KES 0");
    expect(formatCurrency(Number.POSITIVE_INFINITY)).toBe("KES 0");
  });
});
