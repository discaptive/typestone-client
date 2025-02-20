import simpleGit from "simple-git";
import fs from "fs";
import path from "path";
import fm from "front-matter";
import { execSync } from "child_process";

import { Collection, PostFrontMatter, SettingsSchema } from "@/lib/types";
import { Utils } from "@/lib/utils";

export class Git {
  private static readFileSync(location: string, file: string) {
    try {
      return fs.readFileSync(path.join(location, file), "utf-8");
    } catch {
      return undefined;
    }
  }

  static deleteRepoDirectory(owner: string) {
    const path = `/tmp/${owner}`;
    fs.rmSync(path, { recursive: true, force: true });
  }

  private static makeRepoDirectory(owner: string) {
    const path = `/tmp/${owner}`;
    fs.mkdirSync(path, { recursive: true });
  }

  static async clone(owner: string, repo: string) {
    const path = `/tmp/${owner}`;

    this.deleteRepoDirectory(owner);
    this.makeRepoDirectory(owner);

    try {
      const gitVersion = execSync("git --version").toString();
      console.log("Git is available:", gitVersion);

      const git = simpleGit(path);

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
        ".typestone",
        "posts/*/content.md",
      ]);

      await git.checkout();

      return true;
    } catch {
      return false;
    }
  }

  static createCollection(owner: string, repository: string, branch: string) {
    const localPath = `/tmp/${owner}`;

    const collection: Collection = {
      owner: owner,
      settings: {},
      posts: [],
    };

    const settings = this.readFileSync(localPath, "settings.json");
    if (settings) {
      const parsed = SettingsSchema.safeParse(JSON.parse(settings));
      if (parsed.success) {
        collection.settings = parsed.data;

        collection.settings.navigations?.forEach((element) => {
          if (element.path) {
            element.path = Utils.getNavigationPath(element.path);
          }
        });
      }
    }

    const dirs = fs.readdirSync(localPath);
    dirs.forEach((file) => {
      const filePath = path.join(localPath, file);
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

            const imageRegex = /!\[(.*?)\]\((.+?)\)/g;
            const body = contentData.body.replace(
              imageRegex,
              (_: string, alt: string, link: string): string => {
                return `![${alt}](${Utils.getImageURL(
                  owner,
                  repository,
                  link,
                  `/posts/${subFile}`,
                  branch
                )})`;
              }
            );

            collection.posts.push({
              title: contentData.attributes.title ?? subFile,
              summary: contentData.attributes.summary ?? body.slice(0, 160),
              date: contentData.attributes.date,
              tags: contentData.attributes.tags,
              path: path.relative(localPath, mdFilePath),
              body: body,
            });
          });
        });
      }
    });

    return collection;
  }

  static hasTypestone(owner: string): boolean {
    const tmpPath = `/tmp/${owner}`;

    try {
      fs.readFileSync(path.join(tmpPath, ".typestone"), "utf-8");

      return true;
    } catch {
      return false;
    }
  }
}
