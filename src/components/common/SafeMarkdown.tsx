import React from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

interface SafeMarkdownProps {
  children: string;
}

export const SafeMarkdown = ({ children }: SafeMarkdownProps) => {
  return (
    <Markdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight]}
      components={{
        img: ({ src, ...props }) => {
          if (!src || src === "") {
            return null; // Don't render images with empty src
          }
          return <img src={src} {...props} />;
        }
      }}
    >
      {children}
    </Markdown>
  );
};
