import Footer from "@/components/footer";
import Header from "@/components/header";
import { MetadataProvider } from "@/context/metadata-context";
import { cacheMetadata, getCachedMetadata } from "@/services/supabase";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ owner: string }>;
}): Promise<Metadata> {
  // read route params
  const { owner } = await params;

  let metadata = await getCachedMetadata(owner);

  if (!metadata) {
    await cacheMetadata(owner);
    metadata = await getCachedMetadata(owner);

    if (!metadata) {
      return {};
    }
  }

  return {
    title: `${metadata.username} [${owner}]  - Typestone`,
    description: `Check out the ${metadata.username}'s contents`,
    openGraph: {
      title: `${metadata.username} [${owner}]  - Typestone`,
      description: `Check out the ${metadata.username}'s contents`,
      siteName: `${metadata.username} [${owner}]  - Typestone`,
      images: ["https://typestone.io/og-image.png"],
      type: "website",
    },
    twitter: {
      title: `${metadata.username} [${owner}]  - Typestone`,
      card: "summary_large_image",
      images: ["https://typestone.io/og-image.png"],
    },
  };
}

export default async function Layout({
  children,
  params,
}: {
  children: Readonly<React.ReactNode>;
  params: Promise<{ owner: string }>;
}) {
  const { owner } = await params;

  let metadata = await getCachedMetadata(owner);

  if (!metadata) {
    await cacheMetadata(owner);
    metadata = await getCachedMetadata(owner);

    if (!metadata) {
      notFound();
    }
  }

  return (
    <MetadataProvider metadata={metadata}>
      <section className="mx-auto max-w-3xl px-4 sm:px-6 xl:max-w-5xl xl:px-0">
        <div className="h-screen">
          <Header />

          <main className="mb-auto">{children}</main>

          <Footer username={metadata.username} />
        </div>
      </section>
    </MetadataProvider>
  );
}
