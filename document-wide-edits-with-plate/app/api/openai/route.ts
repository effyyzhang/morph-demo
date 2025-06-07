import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';

// Check if API key is available
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const openai = OPENAI_API_KEY ? new OpenAI({
  apiKey: OPENAI_API_KEY,
}) : null;

export async function POST(req: NextRequest) {
  try {
    const { document, transformation, stream = false } = await req.json();

    if (!document || !transformation) {
      return NextResponse.json(
        { error: 'Document and transformation are required' },
        { status: 400 }
      );
    }

    // If no API key, return a demo transformation with streaming support
    if (!openai) {
      const demoResult = `# Demo Transformation Applied (OpenAI)

**Transformation**: ${transformation}

**Note**: This is a demo transformation since no OpenAI API key is configured.

${document}

---
*This document was processed using OpenAI's GPT-4 model*`;

      if (stream) {
        // Simulate streaming for demo - slower than Morph to show the difference
        const encoder = new TextEncoder();
        const readable = new ReadableStream({
          async start(controller) {
            try {
              // Split the demo result into chunks and stream them slower than Morph
              const words = demoResult.split(' ');
              for (let i = 0; i < words.length; i++) {
                const chunk = (i === 0 ? words[i] : ' ' + words[i]);
                controller.enqueue(encoder.encode(chunk));
                // Slower streaming for OpenAI demo (20ms vs 10ms for Morph)
                await new Promise(resolve => setTimeout(resolve, 20));
              }
              controller.close();
            } catch (error) {
              controller.error(error);
            }
          },
        });

        return new Response(readable, {
          headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Transfer-Encoding': 'chunked',
          },
        });
      } else {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate longer processing time than Morph
        
        return new Response(demoResult, {
          headers: { 'Content-Type': 'text/plain' },
        });
      }
    }

    const systemPrompt = `You are a professional document editor. Your task is to transform the provided document according to the user's instructions while maintaining the original meaning and important information. Return only the transformed document content in markdown format.`;

    const userPrompt = `Please transform this document:\n\n${document}\n\nTransformation requested: ${transformation}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      stream: stream,
      temperature: 0.3,
    });

    if (stream) {
      // Handle streaming response
      const encoder = new TextEncoder();
      const readable = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of response as any) {
              const content = chunk.choices[0]?.delta?.content || '';
              if (content) {
                controller.enqueue(encoder.encode(content));
              }
            }
            controller.close();
          } catch (error) {
            controller.error(error);
          }
        },
      });

      return new Response(readable, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Transfer-Encoding': 'chunked',
        },
      });
    } else {
      // Handle non-streaming response
      const content = (response as any).choices[0].message.content;
      return new Response(content, {
        headers: { 'Content-Type': 'text/plain' },
      });
    }
  } catch (error) {
    console.error('OpenAI API error:', error);
    return NextResponse.json(
      { error: 'Failed to transform document with OpenAI' },
      { status: 500 }
    );
  }
} 