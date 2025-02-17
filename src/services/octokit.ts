import { App } from "octokit";

export const app = new App({
  appId: process.env.NEXT_PUBLIC_OCTOKIT_APP_ID!,
  webhooks: {
    secret: process.env.NEXT_PUBLIC_OCTOKIT_WEBHOOK_SECRET!,
  },
  privateKey: process.env.NEXT_PUBLIC_OCTOKIT_PRIVATE_KEY!,
});

export const getInstallationID = async (
  owner: string,
  repo: string = "typestone"
) => {
  try {
    const { data } = await app.octokit.request(
      "GET /repos/{owner}/{repo}/installation",
      {
        owner: owner,
        repo: repo,
      }
    );

    return data.id;
  } catch {
    return undefined;
  }
};

const getInstallationClient = async (
  owner: string,
  repo: string = "typestone"
) => {
  const installationId = await getInstallationID(owner, repo);

  if (!installationId) {
    return undefined;
  }

  const octokit = await app.getInstallationOctokit(installationId);

  return octokit;
};

export const getRepoSingleContent = async (
  owner: string,
  repo: string = "typestone",
  path: string
) => {
  const client = await getInstallationClient(owner, repo);

  if (!client) {
    return undefined;
  }

  try {
    const result = await client.rest.repos.getContent({
      owner,
      repo,
      path,
    });

    const data = Object.create(result.data);

    if (data["type"] !== "file") {
      return undefined;
    }

    return Buffer.from(data["content"], "base64").toString("utf-8");
  } catch {
    return undefined;
  }
};

export const getDefaultBranchName = async (
  owner: string,
  repo: string = "typestone"
) => {
  const client = await getInstallationClient(owner, repo);

  if (!client) {
    return undefined;
  }

  const { data } = await client.rest.repos.get({
    owner,
    repo,
  });

  return data.default_branch;
};
