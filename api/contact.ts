/// <reference types="node" />
// Vercel Function: POST /api/contact. Answers 503 "not_configured" until
// RESEND_API_KEY, CONTACT_TO_EMAIL and CONTACT_FROM_EMAIL are set in the Vercel
// project. See docs/launch/contact-form.md.
import { consoleLog, handleContact, memoryRateLimiter } from "../src/lib/contact-handler.ts";

const allow = memoryRateLimiter();
const deps = { fetch, now: Date.now, allow, log: consoleLog };

export async function POST(request: Request): Promise<Response> {
  return handleContact(request, process.env, deps);
}

export async function GET(request: Request): Promise<Response> {
  return handleContact(request, process.env, deps);
}
