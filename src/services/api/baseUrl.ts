/**
 * Session authentication relies on a first-party HttpOnly cookie. Sending API
 * requests directly to a different origin turns it into a third-party cookie,
 * which modern browsers may reject even when `credentials: "include"` is set.
 */
export function resolveApiBaseUrl(configuredUrl: string | undefined, appOrigin: string) {
  const configured = configuredUrl?.trim();
  if (!configured) return "";

  try {
    const target = new URL(configured, `${appOrigin}/`);
    return target.origin === appOrigin ? configured : "";
  } catch {
    return "";
  }
}
