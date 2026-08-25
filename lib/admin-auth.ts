import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "amd_admin_session";
const SESSION_SECONDS = 60 * 60 * 8;
const globalAuth = globalThis as typeof globalThis & { assistmydayEphemeralAuthSecret?: Buffer };

type SessionPayload = { email: string; exp: number };

export function isAdminAuthConfigured() {
  return Boolean(process.env.ADMIN_EMAIL && (process.env.ADMIN_PASSWORD?.length || 0) >= 8);
}

function secret() {
  const configuredSecret = process.env.ADMIN_AUTH_SECRET;
  if (configuredSecret && configuredSecret.length >= 32) return configuredSecret;
  globalAuth.assistmydayEphemeralAuthSecret ??= randomBytes(32);
  return globalAuth.assistmydayEphemeralAuthSecret;
}

function sameValue(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

function signature(value: string) {
  return createHmac("sha256", secret()).update(value).digest("base64url");
}

export function verifyAdminCredentials(email: string, password: string) {
  if (!isAdminAuthConfigured()) return false;
  return sameValue(email.trim().toLowerCase(), process.env.ADMIN_EMAIL!.trim().toLowerCase()) &&
    sameValue(password, process.env.ADMIN_PASSWORD!);
}

export async function createAdminSession(email: string) {
  const payload: SessionPayload = {
    email: email.trim().toLowerCase(),
    exp: Math.floor(Date.now() / 1000) + SESSION_SECONDS,
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const token = `${encoded}.${signature(encoded)}`;
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_SECONDS,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export async function getAdminSession() {
  if (!isAdminAuthConfigured()) return null;
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return null;
  const [encoded, tokenSignature] = token.split(".");
  if (!encoded || !tokenSignature || !sameValue(tokenSignature, signature(encoded))) return null;
  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as SessionPayload;
    if (!payload.email || payload.exp <= Math.floor(Date.now() / 1000)) return null;
    if (!sameValue(payload.email, process.env.ADMIN_EMAIL!.trim().toLowerCase())) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function requireAdminSession() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}

function parseOrigin(value: string | undefined | null) {
  if (!value) return null;
  try { return new URL(value).origin; } catch { return null; }
}

export function isSameOrigin(request: Request) {
  const origin = parseOrigin(request.headers.get("origin"));
  if (!origin) return !request.headers.get("origin");

  const allowedOrigins = new Set<string>();
  const requestOrigin = parseOrigin(request.url);
  const configuredOrigin = parseOrigin(process.env.NEXT_PUBLIC_SITE_URL);
  if (requestOrigin) allowedOrigins.add(requestOrigin);
  if (configuredOrigin) allowedOrigins.add(configuredOrigin);

  return allowedOrigins.has(origin);
}
