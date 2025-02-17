import simpleGit from "simple-git";
import fs from "fs";
import path from "path";
import fm from "front-matter";

import { Metadata, PostFrontMatter } from "@/lib/types";
import { getDefaultBranchName } from "./octokit";

export const cloneUserRepo = async (
  owner: string,
  repo: string = "typestone"
) => {
  try {
    const localPath = `./tmp/${owner}`;

    deleteRepoDirectory(owner);
    makeRepoDirectory(owner);

    const git = simpleGit(localPath);

    await git.clone(`https://github.com/${owner}/${repo}.git`, ".", [
      "--no-checkout",
      "--depth=1",
      "--single-branch",
    ]);

    await git.raw(["sparse-checkout", "init", "--no-cone"]);

    await git.raw([
      "sparse-checkout",
      "set",
      "settings.json",
      ".no-typestone",
      "posts/*/content.md",
    ]);

    await git.checkout();

    return true;
  } catch {
    return false;
  }
};

export const deleteRepoDirectory = (owner: string) => {
  const path = `./tmp/${owner}`;
  fs.rmSync(path, { recursive: true, force: true });
};

const makeRepoDirectory = (owner: string) => {
  const path = `./tmp/${owner}`;
  fs.mkdirSync(path, { recursive: true });
};

export const generateMetadata = async (owner: string): Promise<Metadata> => {
  const tmpPath = `./tmp/${owner}`;

  const metadata = {
    username: owner,
    navigations: [],
    giscus: undefined,
    branch: "main",
    posts: [],
  } as Metadata;

  try {
    const settingsFile = fs.readFileSync(
      path.join(tmpPath, "settings.json"),
      "utf-8"
    );

    const settings = JSON.parse(settingsFile);

    if (settings.username) {
      metadata.username = settings.username;
    }

    if (settings.navigations.length !== 0) {
      metadata.navigations = settings.navigations;
    }

    if (settings.giscus) {
      metadata.giscus = settings.giscus;
    }
  } catch {
    // console.log("settings.json is not detected");
  }

  const dirs = fs.readdirSync(tmpPath);
  dirs.forEach((file) => {
    const filePath = path.join(tmpPath, file);
    const stat = fs.statSync(filePath);

    if (!stat.isDirectory() || file === ".git") {
      return;
    }

    if (file === "posts") {
      const subDirFiles = fs.readdirSync(filePath);
      subDirFiles.forEach((subFile) => {
        const subFilePath = path.join(filePath, subFile);

        const mdFiles = fs.readdirSync(subFilePath);
        mdFiles.forEach((mdFile) => {
          const mdFilePath = path.join(subFilePath, mdFile);

          if (mdFile !== "content.md") {
            return;
          }

          const mdContent = fs.readFileSync(mdFilePath, "utf8");
          const contentData: PostFrontMatter = fm(mdContent);

          metadata.posts.push({
            title: contentData.attributes.title ?? subFile,
            summary: contentData.attributes.summary ?? "-",
            date: contentData.attributes.date,
            tags: contentData.attributes.tags,
            path: path.relative(tmpPath, mdFilePath),
            body: contentData.body,
          });
        });
      });
    }
  });

  const branchName = await getDefaultBranchName(owner);
  if (branchName) {
    metadata.branch = branchName;
  }

  return metadata;
};

export const hasNoTypestone = (owner: string): boolean => {
  const tmpPath = `./tmp/${owner}`;

  try {
    fs.readFileSync(path.join(tmpPath, ".no-typestone"), "utf-8");

    return true;
  } catch {
    return false;
  }
};
