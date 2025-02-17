"use client";

import AsideBar from "@/components/aside-bar";
import PageChanger from "@/components/posts/page-changer";
import PostPreview from "@/components/posts/post-preview";
import { MetadataContext } from "@/context/metadata-context";
import { chunkArray, sortOutPosts } from "@/lib/utils";
import { notFound, useParams } from "next/navigation";
import { useContext } from "react";

// page 1~
export default function Pagination() {
  const { page } = useParams<{ page: string }>();

  const metadata = useContext(MetadataContext);
  const posts = sortOutPosts(metadata.posts);

  const chuncked = chunkArray(posts, 5);

  if (!Number(page) || Number(page) > chuncked.length) {
    notFound();
  }

  return (
    <div className="space-y-8 pb-12 pt-16">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 sm:text-4xl">
          All Posts
        </h1>
      </div>

      <div className="flex flex-col gap-8 md:flex-row">
        <AsideBar posts={posts} />

        <div className="min-w-0 flex-1">
          <ul className="divide-y divide-gray-200 dark:divide-gray-800">
            {chuncked[Number(page) - 1].map((item) => {
              return <PostPreview key={item.path} post={item} />;
            })}
          </ul>

          <PageChanger current={Number(page)} last={chuncked.length} />
        </div>
      </div>
    </div>
  );
}
