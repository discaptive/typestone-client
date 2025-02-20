import { Post } from "@/lib/types";
import { Utils } from "@/lib/utils";
import { format } from "date-fns";
import Link from "next/link";

export default function PostPreview({ post }: { post: Post }) {
  return (
    <li className="py-12 first:pt-0">
      <article>
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex flex-col gap-4 text-sm text-gray-500 dark:text-gray-300">
              <time dateTime={post.date}>
                {post.date ? format(new Date(post.date), "LLLL d, yyyy") : "-"}
              </time>

              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                <Link
                  className="break-words"
                  href={`/${Utils.getSlug(post.path)}`}
                  prefetch
                >
                  {post.title}
                </Link>
              </h2>

              <div className="flex flex-wrap gap-2">
                {post.tags?.map((tag) => {
                  return (
                    <Link
                      key={tag}
                      className="mr-3 text-sm font-medium text-blue-500 hover:text-blue-600 dark:hover:text-blue-400"
                      href={`/tag/${tag}`}
                      prefetch
                    >
                      {tag}
                    </Link>
                  );
                })}
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-300">{post.summary}</p>
          </div>

          <Link
            className="group inline-flex items-center text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
            href={`/${Utils.getSlug(post.path)}`}
            prefetch
          >
            Read article
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5"
            >
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </Link>
        </div>
      </article>
    </li>
  );
}
