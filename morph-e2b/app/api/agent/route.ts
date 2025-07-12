import { openai } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { NextRequest } from 'next/server';
import storage from '../../../lib/storage';

// Tool for creating new files
const createFileTool = tool({
  description: 'Create a new file with complete content',
  parameters: z.object({
    filename: z.string().describe('Name of the file to create (always use "index.html")'),
    content: z.string().describe('Complete content of the file'),
  }),
  execute: async ({ filename, content }) => {
    console.log('=== CREATE FILE TOOL ===');
    console.log('Creating file:', filename);
    console.log('Content length:', content.length);
    
    try {
      // Store the new file content
      storage.setCode(content);
      
      return {
        success: true,
        message: `Successfully created ${filename}`,
        newCode: content,
      };
    } catch (error) {
      console.error('Create file error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create file',
      };
    }
  },
});

// Tool for showing the update snippet (for debugging) - Comment out for production
// const showUpdateTool = tool({
//   description: 'Show the update snippet that would be sent to Morph (for debugging)',
//   parameters: z.object({
//     target_file: z.string().describe('Name of the file to edit (always use "index.html")'),
//     code_edit: z.string().describe('ONLY the updated/changed code snippets that should be merged with the original file'),
//   }),
//   execute: async ({ target_file, code_edit }) => {
//     console.log('=== SHOW UPDATE TOOL ===');
//     console.log('Target file:', target_file);
//     console.log('Update snippet length:', code_edit.length);
//     console.log('=== UPDATE SNIPPET START ===');
//     console.log(code_edit);
//     console.log('=== UPDATE SNIPPET END ===');
//     
//     const originalContent = storage.getCode();
//     
//     if (!originalContent) {
//       console.log('No original content found!');
//       return {
//         success: false,
//         error: 'No existing file to show updates for. Use createFile first.',
//         snippet: code_edit,
//       };
//     }
//     
//     console.log('Original content length:', originalContent.length);
//     console.log('This would be sent to Morph as:');
//     console.log('<code>' + originalContent.substring(0, 100) + '...</code>');
//     console.log('<update>' + code_edit + '</update>');
//     
//     return {
//       success: true,
//       message: `Update snippet for ${target_file} (check console for full snippet)`,
//       snippet: code_edit,
//       originalLength: originalContent.length,
//       snippetLength: code_edit.length,
//     };
//   },
// });

// Tool for editing existing files using Morph
const editFileTool = tool({
  description: `Use this tool to propose an edit to an existing file.

This will be read by a less intelligent model, which will quickly apply the edit. You should make it clear what the edit is, while also minimizing the unchanged code you write.

When writing the edit, you should specify each edit in sequence, with the special comment // ... existing code ... to represent unchanged code in between edited lines.

For example:

// ... existing code ...
FIRST_EDIT
// ... existing code ...
SECOND_EDIT
// ... existing code ...
THIRD_EDIT
// ... existing code ...

This will be read by a less intelligent model, which will quickly apply the edit. You should make it clear what the edit is, while also minimizing the unchanged code you write.
When writing the edit, you should specify each edit in sequence, with the special comment // ... existing code ... to represent unchanged code in between edited lines.

You should bias towards repeating as few lines of the original file as possible to convey the change.
NEVER show unmodified code in the edit, unless sufficient context of unchanged lines around the code you're editing is needed to resolve ambiguity.
If you plan on deleting a section, you must provide surrounding context to indicate the deletion.
DO NOT omit spans of pre-existing code without using the // ... existing code ... comment to indicate its absence.`,
  parameters: z.object({
    target_file: z.string().describe('Name of the file to edit (always use "index.html")'),
    code_edit: z.string().describe('The edit instructions with // ... existing code ... markers'),
  }),
  execute: async ({ target_file, code_edit }) => {
    console.log('=== EDIT FILE TOOL (MORPH) ===');
    console.log('Editing file:', target_file);
    console.log('Code edit length:', code_edit.length);
    
    try {
      const originalContent = storage.getCode();
      
      if (!originalContent) {
        throw new Error('No existing file to edit. Use createFile first.');
      }
      
      // Call Morph API following the documentation format
      console.log('Making Morph API request...');
      console.log('API Key present:', !!process.env.MORPH_API_KEY);
      console.log('Original content length:', originalContent.length);
      console.log('Code edit content:', code_edit.substring(0, 200) + '...');
      
      const response = await fetch('https://api.morphllm.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.MORPH_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'morph-v3-large',
          messages: [{
            role: 'user',
            content: `<code>${originalContent}</code>\n<update>${code_edit}</update>`
          }],
          temperature: 0,
          max_tokens: 8192
        }),
      });

      console.log('Morph API response status:', response.status);
      console.log('Morph API response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('=== MORPH API ERROR ===');
        console.error('Status:', response.status);
        console.error('Status Text:', response.statusText);
        console.error('Response body:', errorText);
        console.error('=== END MORPH API ERROR ===');
        throw new Error(`Morph API error: ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      const transformedCode = data.choices[0].message.content;
      
      // Store the updated code
      storage.setCode(transformedCode);
      console.log('Updated code length:', transformedCode.length);
      
      return {
        success: true,
        message: `File ${target_file} was successfully updated`,
        newCode: transformedCode,
      };
    } catch (error) {
      console.error('Edit file error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to edit file',
      };
    }
  },
});

// Create a factory function that accepts the request URL
const createExecuteCodeTool = (requestUrl?: string) => tool({
  description: 'Execute the current application code to show live preview',
  parameters: z.object({}),
  execute: async () => {
    console.log('=== EXECUTE CODE TOOL ===');
    const code = storage.getCode();
    console.log('Current code length:', code?.length || 0);
    
    if (!code) {
      console.log('No code to execute!');
      return { error: 'No code to execute' };
    }

    try {
      // Use the request URL to construct the API endpoint
      let apiUrl: string;
      if (requestUrl) {
        const url = new URL(requestUrl);
        apiUrl = `${url.protocol}//${url.host}/api/e2b`;
        console.log('Using request-based URL:', apiUrl);
      } else if (process.env.NEXT_PUBLIC_APP_URL) {
        apiUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/e2b`;
        console.log('Using env variable URL:', apiUrl);
      } else {
        apiUrl = 'http://localhost:3000/api/e2b';
        console.log('Using default URL:', apiUrl);
      }

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      console.log('E2B response status:', response.status);
      console.log('E2B response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('E2B API error response:', errorText);
        throw new Error(`E2B API error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('E2B execution result:', result);
      
      return {
        success: true,
        message: 'Code executed successfully',
        ...result
      };
    } catch (error) {
      console.error('Execute code error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to execute code'
      };
    }
  },
});

