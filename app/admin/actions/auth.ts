"use server";

import { redirect } from "next/navigation";

import { loginSchema } from "@/lib/validation";
import { clearSessionCookie, setSessionCookie } from "@/lib/session";

export type LoginState = { error?: string };

const attempts = new Map<string, { count: number; resetAt: number }>();

async function getClientKey(email: string): Promise<string> {
  const { headers } = await import("next/headers");
  const store = await headers();
  const ip = store.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  return `${ip}:${email}`;
}

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || entry.resetAt < now) {
    attempts.set(key, { count: 0, resetAt: now + 5 * 60_000 });
    return false;
  }
  return entry.count >= 5;
}

function registerFailure(key: string): void {
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || entry.resetAt < now) {
    attempts.set(key, { count: 1, resetAt: now + 5 * 60_000 });
    return;
  }
  entry.count += 1;
}

function clearFailures(key: string): void {
  attempts.delete(key);
}

function timingSafeEqual(a: string, b: string): boolean {
  const encoder = new TextEncoder();
  const bufA = encoder.encode(a);
  const bufB = encoder.encode(b);
  if (bufA.length !== bufB.length) return false;
  let diff = 0;
  for (let i = 0; i < bufA.length; i += 1) {
    diff |= bufA[i] ^ bufB[i];
  }
  return diff === 0;
}

export async function loginAction(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsedInput = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  const rateKey = await getClientKey(
    parsedInput.success ? parsedInput.data.email : "unknown",
  );
  if (isRateLimited(rateKey)) {
    return { error: "Terlalu banyak percobaan. Coba lagi dalam 5 menit." };
  }

  if (!parsedInput.success) {
    registerFailure(rateKey);
    return {
      error: parsedInput.error.issues[0]?.message ?? "Input tidak valid",
    };
  }
  const parsed = parsedInput;

  const expectedEmail = process.env.ADMIN_EMAIL ?? "admin@kodeva.test";
  const expectedPassword = process.env.ADMIN_PASSWORD ?? "";

  const emailOk = timingSafeEqual(parsed.data.email, expectedEmail);
  const passwordOk = timingSafeEqual(parsed.data.password, expectedPassword);

  if (!emailOk || !passwordOk || expectedPassword.length === 0) {
    registerFailure(rateKey);
    return { error: "Email atau password salah" };
  }

  clearFailures(rateKey);
  await setSessionCookie(parsed.data.email);
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await clearSessionCookie();
  redirect("/admin/login");
}
