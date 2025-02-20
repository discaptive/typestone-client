import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const hostname = req.headers.get("host")!;
  const pathname = req.nextUrl.pathname;

  let subdomainMatch = undefined;

  if (process.env.NODE_ENV === "development") {
    subdomainMatch = hostname.match(/^([^\.]+)\.localhost:3000$/);
  }

  if (process.env.NODE_ENV === "production") {
    subdomainMatch = hostname.match(/^([^\.]+)\.typestone\.io$/);
  }

  if (subdomainMatch) {
    const owner = subdomainMatch[1];
    return NextResponse.rewrite(new URL(`/${owner}${pathname}`, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)"],
};
