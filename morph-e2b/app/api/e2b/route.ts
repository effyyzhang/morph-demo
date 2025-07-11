import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    }

    // For this demo, we'll just return HTML directly since we're only dealing with HTML files
    // In a production app, you might want to use E2B's sandboxed execution
    console.log('Returning HTML for iframe rendering, length:', code.length);
    
    return NextResponse.json({ 
      success: true, 
      results: {
        outputs: [{
          type: 'html',
          html: code
        }]
      }
    });
  } catch (error) {
    console.error('E2B execution error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to execute code' },
      { status: 500 }
    );
  }
}