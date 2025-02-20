import { Post, TOCItem } from "@/lib/types";
import { Supabase } from "@/services/supabase";
import path from "path";
import { unified } from "unified";
import { Root } from "hast";
import rehypeSlug from "rehype-slug";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";

import { visit } from "unist-util-visit";
import { toString } from "hast-util-to-string";

export class Utils {
  static getSlug(path: string) {
    // Input should like this "posts/post-slug/content.md"
    // Output should like this "post-slug"
    const tmp = path;
    return tmp.split("/")[1];
  }

  static getImageURL(
    owner: string,
    repo: string,
    imagePath: string,
    joinDir: `/${string}`,
    branch: string
  ) {
    // imagePath: Image Path (./image-name.png || etc)
    // joinDir: Working Directory (posts/post-slug)

    if (imagePath.startsWith("https://") || imagePath.startsWith("http://")) {
      return imagePath;
    }

    if (path.isAbsolute(imagePath)) {
      return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}${imagePath}`;
    }

    const fullPath = path.join(joinDir, imagePath);

    return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}${fullPath}`;
  }

  static async getSitemapList(owner: string) {
    const collection = await Supabase.getCollection(owner);
    if (!collection) {
      return [];
    }

    const baseUrl = `https://${owner}.typestone.io`;

    const posts = collection.posts;
    const sitemapPostList = posts.map(({ date, path }) => ({
      lastModified: date ? new Date(date) : new Date(),
      url: `${baseUrl}/${this.getSlug(path)}`,
    }));

    return sitemapPostList;
  }

  static extractTOC(markdown: string): TOCItem[] {
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

  static getNavigationPath(inputPath: string) {
    if (inputPath.startsWith("https://") || inputPath.startsWith("http://")) {
      return inputPath;
    }

    const slug = this.getSlug(path.join(".", inputPath));
    return `/${slug}`;
  }

  static parseDate(post: Post) {
    if (post.date) {
      return new Date(post.date).getTime();
    }
    return 0;
  }

  static sortOutPosts(posts: Post[]) {
    posts.sort((a, b) => this.parseDate(b) - this.parseDate(a));
    return posts;
  }

  static chunkArray<T>(array: T[], size: number): T[][] {
    return Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
      array.slice(i * size, i * size + size)
    );
  }
}

// export function getSlugFromPath(path: string) {
//   // Input should like this "posts/post-slug/content.md"
//   // Output should like this "post-slug"
//   const tmp = path;
//   return tmp.split("/")[1];
// }

// export function single<T>(arr: [T]): T {
//   return arr[0];
// }
