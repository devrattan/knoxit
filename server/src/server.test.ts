import { describe, expect, it } from "vitest";
import { createServer } from "./server";

describe("createServer", () => {
  it("creates an Express app", () => {
    expect(createServer()).toBeTruthy();
  });
});
