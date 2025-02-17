import GitHubButton from "@/components/buttons/github-button";
import Footer from "@/components/footer";
import Logo from "@/components/logo";
import { Metadata } from "next";
import Link from "next/link";

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
      <div className="h-screen">
        <header className="bg-background flex items-center w-full justify-between py-10 sticky top-0 z-10">
          <Link href="/" className="break-words" prefetch>
            <div className="flex items-center justify-between">
              <div className="sm:block hidden mr-3">
                <Logo />
              </div>
              <div className="text-2xl font-semibold">Typestone</div>
            </div>
          </Link>

          <div className="flex items-center space-x-4 leading-5 sm:space-x-6">
            <GitHubButton
              href={`https://github.com/discaptive/typestone-client`}
            />
          </div>
        </header>

        <main className="mb-auto">{children}</main>

        <Footer username="Typestone" />
      </div>
    </section>
  );
}
