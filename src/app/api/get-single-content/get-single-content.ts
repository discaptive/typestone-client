import { PostFrontMatter } from "@/lib/types";
import { getFullImageURL } from "@/lib/utils";
import { getDefaultBranchName, getRepoSingleContent } from "@/services/octokit";
import fm from "front-matter";

export const getSingleContent = async (owner: string, path: string) => {
  const content = await getRepoSingleContent(owner, undefined, path);
  if (!content) {
    return {
      message: "Couldn't get the data from the path you provided.",
      status: 404,
    };
  }

  const branchName = await getDefaultBranchName(owner);
  if (!branchName) {
    return {
      message: "Couldn't get the branch name from the repository.",
      status: 404,
    };
  }

  if (!path.endsWith("content.md")) {
    return {
      message: content,
      status: 200,
    };
  }

  const parsed: PostFrontMatter = fm(content);

  let currentPath = path.split("/content.md")[0];
  if (currentPath.startsWith("/")) currentPath = currentPath.replace("/", "");

  const imageRegex = /!\[(.*?)\]\((.+?)\)/g;

  const updatedBody = parsed.body.replace(
    imageRegex,
    (_: string, alt: string, link: string): string => {
      return `![${alt}](${getFullImageURL(
        owner,
        link,
        currentPath,
        branchName
      )})`;
    }
  );

  const updatedContent = `---
${Object.entries(parsed.attributes)
  .map(([key, value]) => `${key}: "${value}"`)
  .join("\n")}
---

${updatedBody}`;

  return {
    message: updatedContent,
    status: 200,
  };
};
