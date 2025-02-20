import { Command } from "cmdk";
import { useEffect, useState } from "react";
import "./vercel.css";
import { Button } from "@headlessui/react";
import { Dialog } from "radix-ui";
import { Post } from "@/lib/types";
import Link from "next/link";
import { format } from "date-fns";
import { Utils } from "@/lib/utils";

export default function SearchButton({ posts }: { posts: Post[] }) {
  const [open, setOpen] = useState(false);

  // Toggle the menu when ⌘K is pressed
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);

        return;
      }

      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);

        return;
      }
    };

    document.addEventListener("keydown", down);
    return () => {
      document.body.style.overflow = "";

      document.removeEventListener("keydown", down);
    };
  }, [open]);

  return (
    <>
      <Button
        onClick={() => {
          setOpen(true);
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="hover:text-blue-500 dark:hover:text-blue-400 h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
      </Button>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="z-50 fixed inset-0 flex items-center justify-center w-screen bg-gray-500/50 p-4 backdrop-blur backdrop-filter dark:bg-black/50">
            <div className="mx-5 w-full max-w-xl">
              <Dialog.Content className="p-2 mx-auto rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
                <Dialog.Title />
                <Dialog.Description />

                <Command className="vercel">
                  <Command.Input placeholder="Type a command or search..." />
                  <Command.List>
                    <Command.Empty>No results found.</Command.Empty>

                    <Command.Group heading="Contents">
                      {posts.map((post) => {
                        return (
                          <Link
                            key={post.path}
                            href={`/${Utils.getSlug(post.path)}`}
                            onClick={() => {
                              setOpen(false);
                            }}
                            prefetch
                          >
                            <Command.Item>
                              <div className="flex cursor-pointer justify-between py-2 text-gray-700 dark:text-gray-100 bg-transparent">
                                <div className="flex space-x-2">
                                  <div className="block">
                                    <div className="text-gray-400 text-xs">
                                      {post.date
                                        ? format(
                                            new Date(post.date),
                                            "LLLL d, yyyy"
                                          )
                                        : "-"}
                                    </div>
                                    <div>{post.title}</div>
                                  </div>
                                </div>
                              </div>
                            </Command.Item>
                          </Link>
                        );
                      })}
                    </Command.Group>
                  </Command.List>
                </Command>

                <Dialog.Close />
              </Dialog.Content>
            </div>
          </Dialog.Overlay>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
