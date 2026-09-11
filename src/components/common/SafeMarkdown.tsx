import React, { Component, ErrorInfo, ReactNode } from 'react';
import Markdown, { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface SafeMarkdownProps {
  children?: string | null | any;
  className?: string;
  components?: Partial<Components>;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackText: string;
  className?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class MarkdownErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('SafeMarkdown rendering error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={`whitespace-pre-wrap font-sans text-sm ${this.props.className || ''}`}>
          {this.props.fallbackText}
        </div>
      );
    }
    return this.props.children;
  }
}

/**
 * Safely converts string-based HTML break tags (<br>, <br/>, <br />, <br><br>, etc.)
 * into genuine React <br /> elements without using dangerouslySetInnerHTML.
 */
export function renderSafeLineBreaks(node: React.ReactNode): React.ReactNode {
  if (typeof node === 'string') {
    if (!/<br\s*\/?>/i.test(node)) {
      return node;
    }
    const parts = node.split(/<br\s*\/?>/gi);
    return parts.map((part, index) => (
      <React.Fragment key={index}>
        {index > 0 && <br />}
        {part}
      </React.Fragment>
    ));
  }

  if (Array.isArray(node)) {
    return React.Children.map(node, (child) => renderSafeLineBreaks(child));
  }

  if (React.isValidElement(node)) {
    const elementProps = node.props as { children?: React.ReactNode; [key: string]: any };
    if (elementProps && elementProps.children) {
      return React.cloneElement(
        node,
        undefined,
        renderSafeLineBreaks(elementProps.children)
      );
    }
  }

  return node;
}

export const SafeMarkdown: React.FC<SafeMarkdownProps> = ({ children, className, components }) => {
  const content = typeof children === 'string' ? children : (children != null ? String(children) : '');

  if (!content) {
    return null;
  }

  return (
    <MarkdownErrorBoundary fallbackText={content} className={className}>
      <div className={className}>
        <Markdown
          remarkPlugins={[remarkGfm]}
          components={{
            img: ({ src, ...props }) => {
              if (!src || src === "") {
                return null; // Don't render images with empty src
              }
              return <img src={src} {...props} />;
            },
            td: ({ node, children, ...props }) => (
              <td {...props}>{renderSafeLineBreaks(children)}</td>
            ),
            th: ({ node, children, ...props }) => (
              <th {...props}>{renderSafeLineBreaks(children)}</th>
            ),
            ...components
          }}
        >
          {content}
        </Markdown>
      </div>
    </MarkdownErrorBoundary>
  );
};
