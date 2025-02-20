"use client";

import ScrollToTop from "@/components/buttons/scroll-to-top";
import { format } from "date-fns";
import Link from "next/link";
import Image from "next/image";
import { notFound, useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import TableOfContents from "@/components/posts/table-of-contents";
import ReactMarkdown from "react-markdown";
import rehypeSlug from "rehype-slug";
import rehypeHighlight from "rehype-highlight";
import { all } from "lowlight";
import Giscus from "@giscus/react";
import { useTheme } from "next-themes";
import remarkGfm from "remark-gfm";
import { CollectionContext } from "@/context/collection-context";
import { Utils } from "@/lib/utils";

import "highlight.js/styles/github-dark-dimmed.css";

export default function Post() {
  const { owner, "post-slug": postSlug } = useParams<{
    owner: string;
    "post-slug": string;
  }>();

  const collection = useContext(CollectionContext);

  const post = collection.posts.find((post) => {
    return Utils.getSlug(post.path) === decodeURIComponent(postSlug);
  });

  if (!post) {
    notFound();
  }

  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    datePublished: post.date,
    dateModified: post.date,
    description: post.summary,
    url: `https://${owner}.typestone.io/${Utils.getSlug(post.path)}`,
    author: [
      {
        "@type": "Person",
        name: collection.settings.username ?? owner,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="mx-auto max-w-3xl px-4 sm:px-6 xl:max-w-5xl xl:px-0">
        <ScrollToTop />
        <article>
          <div className="xl:divide-y xl:divide-gray-200 xl:dark:divide-gray-700">
            <header className="pt-6 xl:pb-6">
              <div className="space-y-1 text-center">
                <dl className="space-y-10">
                  <div>
                    <dt className="sr-only">Published on</dt>
                    <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                      <time dateTime={post.date}>
                        {post.date
                          ? format(new Date(post.date), "LLLL d, yyyy")
                          : "-"}
                      </time>
                    </dd>
                  </div>
                </dl>

                <div>
                  <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-5xl md:leading-[3.5rem]">
                    {post.title}
                  </h1>
                </div>
              </div>
            </header>

            <div className="grid-rows-[auto_1fr] divide-y divide-gray-200 pb-8 dark:divide-gray-700 xl:grid xl:grid-cols-4 xl:gap-x-6 xl:divide-y-0">
              <dl className="pb-10 pt-6 xl:border-b xl:border-gray-200 xl:pt-11 xl:dark:border-gray-700">
                <dt className="sr-only">Author</dt>
                <dd>
                  <ul className="flex flex-wrap justify-center gap-4 sm:space-x-12 xl:block xl:space-x-0 xl:space-y-8">
                    <li className="flex items-center space-x-2">
                      <Image
                        alt="avatar"
                        loading="lazy"
                        width={38}
                        height={38}
                        decoding="async"
                        className="h-10 w-10 rounded-full"
                        src={`https://github.com/${owner}.png`}
                        style={{ color: "transparent" }}
                      />
                      <dl className="whitespace-nowrap text-sm font-medium leading-5">
                        <dt className="sr-only">Name</dt>
                        <dd className="text-gray-900 dark:text-gray-100">
                          {collection.settings.username ?? owner}
                        </dd>
                        <dt className="sr-only">GitHub</dt>
                        <dd>
                          <Link
                            className="text-blue-500 hover:text-blue-600 dark:hover:text-blue-400"
                            target="_blank"
                            rel="noopener noreferrer"
                            href={`https://github.com/${owner}`}
                          >
                            {owner}
                          </Link>
                        </dd>
                      </dl>
                    </li>
                  </ul>
                </dd>
              </dl>

              <div className="divide-y divide-gray-200 dark:divide-gray-700 xl:col-span-3 xl:row-span-2 xl:pb-0">
                <div className="prose max-w-none pb-8 pt-10 dark:prose-invert">
                  <TableOfContents body={post.body} />

                  <ReactMarkdown
                    className="break-words"
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[
                      [
                        rehypeHighlight,
                        {
                          languages: all,
                        },
                      ],
                      rehypeSlug,
                    ]}
                    components={{
                      // eslint-disable-next-line @typescript-eslint/no-unused-vars
                      a: ({ node, ...props }) => (
                        <a {...props} target="_blank" />
                      ),

                      // eslint-disable-next-line @typescript-eslint/no-unused-vars
                      code: ({ node, className, children, ...props }) => {
                        const isBlockCode =
                          className && className.startsWith("language-");

                        if (isBlockCode)
                          return (
                            <code
                              {...props}
                              className={className}
                              style={{
                                padding: 0,
                                margin: 0,
                                backgroundColor: "transparent",
                              }}
                            >
                              {children}
                            </code>
                          );

                        return <code {...props}>{children}</code>;
                      },
                    }}
                  >
                    {post.body}
                  </ReactMarkdown>
                </div>
                <div className="py-6 text-sm text-gray-700 dark:text-gray-300">
                  {collection.settings.giscus &&
                  collection.settings.giscus.repo &&
                  collection.settings.giscus.repoId &&
                  collection.settings.giscus.mapping ? (
                    <Giscus
                      repo={collection.settings.giscus.repo}
                      repoId={collection.settings.giscus.repoId}
                      category={collection.settings.giscus.category}
                      categoryId={collection.settings.giscus.categoryId}
                      mapping={collection.settings.giscus.mapping}
                      reactionsEnabled={
                        collection.settings.giscus.reactionsEnabled
                      }
                      emitMetadata={collection.settings.giscus.emitMetadata}
                      inputPosition={collection.settings.giscus.inputPosition}
                      theme={
                        mounted && resolvedTheme === "dark" ? "dark" : "light"
                      }
                      lang={collection.settings.giscus.lang}
                    />
                  ) : undefined}
                </div>
              </div>

              <footer>
                <div className="divide-gray-200 text-sm font-medium leading-5 dark:divide-gray-700 xl:col-start-1 xl:row-start-2 xl:divide-y">
                  <div className="py-4 xl:py-8">
                    <h2 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Tags
                    </h2>

                    <div className="flex flex-wrap">
                      {post.tags?.map((tag) => {
                        return (
                          <Link
                            className="mr-3 text-sm font-medium text-blue-500 hover:text-blue-600 dark:hover:text-blue-400"
                            href={`tag/${tag}`}
                            key={tag}
                            prefetch
                          >
                            {tag}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="pt-4 xl:pt-8">
                  <Link
                    className="text-blue-500 hover:text-blue-600 dark:hover:text-blue-400"
                    href="/"
                    prefetch
                  >
                    ← Back to the blog
                  </Link>
                </div>
              </footer>
            </div>
          </div>
        </article>
      </section>
    </>
  );
}
