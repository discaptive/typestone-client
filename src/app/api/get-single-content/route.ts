import { existsApiKey, getApiKey } from "@/services/supabase";
import { getSingleContent } from "./get-single-content";

export async function GET(req: Request) {
  const xApiKey = req.headers.get("x-api-key");

  if (!xApiKey) {
    return new Response("x-api-key is requred on your header.", {
      status: 400,
    });
  }

  const url = new URL(req.url);

  const owner = url.searchParams.get("owner");
  const path = url.searchParams.get("path");

  if (!owner || !path) {
    return new Response("Query Parameter (owner, path) is requred.", {
      status: 400,
    });
  }

  const apiKeyExists = await existsApiKey(xApiKey);
  const realApiKey = await getApiKey(owner);
  if (!apiKeyExists || !realApiKey || xApiKey !== realApiKey) {
    return new Response("Your api key is not authorized.", { status: 401 });
  }

  const result = await getSingleContent(owner, path);

  return new Response(result.message, { status: result.status });
}
