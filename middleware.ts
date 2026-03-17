import { NextRequest, NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// ─── Redis client ─────────────────────────────────────────
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// ─── Rate limiters ────────────────────────────────────────

// General API limit — 60 requests per minute per IP
const generalLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(60, "1 m"),
  analytics: true,
  prefix: "nexapay:general",
});

// Strict limit for auth routes — 5 requests per 15 minutes per IP
const authLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "15 m"),
  analytics: true,
  prefix: "nexapay:auth",
});

// Payment routes — 30 requests per minute per IP
const paymentLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(30, "1 m"),
  analytics: true,
  prefix: "nexapay:payment",
});

// Contact form — 3 submissions per hour per IP
const contactLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "1 h"),
  analytics: true,
  prefix: "nexapay:contact",
});

// ─── Helper to get client IP ──────────────────────────────
function getIP(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "anonymous";
  return ip;
}

// ─── Main middleware ──────────────────────────────────────
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const ip = getIP(req);

  // Skip non-API routes
  if (!pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Choose the right limiter based on the route
  let limiter = generalLimiter;
  let limitKey = `general:${ip}`;

  if (
    pathname.startsWith("/api/auth/signin") ||
    pathname.startsWith("/api/auth/signup")
  ) {
    limiter = authLimiter;
    limitKey = `auth:${ip}`;
  } else if (
    pathname.startsWith("/api/notchpay") ||
    pathname.startsWith("/api/paypal")
  ) {
    limiter = paymentLimiter;
    limitKey = `payment:${ip}`;
  } else if (pathname.startsWith("/api/contact")) {
    limiter = contactLimiter;
    limitKey = `contact:${ip}`;
  }

  // Check rate limit
  const { success, limit, remaining, reset } = await limiter.limit(limitKey);

  // Add rate limit info to response headers
  const headers = new Headers();
  headers.set("X-RateLimit-Limit", String(limit));
  headers.set("X-RateLimit-Remaining", String(remaining));
  headers.set("X-RateLimit-Reset", String(reset));

  if (!success) {
    return NextResponse.json(
      {
        error: "Too many requests. Please slow down and try again later.",
        retryAfter: Math.ceil((reset - Date.now()) / 1000),
      },
      { status: 429, headers }
    );
  }

  return NextResponse.next({ headers });
}

// ─── Apply only to API routes ─────────────────────────────
export const config = {
  matcher: "/api/:path*",
};