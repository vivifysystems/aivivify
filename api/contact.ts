/// <reference types="node" />
// Vercel Function: POST /api/contact. Inactive until RESEND_API_KEY,
// CONTACT_TO_EMAIL and CONTACT_FROM_EMAIL are set in the Vercel project
// (it answers 503 "not_configured" until then). See docs/launch/contact-form.md.
// Verify this route on a Vercel preview deployment before relying on it.
import { handleContact, memoryRateLimiter } from "../src/lib/contact-handler.ts";

const allow = memoryRateLimiter();

export async function POST(request: Request): Promise<Response> {
  return handleContact(request, process.env, { fetch, now: Date.now, allow });
}

export async function GET(request: Request): Promise<Response> {
  return handleContact(request, process.env, { fetch, now: Date.now, allow });
}