export async function POST(req: NextRequest) {
  try {
    console.log('=== AGENT API ROUTE HIT ===');
    console.log('Request URL:', req.url);
    console.log('Request method:', req.method);
    
    const body = await req.json();
    console.log('Request body keys:', Object.keys(body));
    
    const { messages } = body;

    console.log('=== AGENT API START ===');
    console.log('Messages count:', messages?.length || 0);
    console.log('Has stored code:', storage.hasCode());
    console.log('Stored code length:', storage.getCode().length);
    
    const result = await streamText({
      model: openai('gpt-3.5-turbo'),
      messages,
      tools: {
        createFile: createFileTool,
        // showUpdate: showUpdateTool, // Commented out for production
        editFile: editFileTool,
        executeCode: createExecuteCodeTool(req.url),
      },
      maxSteps: 5,
      system: `You are an expert React developer that creates beautiful, modern single-page applications.

Your goal is to create complete, self-contained React applications in a SINGLE index.html file.

TOOLS USAGE:
1. createFile - Use this to create a new index.html file with complete content
2. showUpdate - Use this to show the update snippet that would be sent to Morph (for debugging)
3. editFile - Use this to edit an existing file using Morph (after showUpdate)
4. executeCode - Use this to preview the current code

CRITICAL INSTRUCTIONS:

For CREATING a new app:
- Use createFile with the complete HTML code
- Example:
  createFile({
    filename: "index.html",
    content: "<!DOCTYPE html>...[complete HTML]...</html>"
  })

For EDITING an existing app:
- Use editFile with the special comment // ... existing code ... to represent unchanged code
- Specify each edit in sequence with minimal context
- Example:
  editFile({
    target_file: "index.html",
    code_edit: \`// ... existing code ...
body {
  background-color: #000;
  color: #fff;
}
// ... existing code ...
.hero {
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
}
// ... existing code ...\`
  })

IMPORTANT RULES:
1. Always use filename: "index.html"
2. For new apps: provide complete HTML in createFile
3. For edits: use // ... existing code ... markers as shown in the example
4. Never include the full file when editing
5. YOU MUST ALWAYS call executeCode after EVERY createFile or editFile - THIS IS CRITICAL!
6. NEVER include markdown images or placeholders in your responses
7. NEVER say "view the preview below" or similar - the preview is automatically displayed
8. Keep responses SHORT and focused on what you did
9. After creating/editing, just describe briefly what was implemented

CRITICAL WORKFLOW - ALWAYS FOLLOW THIS SEQUENCE:
1. When user asks to create something: 
   - First: call createFile with complete HTML
   - Then: IMMEDIATELY call executeCode to render the preview
   
2. When user asks to edit:
   - First: call editFile with // ... existing code ... format
   - Then: IMMEDIATELY call executeCode to render the preview

3. NEVER end your response without calling executeCode
4. The preview won't show unless you call executeCode!

Remember: executeCode is what makes the preview appear in the UI!

When creating React apps:
- Use React CDN: https://unpkg.com/react@18/umd/react.production.min.js
- Use ReactDOM CDN: https://unpkg.com/react-dom@18/umd/react-dom.production.min.js
- Use Babel Standalone: https://unpkg.com/@babel/standalone/babel.min.js
- Put React code in <script type="text/babel">
- Use modern React features (hooks, functional components)
- Include beautiful CSS styling in <style> tags

Focus on creating visually appealing landing pages with:
- Hero sections
- Feature showcases  
- Testimonials
- CTAs
- Modern animations and transitions
- Professional color schemes
- Responsive design

RESPONSE FORMAT:
After completing tasks, provide a brief summary like:
"Created a modern SaaS landing page with dark theme, featuring a hero section, feature cards, and testimonials."
Do NOT include images, markdown formatting, or preview instructions.`,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Agent API error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}