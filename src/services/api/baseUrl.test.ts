import { describe, expect, it } from "vitest";
import { resolveApiBaseUrl } from "./baseUrl";

describe("resolveApiBaseUrl", () => {
  const appOrigin = "https://knoxit.example";

  it("uses the same-origin API proxy when no URL is configured", () => {
    expect(resolveApiBaseUrl(undefined, appOrigin)).toBe("");
    expect(resolveApiBaseUrl("   ", appOrigin)).toBe("");
  });

  it("keeps relative and same-origin API URLs", () => {
    expect(resolveApiBaseUrl("/backend", appOrigin)).toBe("/backend");
    expect(resolveApiBaseUrl("https://knoxit.example/backend", appOrigin)).toBe(
      "https://knoxit.example/backend"
    );
  });

  it("rejects a cross-origin API URL so cookies remain first-party", () => {
    expect(resolveApiBaseUrl("https://knoxit-api.onrender.com", appOrigin)).toBe("");
  });

  it("falls back to the proxy for an invalid URL", () => {
    expect(resolveApiBaseUrl("https://[invalid", appOrigin)).toBe("");
  });
});
