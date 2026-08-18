import { describe, expect, it } from "vitest";
import {
  DEFAULT_BETA_STARTING_CHIPS,
  getBetaStartingChips,
} from "../../../server/src/lib/betaChips";

describe("beta starting chip configuration", () => {
  it("defaults to 1,000 chips when unset", () => {
    expect(getBetaStartingChips(undefined)).toBe(DEFAULT_BETA_STARTING_CHIPS);
    expect(getBetaStartingChips("   ")).toBe(DEFAULT_BETA_STARTING_CHIPS);
  });

  it("accepts a safe non-negative integer", () => {
    expect(getBetaStartingChips("0")).toBe(0);
    expect(getBetaStartingChips("2500")).toBe(2_500);
  });

  it.each(["-1", "1.5", "not-a-number", "1000001"])(
    "falls back for invalid value %s",
    (value) => {
      expect(getBetaStartingChips(value)).toBe(DEFAULT_BETA_STARTING_CHIPS);
    }
  );
});
