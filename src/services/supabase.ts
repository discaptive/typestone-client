"use server";

import { Collection, Post, Settings } from "@/lib/types";
import { createClient } from "@supabase/supabase-js";

export class Supabase {
  private static supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  static async upsertCollection(
    owner: string,
    settings?: Settings,
    posts?: Post[]
  ): Promise<boolean> {
    owner = owner.toLowerCase();
    const { error } = await this.supabase
      .from("collections")
      .upsert({ owner, settings, posts }, { onConflict: "owner" });

    if (error) return false;

    return true;
  }

  static async getCollection(owner: string): Promise<Collection | undefined> {
    owner = owner.toLowerCase();
    const { data, error } = await this.supabase
      .from("collections")
      .select("owner, settings, posts")
      .eq("owner", owner)
      .single();

    if (error) return undefined;

    const result: Collection = data;
    return result;
  }

  static async deleteCollection(owner: string) {
    owner = owner.toLowerCase();
    await this.supabase.from("collections").delete().eq("owner", owner);
  }
}
