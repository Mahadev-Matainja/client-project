// app/proxy/[...path]/route.ts
import { NextRequest, NextResponse } from "next/server";

// Derive origin and base from NEXT_PUBLIC_BACKEND_API_URL, e.g. http://predikradmin.code-dev.in/api
const RAW = process.env.NEXT_PUBLIC_BACKEND_API_URL || "";

function parseBackend(urlLike: string): { origin: string; base: string } {
  try {
    const u = new URL(urlLike);
    const origin = u.origin;
    const base = u.pathname.replace(/\/+$/, "") || "";
    return { origin, base };
  } catch {
    return { origin: "", base: "" };
  }
}

const { origin: ORIGIN, base: BASE } = parseBackend(RAW);

function buildTarget(parts: string[], search: string) {
  const joined = parts.join("/");
  const base = BASE ? `/${BASE.replace(/^\/+/, "")}` : "";
  return `${ORIGIN}${base}/${joined}${search ? `?${search}` : ""}`;
}

async function proxy(request: Request, parts: string[]) {
  if (!ORIGIN) {
    return NextResponse.json(
      { message: "NEXT_PUBLIC_BACKEND_API_URL is missing or invalid" },
      { status: 500 }
    );
  }

  const url = new URL(request.url);
  const target = buildTarget(parts, url.searchParams.toString());

  const headers = new Headers(request.headers);
  [
    "host",
    "connection",
    "keep-alive",
    "accept-encoding",
    "content-length",
  ].forEach((h) => headers.delete(h));
  headers.set("origin", ORIGIN);

  const hasBody = !["GET", "HEAD"].includes(request.method);
  const body = hasBody ? await request.arrayBuffer() : undefined;

  const res = await fetch(target, {
    method: request.method,
    headers,
    body,
    redirect: "manual",
  });

  const out = new Headers(res.headers);
  ["access-control-allow-origin", "access-control-allow-credentials"].forEach(
    (h) => out.delete(h)
  );
  out.set("x-proxy-hit", "1");
  out.set("x-proxy-target", target);

  return new NextResponse(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers: out,
  });
}

export const GET = async (
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> }
) => {
  const { path } = await ctx.params; // ✅ await
  return proxy(req, path);
};

export const POST = GET;
export const PUT = GET;
export const PATCH = GET;
export const DELETE = GET;
export const HEAD = GET;
export const OPTIONS = GET;

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
