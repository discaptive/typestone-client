import fs from "fs";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

import "highlight.js/styles/github-dark-dimmed.css";

export default function Index() {
  const readme = fs.readFileSync("README.md", "utf8");

  return (
    <div className="prose max-w-none pb-8 pt-10 dark:prose-invert">
      <ReactMarkdown
        className="break-words"
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeSlug]}
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
    </div>
  );
}
