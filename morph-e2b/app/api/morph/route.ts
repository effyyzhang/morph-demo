import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { originalCode, updateInstructions } = await request.json();

    if (!originalCode || !updateInstructions) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!process.env.MORPH_API_KEY) {
      return NextResponse.json({ error: 'Morph API key is not configured' }, { status: 500 });
    }

    // Call Morph API
    const response = await fetch('https://api.morphllm.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.MORPH_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'morph-apply-v1',
        messages: [{
          role: 'user',
          content: `${originalCode}\n · ${updateInstructions}`
        }],
        temperature: 0,
        max_tokens: 4096
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Morph API request failed');
    }

    const data = await response.json();
    const transformedCode = data.choices[0].message.content;

    return NextResponse.json({
      success: true,
      transformedCode,
      tokensPerSecond: data.usage?.tokens_per_second || 4500
    });
  } catch (error) {
    console.error('Morph API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to transform code' },
      { status: 500 }
    );
  }
}