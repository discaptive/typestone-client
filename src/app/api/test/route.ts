import simpleGit from "simple-git";

export async function GET() {
  const path = "/tmp/discaptive";
  const git = simpleGit(path);

  await git.clone(`https://github.com/discaptive/typestone-data.git`, ".", [
    "--no-checkout",
    "--depth=1",
    "--single-branch",
  ]);

  await git.raw(["sparse-checkout", "init", "--no-cone"]);

  await git.raw([
    "sparse-checkout",
    "set",
    "settings.json",
    ".typestone",
    "posts/*/content.md",
  ]);

  await git.checkout();

  return new Response(null, { status: 200 });
}
