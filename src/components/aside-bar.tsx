import { Post } from "@/lib/types";
import Link from "next/link";

export default function AsideBar({
  posts,
  current = "",
}: {
  posts: Post[];
  current?: string;
}) {
  const tagCounts = posts
    .flatMap((post) => post.tags ?? []) // Flatten the tags array
    .reduce((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  return (
    <aside className="hidden md:block md:w-64">
      <div className="sticky top-24 space-y-8">
        <div className="space-y-4">
          <h2 className="text-sm tracking-wider uppercase text-gray-500 dark:text-gray-300">
            Filter by tag
          </h2>

          <nav className="flex flex-col space-y-3">
            {Object.keys(tagCounts).map((key) => {
              const count = tagCounts[key];

              return (
                <Link
                  key={key}
                  className={`font-mono text-sm ${
                    current === key
                      ? "font-extrabold text-blue-600"
                      : "text-gray-600"
                  }  hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400`}
                  href={`/tag/${key}`}
                  prefetch
                >
                  {key}
                  <span className="ml-2 text-gray-400 dark:text-gray-400">
                    ({count})
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </aside>
  );
}
