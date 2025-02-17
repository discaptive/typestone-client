"use server";

import { ApiKey, Metadata } from "@/lib/types";
import { single } from "@/lib/utils";
import { createClient } from "@supabase/supabase-js";
import { getInstallationID } from "./octokit";
import {
  cloneUserRepo,
  deleteRepoDirectory,
  generateMetadata,
  hasNoTypestone,
} from "./git";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function createApiKey(owner: string) {
  const { data, error } = await supabase
    .from("api-key")
    .insert({ owner })
    .select();

  if (error) return undefined;

  return single(data as [ApiKey]).key;
}

export async function getApiKeys() {
  const { data, error } = await supabase.from("api-key").select("*");

  if (error) return undefined;

  return data as ApiKey[];
}

export async function getApiKey(owner: string) {
  const { data, error } = await supabase
    .from("api-key")
    .select("*")
    .eq("owner", owner)
    .single();

  if (error) return undefined;

  return (data as ApiKey).key;
}

export async function existsApiKey(apiKey: string) {
  const { error } = await supabase
    .from("api-key")
    .select("*")
    .eq("key", apiKey)
    .single();

  if (error) return false;

  return true;
}

export async function deleteKey(owner: string) {
  const { error } = await supabase.from("api-key").delete().eq("owner", owner);

  if (error) return false;

  return true;
}

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

  const { error } = await supabase.from("metadata").insert({ owner, metadata });

  if (error) return false;

  return true;
}

export async function getCachedMetadata(owner: string) {
  const { data, error } = await supabase
    .from("metadata")
    .select("metadata")
    .eq("owner", owner)
    .single();

  if (error) return null;

  return data.metadata as Metadata;
}

export async function invalidateCache(owner: string) {
  await supabase.from("metadata").delete().eq("owner", owner);
}
