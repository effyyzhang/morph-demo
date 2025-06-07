'use client';

import React, { useState, useCallback } from 'react';
import { DocumentViewer } from '@/components/DocumentViewer';
import { TransformationBar } from '@/components/TransformationBar';
import { DEMO_CONTENT, DOCUMENT_TRANSFORMS } from '@/lib/constants';

export default function HomePage() {
  const [openAIContent, setOpenAIContent] = useState(DEMO_CONTENT);
  const [morphContent, setMorphContent] = useState(DEMO_CONTENT);
  const [openAITime, setOpenAITime] = useState<number | null>(null);
  const [morphTime, setMorphTime] = useState<number | null>(null);
  const [isTransforming, setIsTransforming] = useState(false);

  const handleTransformation = useCallback(async (transformationKey: string) => {
    if (isTransforming) return;
    
    setIsTransforming(true);
    setOpenAITime(null);
    setMorphTime(null);
    
    // Clear both panels immediately to show transformation has started
    setOpenAIContent('');
    setMorphContent('');
    
    const transformation = DOCUMENT_TRANSFORMS.find(t => t.key === transformationKey);
    if (!transformation) {
      setIsTransforming(false);
      return;
    }

    try {
      // Shared start time for perfect synchronization
      const sharedStartTime = Date.now();
      console.log('🚀 Starting both transformations simultaneously at:', sharedStartTime);
      
      // Run both transformations in parallel with streaming and shared start time
      await Promise.all([
        transformWithOpenAIStreaming(DEMO_CONTENT, transformation.prompt, setOpenAIContent, setOpenAITime, sharedStartTime),
        transformWithMorphStreaming(DEMO_CONTENT, transformation.prompt, setMorphContent, setMorphTime, sharedStartTime)
      ]);
    } catch (error) {
      console.error('Transformation error:', error);
    } finally {
      setIsTransforming(false);
    }
  }, [isTransforming]);

  const handleReset = useCallback(() => {
    setOpenAIContent(DEMO_CONTENT);
    setMorphContent(DEMO_CONTENT);
    setOpenAITime(null);
    setMorphTime(null);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-muted/30">
      {/* Main Content - Split View */}
      <div className="flex-1 flex pb-20 bg-muted/30"> {/* Add padding bottom for fixed toolbar */}
        {/* OpenAI Side */}
        <div className="flex-1 border-r border-border">
          <DocumentViewer
            content={openAIContent}
            title="OpenAI GPT-4"
            time={openAITime}
            isTransforming={isTransforming}
          />
        </div>

        {/* Morph Side */}
        <div className="flex-1">
          <DocumentViewer
            content={morphContent}
            title="Morph (2000+ tokens/sec)"
            time={morphTime}
            isTransforming={isTransforming}
          />
        </div>
      </div>

      {/* Fixed Bottom Transformation Bar */}
      <TransformationBar
        onTransform={handleTransformation}
        onReset={handleReset}
        isTransforming={isTransforming}
        className="fixed bottom-0 left-0 right-0 z-10"
      />
    </div>
  );
}

async function transformWithOpenAIStreaming(
  content: string, 
  prompt: string, 
  setContent: (content: string) => void,
  setTime: (time: number) => void,
  sharedStartTime: number
) {
  try {
    console.log('📡 OpenAI API call starting...');
    const response = await fetch('/api/openai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ document: content, transformation: prompt, stream: true }),
    });

    console.log('✅ OpenAI response received, status:', response.status);
    if (!response.ok) throw new Error(`OpenAI transformation failed: ${response.status}`);
    
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let accumulated = '';

    if (!reader) {
      throw new Error('No reader available for streaming response');
    }

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulated += chunk;
        
        // Update content in real-time
        setContent(accumulated);
      }

      const endTime = Date.now();
      const totalTime = endTime - sharedStartTime;
      setTime(totalTime);
      
      console.log('🏁 OpenAI streaming completed in:', totalTime, 'ms');
    } finally {
      reader.releaseLock();
    }
  } catch (error) {
    console.error('❌ OpenAI streaming error:', error);
    // Fallback to non-streaming
    return transformWithOpenAI(content, prompt, setContent, setTime, sharedStartTime);
  }
}

async function transformWithMorphStreaming(
  content: string, 
  prompt: string, 
  setContent: (content: string) => void,
  setTime: (time: number) => void,
  sharedStartTime: number
) {
  try {
    console.log('🚀 Morph API call starting...');
    const response = await fetch('/api/morph', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ document: content, transformation: prompt, stream: true }),
    });

    console.log('✅ Morph response received, status:', response.status);
    if (!response.ok) throw new Error(`Morph transformation failed: ${response.status}`);
    
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let accumulated = '';

    if (!reader) {
      throw new Error('No reader available for streaming response');
    }

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulated += chunk;
        
        // Update content in real-time
        setContent(accumulated);
      }

      const endTime = Date.now();
      const totalTime = endTime - sharedStartTime;
      setTime(totalTime);
      
      console.log('🏁 Morph streaming completed in:', totalTime, 'ms');
    } finally {
      reader.releaseLock();
    }
  } catch (error) {
    console.error('❌ Morph streaming error:', error);
    // Fallback to non-streaming
    return transformWithMorph(content, prompt, setContent, setTime, sharedStartTime);
  }
}

// Fallback non-streaming functions
async function transformWithOpenAI(
  content: string, 
  prompt: string, 
  setContent: (content: string) => void,
  setTime: (time: number) => void,
  sharedStartTime: number
) {
  try {
    const response = await fetch('/api/openai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ document: content, transformation: prompt }),
    });

    if (!response.ok) throw new Error(`OpenAI transformation failed: ${response.status}`);
    
    const transformedContent = await response.text();
    const endTime = Date.now();
    const totalTime = endTime - sharedStartTime;
    
    setContent(transformedContent);
    setTime(totalTime);
  } catch (error) {
    console.error('OpenAI error:', error);
  }
}

async function transformWithMorph(
  content: string, 
  prompt: string, 
  setContent: (content: string) => void,
  setTime: (time: number) => void,
  sharedStartTime: number
) {
  try {
    const response = await fetch('/api/morph', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ document: content, transformation: prompt }),
    });

    if (!response.ok) throw new Error('Morph transformation failed');
    
    const transformedContent = await response.text();
    const endTime = Date.now();
    const totalTime = endTime - sharedStartTime;
    
    setContent(transformedContent);
    setTime(totalTime);
  } catch (error) {
    console.error('Morph error:', error);
  }
} 