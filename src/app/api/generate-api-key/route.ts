import { generateApiKey } from "./generate-api-key";

export async function POST(req: Request) {
  const payload = await req.json();

  if (!payload["owner"]) {
    return new Response('The "owner" field is required in the Body', {
      status: 400,
    });
  }

  const owner = payload["owner"];

  const result = await generateApiKey(owner);

  return new Response(result.message, { status: result.status });
}
