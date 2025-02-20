import { Git } from "@/services/git";
import { Octokit } from "@/services/octokit";
import { Supabase } from "@/services/supabase";

export async function POST(req: Request) {
  const signature = req.headers.get("x-hub-signature-256") ?? "N";
  const reqPlainText = await req.text();

  const eventPayload = reqPlainText.length !== 0 ? reqPlainText : "N";

  const verification = await Octokit.verifyWebhook(eventPayload, signature);
  if (!verification) {
    return new Response("Signature cannot be verified", { status: 401 });
  }

  const payload = JSON.parse(eventPayload);

  if (req.headers.get("x-github-event") === "push") {
    const defaultBranch = payload["repository"]["default_branch"];
    if (payload["ref"] !== `refs/heads/${defaultBranch}`) {
      console.log("Default branch mismathces");
      return new Response("Default branch mismathces", { status: 401 });
    }

    const owner = payload["repository"]["owner"]["login"];
    const repository = payload["repository"]["name"];

    const cloneResult = await Git.clone(owner, repository);
    if (!cloneResult) {
      console.log("Clone failed");
      Git.deleteRepoDirectory(owner);
      return new Response("Clone failed", { status: 401 });
    }

    const hasTypestone = Git.hasTypestone(owner);
    if (!hasTypestone) {
      console.log(".typestone file not found");
      Git.deleteRepoDirectory(owner);
      return new Response(".typestone file not found", { status: 401 });
    }

    const ref: string = payload["ref"];
    if (!ref.startsWith("refs/heads/")) {
      console.log("Action is not acceptable");
      Git.deleteRepoDirectory(owner);
      return new Response("Action is not acceptable", { status: 401 });
    }

    const collection = Git.createCollection(owner, repository, defaultBranch);

    const upsertResult = await Supabase.upsertCollection(
      owner,
      collection.settings,
      collection.posts
    );
    if (!upsertResult) {
      console.log("Collection update failed");
      Git.deleteRepoDirectory(owner);
      return new Response("Collection update failed", { status: 401 });
    }

    Git.deleteRepoDirectory(owner);
    return new Response(null, { status: 200 });
  }

  if (
    req.headers.get("x-github-event") === "installation" &&
    payload["action"] === "deleted"
  ) {
    const owner = payload["installation"]["account"]["login"];

    await Supabase.deleteCollection(owner);

    return new Response(null, { status: 200 });
  }

  return new Response("There's nothing to do", { status: 200 });
}
