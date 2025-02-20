"use client";

import AsideBar from "@/components/aside-bar";
import PageChanger from "@/components/posts/page-changer";
import PostPreview from "@/components/posts/post-preview";
import { CollectionContext } from "@/context/collection-context";
import { Utils } from "@/lib/utils";
import { useContext } from "react";

// page 1
export default function Latest() {
  const collection = useContext(CollectionContext);
  const posts = Utils.sortOutPosts(collection.posts);

  const chuncked = Utils.chunkArray(posts, 5);

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
            {chuncked[0].map((item) => {
              return <PostPreview key={item.path} post={item} />;
            })}
          </ul>

          <PageChanger current={1} last={chuncked.length} />
        </div>
      </div>
    </div>
  );
}
