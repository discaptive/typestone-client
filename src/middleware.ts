import { NextRequest, NextResponse } from "next/server";

const NOT_TO_CHECK_PATHS = ["/"];

export const config = {
  matcher: [
    "/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)", // 제외할 경로 패턴
  ],
};

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get("host") || "";
  const { pathname } = url;

  let subdomainMatch = hostname.match(/^([^\.]+)\.typestone\.io$/);

  if (process.env.NODE_ENV === "development") {
    subdomainMatch = hostname.match(/^([^\.]+)\.localhost:3000$/);
  }

  if (subdomainMatch) {
    const owner = subdomainMatch[1];
    return NextResponse.rewrite(new URL(`/${owner}${pathname}`, req.url));
  }

  if (NOT_TO_CHECK_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  return NextResponse.rewrite(new URL("/404", req.url));
}
