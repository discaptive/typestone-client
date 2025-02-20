"use client";

import AsideBar from "@/components/aside-bar";
import PostPreview from "@/components/posts/post-preview";
import { CollectionContext } from "@/context/collection-context";
import { Utils } from "@/lib/utils";
import { notFound, useParams } from "next/navigation";
import { useContext } from "react";

export default function Tag() {
  const { tag } = useParams<{ tag: string }>();

  const collection = useContext(CollectionContext);
  const posts = Utils.sortOutPosts(collection.posts);

  const filteredPosts = posts.filter((post) =>
    post.tags?.includes(decodeURIComponent(tag))
  );

  if (filteredPosts.length < 1) {
    notFound();
  }

  return (
    <div className="space-y-8 pb-12 pt-16">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 sm:text-4xl">
          {decodeURIComponent(tag)}
        </h1>
      </div>

      <div className="flex flex-col gap-8 md:flex-row">
        <AsideBar posts={posts} current={decodeURIComponent(tag)} />

        <div className="min-w-0 flex-1">
          <ul className="divide-y divide-gray-200 dark:divide-gray-800">
            {filteredPosts.map((item) => {
              return <PostPreview key={item.path} post={item} />;
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
