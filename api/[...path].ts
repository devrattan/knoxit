import type { IncomingMessage, ServerResponse } from "node:http";

const REQUEST_HEADERS_TO_DROP = new Set([
  "connection",
  "content-length",
  "host",
  "transfer-encoding",
]);

const RESPONSE_HEADERS_TO_DROP = new Set([
  "connection",
  "content-encoding",
  "content-length",
  "transfer-encoding",
]);

async function readRequestBody(request: IncomingMessage) {
  const chunks: Buffer[] = [];
  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return chunks.length > 0 ? Buffer.concat(chunks) : undefined;
}

function getBackendOrigin() {
  const configured = process.env.BACKEND_ORIGIN?.trim();
  if (!configured) return undefined;

  try {
    const url = new URL(configured);
    if (url.protocol !== "https:" && url.protocol !== "http:") return undefined;
    return url.origin;
  } catch {
    return undefined;
  }
}

export default async function handler(request: IncomingMessage, response: ServerResponse) {
  const backendOrigin = getBackendOrigin();
  if (!backendOrigin) {
    response.statusCode = 503;
    response.setHeader("Content-Type", "application/json; charset=utf-8");
    response.end(JSON.stringify({ error: "API proxy is not configured" }));
    return;
  }

  try {
    const incomingUrl = new URL(request.url ?? "/api", "http://knoxit.local");
    const upstreamUrl = new URL(`${incomingUrl.pathname}${incomingUrl.search}`, backendOrigin);
    const headers = new Headers();

    for (const [name, value] of Object.entries(request.headers)) {
      if (REQUEST_HEADERS_TO_DROP.has(name.toLowerCase()) || value === undefined) continue;
      headers.set(name, Array.isArray(value) ? value.join(", ") : value);
    }

    const method = request.method ?? "GET";
    const body = method === "GET" || method === "HEAD" ? undefined : await readRequestBody(request);
    const upstream = await fetch(upstreamUrl, {
      method,
      headers,
      body,
      redirect: "manual",
      signal: AbortSignal.timeout(30_000),
    });

    response.statusCode = upstream.status;
    upstream.headers.forEach((value, name) => {
      if (name.toLowerCase() !== "set-cookie" && !RESPONSE_HEADERS_TO_DROP.has(name.toLowerCase())) {
        response.setHeader(name, value);
      }
    });

    const responseHeaders = upstream.headers as Headers & { getSetCookie?: () => string[] };
    const setCookies = responseHeaders.getSetCookie?.();
    if (setCookies?.length) response.setHeader("Set-Cookie", setCookies);
    else {
      const setCookie = upstream.headers.get("set-cookie");
      if (setCookie) response.setHeader("Set-Cookie", setCookie);
    }

    response.end(Buffer.from(await upstream.arrayBuffer()));
  } catch (error) {
    const timedOut = error instanceof Error && error.name === "TimeoutError";
    response.statusCode = timedOut ? 504 : 502;
    response.setHeader("Content-Type", "application/json; charset=utf-8");
    response.end(JSON.stringify({ error: timedOut ? "API request timed out" : "API is unavailable" }));
  }
}
