import { describe, expect, it } from "vitest";
import { InsufficientChipsError } from "../../../server/src/lib/chipErrors";

describe("insufficient chip errors", () => {
  it("reports the available, required, and missing chip amounts", () => {
    const error = new InsufficientChipsError(300, 500);

    expect(error.available).toBe(300);
    expect(error.required).toBe(500);
    expect(error.shortfall).toBe(200);
  });
});
