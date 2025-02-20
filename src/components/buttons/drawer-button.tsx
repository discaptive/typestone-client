import { Navigation, Post } from "@/lib/types";
import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function DrawerButton({
  navigations,
  posts,
}: {
  navigations?: Navigation[];
  posts: Post[];
}) {
  const tagCounts = posts
    .flatMap((post) => post.tags ?? []) // Flatten the tags array
    .reduce((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    const down = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setIsOpen(false);

        return;
      }
    };

    document.addEventListener("keydown", down);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", down);
    };
  }, [isOpen]);

  return (
    <>
      <Button
        onClick={() => {
          setIsOpen(true);
        }}
        className="sm:hidden"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="fill-[#24292F] dark:invert hover:fill-blue-500 dark:hover:invert-0 dark:hover:fill-blue-400 h-6 w-6"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M22.8 4.79998C22.8 5.11824 22.6735 5.42346 22.4485 5.6485C22.2234 5.87355 21.9182 5.99998 21.6 5.99998H2.39995C2.08169 5.99998 1.77647 5.87355 1.55142 5.6485C1.32638 5.42346 1.19995 5.11824 1.19995 4.79998C1.19995 4.48172 1.32638 4.17649 1.55142 3.95145C1.77647 3.7264 2.08169 3.59998 2.39995 3.59998H21.6C21.9182 3.59998 22.2234 3.7264 22.4485 3.95145C22.6735 4.17649 22.8 4.48172 22.8 4.79998ZM22.8 12C22.8 12.3182 22.6735 12.6235 22.4485 12.8485C22.2234 13.0735 21.9182 13.2 21.6 13.2H2.39995C2.08169 13.2 1.77647 13.0735 1.55142 12.8485C1.32638 12.6235 1.19995 12.3182 1.19995 12C1.19995 11.6817 1.32638 11.3765 1.55142 11.1514C1.77647 10.9264 2.08169 10.8 2.39995 10.8H21.6C21.9182 10.8 22.2234 10.9264 22.4485 11.1514C22.6735 11.3765 22.8 11.6817 22.8 12ZM21.6 20.4C21.9182 20.4 22.2234 20.2735 22.4485 20.0485C22.6735 19.8235 22.8 19.5182 22.8 19.2C22.8 18.8817 22.6735 18.5765 22.4485 18.3514C22.2234 18.1264 21.9182 18 21.6 18H2.39995C2.08169 18 1.77647 18.1264 1.55142 18.3514C1.32638 18.5765 1.19995 18.8817 1.19995 19.2C1.19995 19.5182 1.32638 19.8235 1.55142 20.0485C1.77647 20.2735 2.08169 20.4 2.39995 20.4H21.6Z"
          />
        </svg>
      </Button>

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 flex items-center justify-end w-screen pl-36 bg-gray-500/50 backdrop-blur backdrop-filter dark:bg-black/50">
          <DialogPanel className="w-96 h-full space-y-4 p-12 border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 overflow-y-auto">
            <div className="flex justify-end">
              <Button
                onClick={() => {
                  setIsOpen(false);
                }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="fill-[#24292F] dark:invert h-6 w-6"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M19.207 6.207C19.3891 6.0184 19.4899 5.7658 19.4876 5.5036C19.4854 5.2414 19.3802 4.99059 19.1948 4.80518C19.0094 4.61977 18.7586 4.5146 18.4964 4.51233C18.2342 4.51005 17.9816 4.61084 17.793 4.793L12 10.586L6.20696 4.793C6.01836 4.61084 5.76575 4.51005 5.50356 4.51233C5.24136 4.5146 4.99055 4.61977 4.80514 4.80518C4.61973 4.99059 4.51456 5.2414 4.51228 5.5036C4.51001 5.7658 4.6108 6.0184 4.79296 6.207L10.586 12L4.79296 17.793C4.69745 17.8852 4.62127 17.9956 4.56886 18.1176C4.51645 18.2396 4.48886 18.3708 4.48771 18.5036C4.48655 18.6364 4.51186 18.7681 4.56214 18.891C4.61242 19.0138 4.68667 19.1255 4.78056 19.2194C4.87446 19.3133 4.98611 19.3875 5.109 19.4378C5.2319 19.4881 5.36358 19.5134 5.49636 19.5123C5.62914 19.5111 5.76036 19.4835 5.88236 19.4311C6.00437 19.3787 6.11471 19.3025 6.20696 19.207L12 13.414L17.793 19.207C17.9816 19.3892 18.2342 19.49 18.4964 19.4877C18.7586 19.4854 19.0094 19.3802 19.1948 19.1948C19.3802 19.0094 19.4854 18.7586 19.4876 18.4964C19.4899 18.2342 19.3891 17.9816 19.207 17.793L13.414 12L19.207 6.207Z"
                  />
                </svg>
              </Button>
            </div>

            <DialogTitle className="font-bold">Navigations</DialogTitle>

            <div className="flex flex-col gap-1">
              {navigations?.map((navigation) => {
                return (
                  <Link
                    key={navigation.path}
                    href={navigation.path ?? "/"}
                    className="py-2 flex items-center"
                    onClick={() => setIsOpen(false)}
                    prefetch
                  >
                    <div className="text-sm font-medium text-blue-500 hover:text-blue-600 dark:hover:text-blue-400">
                      {navigation.title}
                    </div>
                  </Link>
                );
              })}
            </div>

            <DialogTitle className="font-bold">Tags</DialogTitle>

            <div className="flex flex-col gap-1">
              {Object.keys(tagCounts).map((key) => {
                const count = tagCounts[key];

                return (
                  <Link
                    key={key}
                    href={`/tag/${key}`}
                    className="py-2 flex items-center"
                    onClick={() => setIsOpen(false)}
                    prefetch
                  >
                    <div className="mr-1 text-sm font-medium text-blue-500 hover:text-blue-600 dark:hover:text-blue-400">
                      {key}
                    </div>
                    <div className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                      ({count})
                    </div>
                  </Link>
                );
              })}
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
