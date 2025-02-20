import Footer from "@/components/footer";
import Header from "@/components/header";
import { CollectionProvider } from "@/context/collection-context";
import { Supabase } from "@/services/supabase";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ owner: string }>;
}): Promise<Metadata> {
  // read route params
  const { owner } = await params;

  const collection = await Supabase.getCollection(owner);
  if (!collection) {
    return {};
  }

  const title = `${collection.settings.username ?? owner} | [Typestone]`;

  return {
    title: title,
    description: `Check out the ${
      collection.settings.username ?? owner
    }'s contents`,
    openGraph: {
      title: title,
      description: `Check out the ${
        collection.settings.username ?? owner
      }'s contents`,
      siteName: title,
      images: ["https://typestone.io/og-image.png"],
      type: "website",
    },
    twitter: {
      title: title,
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

  const collection = await Supabase.getCollection(owner);
  if (!collection) {
    notFound();
  }

  return (
    <CollectionProvider collection={collection}>
      <section className="mx-auto max-w-3xl px-4 sm:px-6 xl:max-w-5xl xl:px-0">
        <div className="h-screen">
          <Header />

          <main className="mb-auto">{children}</main>

          <Footer username={collection.settings.username ?? owner} />
        </div>
      </section>
    </CollectionProvider>
  );
}
