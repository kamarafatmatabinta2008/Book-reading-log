import { NextResponse } from "next/server";

const HOP_BY_HOP_HEADERS = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
]);

function getAllowedHosts(): string[] {
  const raw = process.env.PROXY_ALLOWED_HOSTS ?? "";
  const list = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  // In development, allow a sensible default list to make local testing easier
  if (list.length === 0 && process.env.NODE_ENV !== 'production') {
    return [
      'gutendex.com',
      'www.gutenberg.org',
      'gutenberg.org',
      'openlibrary.org',
      'covers.openlibrary.org',
    ];
  }

  return list;
}

function isHostAllowed(target: URL, allowedHosts: string[]): boolean {
  if (allowedHosts.length === 0) return false;
  const host = target.hostname.toLowerCase();
  return allowedHosts.some((allowed) => allowed.toLowerCase() === host);
}

function buildForwardHeaders(req: Request): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of req.headers) {
    const lower = key.toLowerCase();
    if (HOP_BY_HOP_HEADERS.has(lower)) continue;
    if (lower === "host") continue;
    if (lower === "x-proxy-url") continue;
    out[key] = value;
  }
  out["x-forwarded-by"] = "nextjs-proxy";
  // Set a default User-Agent if not present (some servers require this)
  if (!out["user-agent"]) {
    out["user-agent"] = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
  }
  return out;
}

function buildResponseHeaders(source: Headers): Headers {
  const headers = new Headers();
  for (const [k, v] of source) {
    const lower = k.toLowerCase();
    if (HOP_BY_HOP_HEADERS.has(lower)) continue;
    if (lower === "set-cookie") continue;
    if (lower === "x-frame-options" || lower === "content-security-policy" || lower === "content-security-policy-report-only" || lower === "x-content-security-policy" || lower === "x-webkit-csp") {
      continue;
    }
    headers.set(k, v);
  }
  headers.set("access-control-allow-origin", "*");
  return headers;
}

function getTargetUrl(req: Request): URL {
  const requestUrl = new URL(req.url);
  const searchParam = requestUrl.searchParams.get("url");
  const headerUrl = req.headers.get("x-proxy-url") ?? undefined;
  const raw = searchParam ?? headerUrl;

  if (!raw) {
    throw new TypeError("Missing target URL. Provide `url` query param or `x-proxy-url` header.");
  }

  const target = new URL(raw);
  return target;
}

async function forwardRequest(req: Request): Promise<Response> {
  const allowedHosts = getAllowedHosts();
  if (allowedHosts.length === 0) {
    return new Response("Proxy disabled: no allowed hosts configured.", { status: 403 });
  }

  let target: URL;
  try {
    target = getTargetUrl(req);
  } catch (err) {
    return new Response(String((err as Error).message), { status: 400 });
  }

  if (!isHostAllowed(target, allowedHosts)) {
    return new Response("Target host is not allowed by proxy configuration.", { status: 403 });
  }

  const init: RequestInit = {
    method: req.method,
    headers: buildForwardHeaders(req),
    redirect: "follow",
  };

  if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method.toUpperCase())) {
    try {
      const clone = req.clone();
      init.body = await clone.arrayBuffer().then((buf) => Buffer.from(buf));
    } catch {
    }
  }

  let upstream: Response;
  try {
    upstream = await fetch(target.toString(), init);
  } catch (err) {
    return new Response("Error fetching target: " + String((err as Error).message), { status: 502 });
  }

  const responseHeaders = buildResponseHeaders(upstream.headers);
  const body = upstream.body;
  const status = upstream.status;

  return new NextResponse(body, { status, headers: responseHeaders });
}

export async function OPTIONS(): Promise<Response> {
  const allowedHosts = getAllowedHosts();
  if (allowedHosts.length === 0) {
    return new Response("Proxy disabled: no allowed hosts configured.", { status: 403 });
  }

  const headers = new Headers();
  headers.set("access-control-allow-origin", "*");
  headers.set("access-control-allow-methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  headers.set("access-control-allow-headers", "Content-Type,Authorization,x-proxy-url");
  headers.set("access-control-max-age", "600");
  return new NextResponse(null, { status: 204, headers });
}

export async function GET(req: Request): Promise<Response> {
  return await forwardRequest(req);
}

export async function POST(req: Request): Promise<Response> {
  return await forwardRequest(req);
}

export async function PUT(req: Request): Promise<Response> {
  return await forwardRequest(req);
}

export async function PATCH(req: Request): Promise<Response> {
  return await forwardRequest(req);
}

export async function DELETE(req: Request): Promise<Response> {
  return await forwardRequest(req);
}
