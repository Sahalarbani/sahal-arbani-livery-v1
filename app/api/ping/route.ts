import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Opt out of caching so it actually hits the server/database every time
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Jalankan query paling ringan ke Database untuk mencegah Neon Postgres "Tidur"
    await prisma.$queryRaw`SELECT 1`;
    
    return NextResponse.json({ 
        status: 'Online', 
        message: 'Serverless Functions and Neon PostgreSQL are awake and warm!',
        timestamp: new Date().toISOString()
    }, { status: 200 });
    
  } catch (error) {
    console.error("Keep-alive Ping Error:", error);
    return NextResponse.json({ 
        status: 'Offline', 
        message: 'Failed to wake up database.' 
    }, { status: 500 });
  }
}
