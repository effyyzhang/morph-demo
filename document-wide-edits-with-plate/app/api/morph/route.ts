import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';

// Check if API key is available
const MORPH_API_KEY = process.env.MORPH_API_KEY;
const openai = MORPH_API_KEY ? new OpenAI({
  apiKey: MORPH_API_KEY,
  baseURL: 'https://api.morphllm.com/v1',
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
      const demoResult = `# Demo Transformation Applied (Morph)

**Transformation**: ${transformation}

**Note**: This is a demo transformation since no Morph API key is configured.

${document}

---
*This document was processed using Morph's ultra-fast transformation engine (2000+ tokens/sec)*`;

      if (stream) {
        // Simulate streaming for demo - faster than OpenAI to show Morph's speed advantage
        const encoder = new TextEncoder();
        const readable = new ReadableStream({
          async start(controller) {
            try {
              // Split the demo result into chunks and stream them quickly
              const words = demoResult.split(' ');
              for (let i = 0; i < words.length; i++) {
                const chunk = (i === 0 ? words[i] : ' ' + words[i]);
                controller.enqueue(encoder.encode(chunk));
                // Faster streaming for Morph demo (10ms vs 20ms for OpenAI)
                await new Promise(resolve => setTimeout(resolve, 10));
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
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing time
        
        return new Response(demoResult, {
          headers: { 'Content-Type': 'text/plain' },
        });
      }
    }

    const response = await openai.chat.completions.create({
      model: 'morph-v2',
      messages: [
        {
          role: 'user',
          content: `<code>${document}</code>\n<update>${transformation}</update>`
        }
      ],
      stream: stream,
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
    console.error('Morph API error:', error);
    return NextResponse.json(
      { error: 'Failed to transform document with Morph' },
      { status: 500 }
    );
  }
} 