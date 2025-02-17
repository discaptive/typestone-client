import { app } from "@/services/octokit";
import { invalidateCache } from "@/services/supabase";
import { deleteKey } from "@/services/supabase";

export async function POST(req: Request) {
  const signature = req.headers.get("x-hub-signature-256") ?? "N";
  const reqPlainText = await req.text();

  const verifyingPayload = reqPlainText.length !== 0 ? reqPlainText : "N";

  const verification = await app.webhooks.verify(verifyingPayload, signature);

  if (!verification) {
    return new Response("Signature cannot be verified", { status: 401 });
  }

  const payload = JSON.parse(verifyingPayload);

  if (req.headers.get("x-github-event") === "push") {
    if (payload["repository"]["name"] !== "typestone") {
      return new Response("Repository is not discoverable", {
        status: 200,
      });
    }

    const owner = payload["repository"]["owner"]["login"];

    const ref: string = payload["ref"];
    if (!ref.startsWith("refs/heads/")) {
      return new Response("Action is not acceptable", { status: 200 });
    }

    invalidateCache(owner);

    return new Response(null, { status: 200 });
  }

  if (req.headers.get("x-github-event") === "installation") {
    const action = payload["action"];
    const owner = payload["installation"]["account"]["login"];

    if (action === "deleted") {
      // typestone-app deleted
      const result = await deleteKey(owner);
      if (!result) {
        return new Response("Error occurred while deleting api key", {
          status: 500,
        });
      }

      return new Response(null, { status: 200 });
    }
  }

  return new Response("There's nothing to do", { status: 200 });
}
