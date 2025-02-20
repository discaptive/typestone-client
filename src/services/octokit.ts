import { App } from "octokit";

export class Octokit {
  private static app = new App({
    appId: process.env.NEXT_PUBLIC_OCTOKIT_APP_ID!,
    webhooks: {
      secret: process.env.NEXT_PUBLIC_OCTOKIT_WEBHOOK_SECRET!,
    },
    privateKey: process.env.NEXT_PUBLIC_OCTOKIT_PRIVATE_KEY!,
  });

  static async verifyWebhook(payload: string, signature: string) {
    return await this.app.webhooks.verify(payload, signature);
  }
}
