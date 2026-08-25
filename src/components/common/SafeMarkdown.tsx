import React, { Component, ErrorInfo, ReactNode } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface SafeMarkdownProps {
  children?: string | null | any;
  className?: string;
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

export const SafeMarkdown: React.FC<SafeMarkdownProps> = ({ children, className }) => {
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
            }
          }}
        >
          {content}
        </Markdown>
      </div>
    </MarkdownErrorBoundary>
  );
};
