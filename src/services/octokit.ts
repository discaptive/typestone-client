"use server";

import { App } from "octokit";

export class Octokit {
  private static app = new App({
    appId: process.env.OCTOKIT_APP_ID!,
    webhooks: {
      secret: process.env.OCTOKIT_WEBHOOK_SECRET!,
    },
    privateKey: process.env.OCTOKIT_PRIVATE_KEY!,
  });

  static async verifyWebhook(payload: string, signature: string) {
    return await this.app.webhooks.verify(payload, signature);
  }
}
