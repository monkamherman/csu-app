import { NextResponse } from 'next/server';

/**
 * Endpoint de health check pour monitoring et Docker healthcheck
 * GET /api/health
 */
export async function GET() {
  const healthcheck = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0',
  };

  return NextResponse.json(healthcheck, { status: 200 });
}
