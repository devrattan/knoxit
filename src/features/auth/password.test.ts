import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "../../../server/src/lib/password";

describe("password hashing", () => {
  it("verifies the original password without storing it", async () => {
    const password = "correct horse battery staple";
    const hash = await hashPassword(password);

    expect(hash).not.toContain(password);
    await expect(verifyPassword(password, hash)).resolves.toBe(true);
    await expect(verifyPassword("incorrect password", hash)).resolves.toBe(false);
  });

  it("rejects malformed stored hashes", async () => {
    await expect(verifyPassword("anything", "not-a-password-hash")).resolves.toBe(false);
  });
});
