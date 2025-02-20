import { z } from "zod";
import type {
  AvailableLanguage,
  BooleanString,
  InputPosition,
  Mapping,
  Repo,
} from "@giscus/react";

export interface Collection {
  owner: string;
  settings: Settings;
  posts: Post[];
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

export const GiscusSchema = z.object({
  repo: z.custom<Repo>().optional(),
  repoId: z.string().optional(),
  category: z.string().optional(),
  categoryId: z.string().optional(),
  mapping: z.custom<Mapping>().optional(),
  reactionsEnabled: z.custom<BooleanString>().optional(),
  emitMetadata: z.custom<BooleanString>().optional(),
  inputPosition: z.custom<InputPosition>().optional(),
  lang: z.custom<AvailableLanguage>().optional(),
});

export type Giscus = z.infer<typeof GiscusSchema>;

export const NavigationSchema = z.object({
  title: z.string().optional(),
  path: z.string().optional(),
});

export type Navigation = z.infer<typeof NavigationSchema>;

export const SettingsSchema = z.object({
  username: z.string().optional(),
  navigations: z
    .array(NavigationSchema)
    .optional()
    .transform((navigations) =>
      navigations?.filter((nav) => Object.keys(nav).length > 0)
    ),
  giscus: GiscusSchema.optional(),
});

export type Settings = z.infer<typeof SettingsSchema>;

export interface TOCItem {
  level: 2 | 3;
  title: string;
  href: `#${string}`;
}
