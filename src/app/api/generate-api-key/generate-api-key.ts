import { getInstallationID } from "@/services/octokit";
import { createApiKey, getApiKeys } from "@/services/supabase";

export const generateApiKey = async (owner: string) => {
  const installationId = await getInstallationID(owner);

  if (!installationId) {
    return {
      message: "Please install the typestone-app to your repository first.",
      status: 400,
    };
  }

  const apiKeys = await getApiKeys();
  if (!apiKeys) {
    return { message: null, status: 500 };
  }

  const apiExists = apiKeys.find((apiKey) => {
    return owner === apiKey.owner;
  });

  if (apiExists) {
    return {
      message:
        "Already issued. It can only be issued once. If you want to issue the api key again, please check our official website. Follow here: https://typestone.io",
      status: 400,
    };
  }

  const apiKey = await createApiKey(owner);
  if (!apiKey) {
    return { message: null, status: 500 };
  }

  return { message: apiKey, status: 200 };
};
