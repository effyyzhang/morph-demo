'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  readOnly?: boolean;
}

export function CodeEditor({
  value,
  onChange,
  placeholder = 'Enter your code here...',
  className,
  readOnly = false,
}: CodeEditorProps) {
  const [lineNumbers, setLineNumbers] = useState<number[]>([1]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    
    // Update line numbers
    const lines = newValue.split('\n').length;
    setLineNumbers(Array.from({ length: lines }, (_, i) => i + 1));
  };

  return (
    <div className={cn("flex border rounded-lg bg-gray-900 text-gray-100", className)}>
      <div className="py-4 px-2 text-gray-500 text-sm font-mono select-none border-r border-gray-700">
        {lineNumbers.map((num) => (
          <div key={num} className="leading-6">
            {num}
          </div>
        ))}
      </div>
      <textarea
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        readOnly={readOnly}
        className="flex-1 p-4 bg-transparent font-mono text-sm outline-none resize-none leading-6"
        style={{ tabSize: 2 }}
        spellCheck={false}
      />
    </div>
  );
}