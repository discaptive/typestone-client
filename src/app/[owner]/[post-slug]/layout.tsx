import { Metadata } from "next";
import { cacheMetadata, getCachedMetadata } from "@/services/supabase";
import { extractHrefFromPath } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ owner: string; "post-slug": string }>;
}): Promise<Metadata> {
  // read route params
  const { owner, "post-slug": postSlug } = await params;

  let metadata = await getCachedMetadata(owner);

  if (!metadata) {
    await cacheMetadata(owner);
    metadata = await getCachedMetadata(owner);

    if (!metadata) {
      return {};
    }
  }

  const post = metadata.posts.find((post) => {
    return (
      extractHrefFromPath(post.path) ===
      String(`/${decodeURIComponent(postSlug)}`)
    );
  });

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      siteName: `${metadata.username} [${owner}]  - Typestone`,
      images: ["https://typestone.io/og-image.png"],
      type: "website",
    },
    twitter: {
      title: post.title,
      card: "summary_large_image",
      images: ["https://typestone.io/og-image.png"],
    },
  };
}

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
