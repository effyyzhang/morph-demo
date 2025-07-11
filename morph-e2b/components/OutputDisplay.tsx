'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface OutputDisplayProps {
  outputs: any[];
  error?: string | null;
  logs?: string[];
  className?: string;
}

export function OutputDisplay({
  outputs,
  error,
  logs,
  className,
}: OutputDisplayProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {error && (
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800">
          <h4 className="font-semibold text-red-700 dark:text-red-300 mb-1">Error</h4>
          <pre className="text-sm text-red-600 dark:text-red-400 whitespace-pre-wrap">
            {error}
          </pre>
        </div>
      )}

      {logs && logs.length > 0 && (
        <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
          <h4 className="font-semibold mb-2">Logs</h4>
          <div className="space-y-1">
            {logs.map((log, index) => (
              <div key={index} className="text-sm font-mono text-gray-600 dark:text-gray-400">
                {log}
              </div>
            ))}
          </div>
        </div>
      )}

      {outputs && outputs.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-semibold">Output</h4>
          {outputs.map((output, index) => (
            <div
              key={index}
              className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
            >
              {output.type === 'text' && (
                <pre className="text-sm font-mono whitespace-pre-wrap">
                  {output.text}
                </pre>
              )}
              {output.type === 'error' && (
                <pre className="text-sm font-mono text-red-600 dark:text-red-400 whitespace-pre-wrap">
                  {output.text}
                </pre>
              )}
              {output.type === 'image' && output.data && (
                <img
                  src={`data:${output.format};base64,${output.data}`}
                  alt="Output"
                  className="max-w-full rounded"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}