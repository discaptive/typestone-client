import { Utils } from "@/lib/utils";
import { Supabase } from "@/services/supabase";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ owner: string; "post-slug": string }>;
}): Promise<Metadata> {
  // read route params
  const { owner, "post-slug": postSlug } = await params;

  const collection = await Supabase.getCollection(owner);
  if (!collection) {
    return {};
  }

  const post = collection.posts.find((post) => {
    return Utils.getSlug(post.path) === decodeURIComponent(postSlug);
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
      siteName: `${collection.settings.username ?? owner} | [Typestone]`,
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
