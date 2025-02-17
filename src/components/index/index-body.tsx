import { all } from "lowlight";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

import "highlight.js/styles/github-dark-dimmed.css";

export default function IndexBody({ readme }: { readme: string }) {
  return (
    <ReactMarkdown
      className="break-words"
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[
        [
          rehypeHighlight,
          {
            languages: all,
          },
        ],
        rehypeSlug,
      ]}
      components={{
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        a: ({ node, ...props }) => <a {...props} target="_blank" />,

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        code: ({ node, className, children, ...props }) => {
          const isBlockCode = className && className.startsWith("language-");

          if (isBlockCode)
            return (
              <code
                {...props}
                className={className}
                style={{
                  padding: 0,
                  margin: 0,
                  backgroundColor: "transparent",
                }}
              >
                {children}
              </code>
            );

          return <code {...props}>{children}</code>;
        },
      }}
    >
      {readme}
    </ReactMarkdown>
  );
}
