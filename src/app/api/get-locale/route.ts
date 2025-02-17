import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const locale =
    req.cookies.get("locale")?.value ||
    req.headers.get("accept-language")?.split(",")[0]?.split("-")[0] ||
    "en";

  return NextResponse.json({ locale });
}
