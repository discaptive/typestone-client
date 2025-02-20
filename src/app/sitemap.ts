import { Utils } from "@/lib/utils";
import type { MetadataRoute } from "next";
import { headers } from "next/headers";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const header = await headers();

  const hostname = header.get("host")!;

  let subdomainMatch = undefined;

  if (process.env.NODE_ENV === "development") {
    subdomainMatch = hostname.match(/^([^\.]+)\.localhost:3000$/);
  }

  if (process.env.NODE_ENV === "production") {
    subdomainMatch = hostname.match(/^([^\.]+)\.typestone\.io$/);
  }

  let owner = "";

  if (subdomainMatch) {
    owner = subdomainMatch[1];
  }

  const sitemap = await Utils.getSitemapList(owner);

  return [
    {
      url: "https://typestone.io",
      lastModified: new Date(),
    },
    ...sitemap,
  ];
}
