import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Typestone",
  description: "A blog database system built on GitHub Repository.",
  openGraph: {
    title: "Typestone",
    description: "A blog database system built on GitHub Repository.",
    siteName: "Typestone",
    images: ["https://typestone.io/og-image.png"],
    type: "website",
  },
  twitter: {
    title: "Typestone",
    card: "summary_large_image",
    images: ["https://typestone.io/og-image.png"],
  },
};

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <section className="mx-auto max-w-3xl px-4 sm:px-6 xl:max-w-5xl xl:px-0">
      <div className="h-screen">{children}</div>
    </section>
  );
}
