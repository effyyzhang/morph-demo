'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface TransformationType {
  id: string;
  name: string;
  description: string;
  icon?: React.ReactNode;
}

export const transformationTypes: TransformationType[] = [
  {
    id: 'summarize',
    name: 'Summarize',
    description: 'Create a concise summary',
  },
  {
    id: 'explain',
    name: 'Explain',
    description: 'Explain in simple terms',
  },
  {
    id: 'refactor',
    name: 'Refactor',
    description: 'Improve code structure',
  },
  {
    id: 'optimize',
    name: 'Optimize',
    description: 'Make code more efficient',
  },
  {
    id: 'document',
    name: 'Document',
    description: 'Add documentation',
  },
  {
    id: 'translate',
    name: 'Translate',
    description: 'Convert to another language',
  },
];

interface TransformationPanelProps {
  selectedTransformation: string | null;
  onTransformationSelect: (transformationId: string) => void;
  className?: string;
}

export function TransformationPanel({
  selectedTransformation,
  onTransformationSelect,
  className,
}: TransformationPanelProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <h3 className="text-lg font-semibold mb-3">Transformations</h3>
      <div className="grid gap-2">
        {transformationTypes.map((transformation) => (
          <button
            key={transformation.id}
            onClick={() => onTransformationSelect(transformation.id)}
            className={cn(
              "p-3 text-left rounded-lg border transition-all",
              selectedTransformation === transformation.id
                ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                : "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
            )}
          >
            <div className="font-medium">{transformation.name}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {transformation.description}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}