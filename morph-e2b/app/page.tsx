'use client';

import { useChat } from 'ai/react';
import { useState, useEffect } from 'react';
import { ToolInvocation } from 'ai';

export default function Home() {
  const [currentCode, setCurrentCode] = useState('');
  const [executionResult, setExecutionResult] = useState<any>(null);
  const [isClearButtonVisible, setIsClearButtonVisible] = useState(false);

  // Update clear button visibility when code changes
  useEffect(() => {
    setIsClearButtonVisible(!!currentCode);
  }, [currentCode]);

  const clearAll = async () => {
    try {
      // Clear the storage on the server
      const response = await fetch('/api/debug/clear', { method: 'POST' });
      if (!response.ok) {
        throw new Error('Failed to clear storage');
      }
      // Clear local state
      setCurrentCode('');
      setExecutionResult(null);
    } catch (error) {
      console.error('Error clearing:', error);
    }
  };

  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: '/api/agent',
    maxSteps: 5,
  });

  // Process tool calls from messages
  useEffect(() => {
    const processMessages = async () => {
      for (const message of messages) {
        if (message.role === 'assistant' && message.toolInvocations) {
          for (const toolInvocation of message.toolInvocations) {
            const { toolName, state } = toolInvocation;
            
            if (state === 'result') {
              const result = toolInvocation.result;
              
              if ((toolName === 'createFile' || toolName === 'editFile') && result?.newCode) {
                setCurrentCode(result.newCode);
              } else if (toolName === 'executeCode' && result) {
                setExecutionResult(result);
              }
            }
          }
        }
      }
    };
    
    processMessages();
  }, [messages]);

  return (
    <div className="flex h-screen bg-[#0e1015]">
      {/* Left Side - Code & Preview */}
      <div className="flex-1 flex flex-col">
        {/* Tab Bar */}
        <div className="h-10 bg-[#1a1d23] border-b border-[#2a2d35] flex items-center justify-between px-4">
          <div className="flex items-center gap-2 text-sm">
            <div className="px-3 py-1 bg-[#0e1015] rounded text-gray-300 flex items-center gap-2">
              <span>📄</span>
              index.html
            </div>
          </div>
          {isClearButtonVisible && (
            <button
              onClick={clearAll}
              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition-colors"
            >
              Clear
            </button>
          )}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex">
          {/* Code Editor */}
          <div className="w-1/2 bg-[#0e1015] border-r border-[#2a2d35]">
            {currentCode ? (
              <div className="h-full overflow-auto">
                <pre className="p-4 text-sm font-mono text-gray-300">
                  <code>{currentCode}</code>
                </pre>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-600">
                <div className="text-center">
                  <p className="text-lg">No code yet</p>
                  <p className="text-sm mt-2">Start chatting to create a React app</p>
                  <p className="text-xs mt-1 text-gray-500">The AI will generate a complete React application in index.html</p>
                </div>
              </div>
            )}
          </div>

          {/* Preview */}
          <div className="w-1/2 bg-white">
            {executionResult?.results?.outputs?.[0]?.type === 'html' ? (
              <iframe 
                srcDoc={executionResult.results.outputs[0].html}
                className="w-full h-full"
                sandbox="allow-scripts"
              />
            ) : executionResult?.error ? (
              <div className="p-4 text-red-600">
                <h3 className="font-semibold mb-2">Error:</h3>
                <pre className="text-sm whitespace-pre-wrap">{executionResult.error}</pre>
              </div>
            ) : executionResult && !executionResult.success ? (
              <div className="p-4 text-red-600">
                <h3 className="font-semibold mb-2">Execution failed:</h3>
                <pre className="text-sm whitespace-pre-wrap">{JSON.stringify(executionResult, null, 2)}</pre>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                <div className="text-center px-4">
                  <p className="text-lg mb-2">Preview will appear here</p>
                  <p className="text-sm">Your React app will render in this preview window</p>
                  <p className="text-xs mt-4 text-gray-400">
                    Try: "Create a modern landing page for a SaaS product"
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Side - Chat */}
      <div className="w-96 bg-[#1a1d23] border-l border-[#2a2d35] flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-[#2a2d35]">
          <h2 className="text-white font-semibold">React App Builder</h2>
          <p className="text-xs text-gray-500 mt-1">
            Powered by OpenAI + Morph + E2B
          </p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-gray-500 text-sm">
              <p className="mb-3">I can create React landing pages. Try:</p>
              <div className="space-y-2">
                <p className="text-gray-400">→ "Create a modern SaaS landing page"</p>
                <p className="text-gray-400">→ "Build a portfolio website"</p>
                <p className="text-gray-400">→ "Make a product showcase page"</p>
                <p className="text-gray-400">→ "Design a startup homepage"</p>
              </div>
            </div>
          )}

          {messages.map((m) => (
            <div key={m.id} className="text-sm">
              <div className={`mb-1 font-semibold ${
                m.role === 'user' ? 'text-blue-400' : 'text-green-400'
              }`}>
                {m.role === 'user' ? 'You' : 'AI Agent'}
              </div>
              <div className="text-gray-300 whitespace-pre-wrap">
                {m.content}
              </div>
              
              {/* Show tool invocations */}
              {m.toolInvocations?.map((invocation: ToolInvocation, i: number) => (
                <div key={i} className="mt-2 p-2 bg-[#0e1015] rounded text-xs">
                  <div className="text-yellow-400">
                    🔧 {invocation.toolName}
                    {invocation.toolName === 'createFile' && ' (Create)'}
                    {invocation.toolName === 'showUpdate' && ' (Debug)'}
                    {invocation.toolName === 'editFile' && ' (Morph)'}
                    {invocation.toolName === 'executeCode' && ' (E2B)'}
                    {invocation.state === 'call' && ' - Processing...'}
                    {invocation.state === 'result' && ' - Complete'}
                  </div>
                  {invocation.state === 'result' && invocation.result?.message && (
                    <div className="text-gray-500 mt-1">{invocation.result.message}</div>
                  )}
                  {invocation.toolName === 'showUpdate' && invocation.state === 'result' && invocation.result?.snippet && (
                    <div className="mt-2 p-2 bg-gray-800 rounded text-green-400 text-xs">
                      <div className="font-semibold mb-1">Update Snippet:</div>
                      <pre className="whitespace-pre-wrap">{invocation.result.snippet}</pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}

          {isLoading && (
            <div className="text-gray-500 text-sm">
              AI Agent is working...
            </div>
          )}
          
          {error && (
            <div className="text-red-400 text-sm bg-red-900/20 p-3 rounded">
              <div className="font-semibold mb-1">Error:</div>
              <div className="text-xs">{error.message || 'Unknown error'}</div>
              {error.message?.includes('429') && (
                <div className="text-xs mt-2 text-yellow-400">
                  ⚠️ OpenAI API quota exceeded. Please check your billing at platform.openai.com
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-[#2a2d35]">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Describe the React app you want to create..."
            className="w-full p-3 bg-[#0e1015] border border-[#2a2d35] rounded-lg text-white placeholder-gray-600 text-sm focus:outline-none focus:border-blue-500"
            disabled={isLoading}
          />
        </form>
      </div>
    </div>
  );
}