"use server";

import { createClient } from "redis";
import { getInstallationID } from "@/services/octokit";
import {
  cloneUserRepo,
  deleteRepoDirectory,
  generateMetadata,
  hasNoTypestone,
} from "@/services/git";
import { Metadata } from "@/lib/types";

const client = createClient({
  username: process.env.NEXT_PUBLIC_REDIS_USERNAME,
  password: process.env.NEXT_PUBLIC_REDIS_PASSWORD,
  socket: {
    host: process.env.NEXT_PUBLIC_REDIS_SOCKET_HOST,
    port: Number(process.env.NEXT_PUBLIC_REDIS_SOCKET_PORT),
  },
});

client.on("error", (err) => console.log("Redis Client Error", err));
await client.connect();

export async function cacheMetadata(owner: string) {
  const installationId = await getInstallationID(owner);
  if (!installationId) {
    return false;
  }

  const cloneResult = await cloneUserRepo(owner);
  if (!cloneResult) {
    return false;
  }

  const noTypestone = hasNoTypestone(owner);
  if (noTypestone) {
    deleteRepoDirectory(owner);
    return false;
  }

  const metadata = await generateMetadata(owner);
  deleteRepoDirectory(owner);

  await client.set(owner, JSON.stringify(metadata), { NX: true });

  return true;
}

export async function getCachedMetadata(owner: string) {
  const metadata = await client.get(owner);
  if (!metadata) {
    return null;
  }

  return JSON.parse(metadata) as Metadata;
}

export async function invalidateCache(owner: string) {
  await client.del(owner);
}
