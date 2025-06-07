'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getWordCount, getCharacterCount, getReadingTime, cn } from '../../lib/utils';
import { Badge } from '@/components/ui/badge';

interface DocumentViewerProps {
  content: string;
  title: string;
  time: number | null;
  isTransforming: boolean;
  className?: string;
}

export function DocumentViewer({ content, title, time, isTransforming, className }: DocumentViewerProps) {
  const stats = {
    words: getWordCount(content),
    characters: getCharacterCount(content),
    readingTime: getReadingTime(content),
  };

  return (
    <div className={cn('flex flex-col h-full bg-muted/30', className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-border bg-background">
        <div className="flex items-center space-x-4">
          <h1 className="text-base font-medium text-foreground">
            {title}
          </h1>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>{stats.words} words</span>
            <span>•</span>
            <span>{stats.characters} characters</span>
            <span>•</span>
            <span>{stats.readingTime} min read</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {isTransforming ? (
            <div className="flex items-center space-x-2 text-sm text-primary">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span>Transforming...</span>
            </div>
          ) : time !== null ? (
            <Badge variant="default" className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200">
              {time}ms
            </Badge>
          ) : null}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto bg-muted/30">
        <div className="max-w-4xl mx-auto px-8 py-8 h-full">
          <div className="bg-background rounded-lg p-8 shadow-sm border border-border">
            <div className={cn(
              'w-full min-h-[600px]',
              'prose prose-lg prose-zinc max-w-none dark:prose-invert',
              'text-foreground'
            )}>
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({children}) => (
                    <h1 className="text-3xl font-bold text-foreground mb-4 mt-8 leading-tight">
                      {children}
                    </h1>
                  ),
                  h2: ({children}) => (
                    <h2 className="text-2xl font-semibold text-foreground mb-3 mt-6 leading-tight">
                      {children}
                    </h2>
                  ),
                  h3: ({children}) => (
                    <h3 className="text-xl font-medium text-foreground mb-2 mt-4 leading-tight">
                      {children}
                    </h3>
                  ),
                  p: ({children}) => (
                    <p className="text-base text-foreground leading-relaxed mb-3">
                      {children}
                    </p>
                  ),
                  ul: ({children}) => (
                    <ul className="mb-4 pl-6 list-disc">
                      {children}
                    </ul>
                  ),
                  ol: ({children}) => (
                    <ol className="mb-4 pl-6 list-decimal">
                      {children}
                    </ol>
                  ),
                  li: ({children}) => (
                    <li className="text-base text-foreground leading-relaxed mb-1">
                      {children}
                    </li>
                  ),
                  blockquote: ({children}) => (
                    <blockquote className="border-l-4 border-border pl-4 italic text-muted-foreground my-4">
                      {children}
                    </blockquote>
                  ),
                  strong: ({children}) => (
                    <strong className="font-semibold text-foreground">
                      {children}
                    </strong>
                  ),
                  em: ({children}) => (
                    <em className="italic">
                      {children}
                    </em>
                  ),
                  code: ({children}) => (
                    <code className="bg-muted text-foreground px-1.5 py-0.5 rounded text-sm font-mono">
                      {children}
                    </code>
                  ),
                }}
              >
                {content || "No content available"}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 