import {
  AvailableLanguage,
  BooleanString,
  InputPosition,
  Mapping,
  Repo,
  Theme,
} from "./giscus-type";

export interface Metadata {
  username: string;
  navigations: Navigation[];
  giscus: Giscus | undefined;
  branch: string;
  posts: Post[];
}

export interface Navigation {
  title: string | undefined;
  path: string | undefined;
}

export interface Giscus {
  repo: Repo | undefined;
  repoId: string | undefined;
  category: string | undefined;
  categoryId: string | undefined;
  mapping: Mapping | undefined;
  reactionsEnabled: BooleanString | undefined;
  emitMetadata: BooleanString | undefined;
  inputPosition: InputPosition | undefined;
  theme: Theme | undefined;
  lang: AvailableLanguage | undefined;
}

export interface Post {
  title: string;
  summary: string;
  date: string | undefined;
  tags: string[] | undefined;
  path: string;

  body: string;
}

export interface PostFrontMatter {
  attributes: {
    title: string | undefined;
    summary: string | undefined;
    date: string | undefined;
    tags: string[] | undefined;
  };
  body: string;
}

export interface ApiKey {
  id: number;
  created_at: string;
  key: string;
  owner: string;
}

export interface TOCItem {
  level: 2 | 3;
  title: string;
  href: `#${string}`;
}
