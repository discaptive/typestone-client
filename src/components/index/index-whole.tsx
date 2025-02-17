"use client";

import Footer from "@/components/footer";
import Link from "next/link";
import Logo from "@/components/logo";
import LocaleButton from "@/components/index/locale-button";
import GitHubButton from "@/components/buttons/github-button";
import { useEffect, useState } from "react";
import IndexBody from "./index-body";

const localeKeys = {
  en: "en",
  ko: "ko",
};

type Locales = (typeof localeKeys)[keyof typeof localeKeys];

export default function IndexWhole({
  readme,
  readmeKo,
}: {
  readme: string;
  readmeKo: string;
}) {
  const [locale, setLocale] = useState<Locales>(localeKeys.en);

  useEffect(() => {
    fetch("/api/get-locale")
      .then((res) => res.json())
      .then((data) => setLocale(data.locale));
  }, []);

  const getReadme = (locale: string) => {
    switch (locale) {
      case localeKeys.en:
        return readme;
      case localeKeys.ko:
        return readmeKo;
      default:
        return readme;
    }
  };

  const rs = getReadme(locale);

  return (
    <>
      <div>
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
            <LocaleButton locale={locale} setLocale={setLocale} />

            <GitHubButton
              href={`https://github.com/discaptive/typestone-client`}
            />
          </div>
        </header>
      </div>

      <main className="mb-auto">
        <div className="prose max-w-none pb-8 pt-10">
          <IndexBody readme={rs} />
        </div>
      </main>

      <Footer username="Typestone" />
    </>
  );
}
