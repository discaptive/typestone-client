"use client";

import Link from "next/link";
import ThemeSwitch from "@/components/buttons/theme-switch";
import Logo from "@/components/logo";
import SearchButton from "@/components/buttons/search-button";
import GitHubButton from "@/components/buttons/github-button";
import DrawerButton from "@/components/buttons/drawer-button";

import { useContext } from "react";
import { useParams } from "next/navigation";
import { CollectionContext } from "@/context/collection-context";

export default function Header() {
  const { owner } = useParams<{ owner: string }>();
  const collection = useContext(CollectionContext);

  return (
    <header className="bg-background flex items-center w-full justify-between py-10 sticky top-0 z-10">
      <Link href="/" className="group break-words" prefetch>
        <div className="flex items-center justify-between">
          <div className="sm:block hidden mr-3">
            <Logo />
          </div>
          <div className="text-2xl font-semibold group-hover:underline">
            {collection.settings.username ?? collection.owner}
          </div>
        </div>
      </Link>

      <div className="flex items-center space-x-4 leading-5 sm:space-x-6">
        <div className="no-scrollbar hidden max-w-40 items-center space-x-4 overflow-x-auto sm:flex sm:space-x-6 md:max-w-72 lg:max-w-96">
          {collection.settings.navigations?.map((navigation) => {
            return (
              <Link
                key={navigation.path}
                href={navigation.path ?? "/"}
                className="block font-medium hover:text-blue-500 dark:hover:text-blue-400"
                prefetch
              >
                {navigation.title}
              </Link>
            );
          })}
        </div>

        <SearchButton posts={collection.posts} />

        <ThemeSwitch />

        <GitHubButton href={`https://github.com/${owner}`} />

        <DrawerButton
          navigations={collection.settings.navigations}
          posts={collection.posts}
        />
      </div>
    </header>
  );
}
