import { NextResponse, NextRequest } from 'next/server';
import storage from '../../../lib/storage';

export async function GET() {
  const code = storage.getCode();
  return NextResponse.json({
    hasStoredCode: storage.hasCode(),
    storedCodeLength: code.length,
    storedCodePreview: code.substring(0, 100) + '...' || 'No code',
    timestamp: new Date().toISOString()
  });
}

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  
  // Handle /api/debug/clear
  if (url.pathname.endsWith('/clear')) {
    try {
      storage.clear();
      return NextResponse.json({
        success: true,
        message: 'Storage cleared successfully'
      });
    } catch (error) {
      return NextResponse.json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to clear storage'
      }, { status: 500 });
    }
  }
  
  // Default POST handler
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}