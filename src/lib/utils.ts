import { Post, TOCItem } from "@/lib/types";
import path from "path";
import { Root } from "hast";
import rehypeSlug from "rehype-slug";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { visit } from "unist-util-visit";
import { toString } from "hast-util-to-string";
import { cacheMetadata, getCachedMetadata } from "@/services/supabase";

export function parseDate(post: Post) {
  if (post.date) {
    return new Date(post.date).getTime();
  }
  return 0;
}

export function sortOutPosts(posts: Post[]) {
  posts.sort((a, b) => parseDate(b) - parseDate(a));
  return posts;
}

export function extractHrefFromPath(path: string) {
  const tmp = path;
  return tmp.replace("posts", "").replace("/content.md", "");
}

export function chunkArray<T>(array: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
    array.slice(i * size, i * size + size)
  );
}

export function single<T>(arr: [T]): T {
  return arr[0];
}

export function getFullImageURL(
  owner: string,
  inputPath: string,
  currentDir: string,
  branch: string
) {
  // inputPath: Image Path (./image-name.png || etc)
  // currentDir: Woring Directory (posts/post-slug)
  // owner: owner

  if (inputPath.startsWith("https://") || inputPath.startsWith("http://")) {
    return inputPath;
  }

  if (path.isAbsolute(inputPath)) {
    return `https://raw.githubusercontent.com/${owner}/typestone/${branch}${inputPath}`;
  }

  const fullPath = path.join(currentDir, inputPath);

  return `https://raw.githubusercontent.com/${owner}/typestone/${branch}/${fullPath}`;
}

export function getNavigationHref(inputPath: string) {
  if (inputPath.startsWith("https://") || inputPath.startsWith("http://")) {
    return inputPath;
  }

  return extractHrefFromPath(path.join(".", inputPath));
}

export function extractTOC(markdown: string): TOCItem[] {
  const toc: TOCItem[] = [];

  const processor = unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeSlug);

  const tree = processor.runSync(processor.parse(markdown)) as Root;

  visit(tree, "element", (node) => {
    if (node.tagName === "h2" || node.tagName === "h3") {
      const level = parseInt(node.tagName.charAt(1)) as 2 | 3;
      const title = toString(node);

      toc.push({ level, title, href: `#${node.properties?.id as string}` });
    }
  });

  return toc;
}

export async function getSitemapList(owner: string) {
  let metadata = await getCachedMetadata(owner);

  if (!metadata) {
    await cacheMetadata(owner);
    metadata = await getCachedMetadata(owner);
  }

  if (!metadata) {
    return [];
  }

  const baseUrl = `https://${owner}.typestone.io`;

  const posts = metadata.posts;
  const sitemapPostList = posts.map(({ date, path }) => ({
    lastModified: date ? new Date(date) : new Date(),
    url: `${baseUrl}${extractHrefFromPath(path)}`,
  }));

  return sitemapPostList;
}
