# Typestone.io

Build your own blog using GitHub. A blog contents database system powered by [GitHub Repository](https://docs.github.com/repositories/creating-and-managing-repositories/about-repositories). All you have to do is just upload your content to your repository. Inspired by [tailwind-nextjs-starter-blog](https://github.com/timlrx/tailwind-nextjs-starter-blog) & [giscus](https://github.com/giscus/giscus).

- [Open source](https://github.com/discaptive/typestone-client). 🙏
- No ads, no tracking, always free. ⛔️
- Use your repository as a database. All data is stored on your [GitHub Repository](https://docs.github.com/repositories/creating-and-managing-repositories/about-repositories). 💿
- Blog posts are written in Markdown and converted into readable HTML on the frontend. 🔗

## How it works

1. When you push your blog contents (e.g., Markdown files) to the GitHub repository, it triggers a webhook that has a [typestone-app](https://github.com/apps/typestone-app) installed.

2. The webhook triggers to revalidate your contents while accessing the blog.

3. When you access to the website, it fetches the contents using the [Octokit SDK](https://github.com/octokit) & GitHub clone.

4. The blog post content is retrieved, processed, and rendered dynamically on the website.

## Configuration

### Create a repository named `typestone`

❗️ The repository name must be `typestone`.

❗️ The repository is `public`, otherwise visitors will not be able to see the posts.

### Install the `typestone-app` to the repository

The [`typestone-app`](https://github.com/apps/typestone-app) is installed, so that works on your repository.

### `[!Optional]` Add `.no-typestone` not to host on [typestone.io](https://typestone.io)

The website checks if there's a `.no-typestone` file and decide to host or not.

> **Note** -
>
> Works same like `.nojekyll` file.

### Publish a post

#### Directory Structure

To maintain consistency, blog content should be organized within the repository using the following convention:

- `settings.json` - A file containing metadata for a basic information of you. It contains `username`, `navigations` for top nav bar and `giscus` for the comments.
- `posts/*/content.md` - Each post file should follow this format.

  - e.g., `posts/example/cotent.md`

  ```markdown
  ---
  title: "This is a title for a post."
  summary: "This is a short description for a post."
  date: "2025-02-11 21:13"
  tags: ["tag1", "tag2"]
  ---

  This is a post body.
  ```

  > **Note** -
  >
  > All the images are recommended to be in the same directory and link it in relative ways.
  >
  > Of course we allow to use hyperlinks for the image .

- `settings.json` - A file containing metadata for a configuration. It contains `username`, `navigations` for top nav bar and `giscus` for the comments.

  ```json
  {
    "username": "username that appears on the header",
    "navigations": [
      {
        "title": "About",
        "path": "posts/about/content.md"
      },
      {
        "title": "Google",
        "path": "https://google.com"
      },
      {
        "title": "Projects",
        "path": "./posts/projects/content.md"
      }
    ],
    "giscus": {
      "repo": "[ENTER REPO HERE]",
      "repoId": "[ENTER REPO ID HERE]",
      "category": "[ENTER CATEGORY NAME HERE]",
      "categoryId": "[ENTER CATEGORY ID HERE]",
      "mapping": "pathname",
      "reactionsEnabled": "1",
      "lang": "en"
    }
  }
  ```

## Advanced usage

### API Integration

Developers can fetch blog content via API, making it easy to integrate with other applications.

#### `/api/generate-api-key`

```bash
curl \
  -H 'Content-Type: application/json' \
  -X POST \
  -d '{"owner": "<OWNER>"}' \
  https://typestone.io/api/generate-api-key
```

❗️ Be sure the typestone-app must be installed before generating api key.

❗️ It can be issued only once.

**❗️ If you want to issue the api key again, re-install the [typestone-app](https://github.com/apps/typestone-app) GitHub App and try again.**

#### `/api/get-single-content?owner=<OWNER>&path=<PATH>`

```bash
curl \
  -H 'X-API-KEY: <API_KEY>' \
  -X GET \
  https://typestone.io/api/generate-api-key?owner=<OWNER>&path=<PATH>
```
