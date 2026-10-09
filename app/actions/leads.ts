"use server";

import { headers } from "next/headers";

import { db } from "@/lib/db/client";
import { leads } from "@/lib/db/schema";
import { leadSchema } from "@/lib/validation";

export type LeadState = {
  status: "idle" | "success" | "error";
  message?: string;
};

const RATE_LIMIT_WINDOW_MS = 10 * 60_000;
const RATE_LIMIT_MAX = 3;
const MIN_FILL_TIME_MS = 3_000;
const MAX_FILL_TIME_MS = 24 * 60 * 60_000;

const rateLimits = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const entry = rateLimits.get(key);
  if (!entry || entry.resetAt < now) {
    rateLimits.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT_MAX;
}

function parseUtm(raw: unknown): Record<string, string> {
  if (typeof raw !== "string" || raw.length === 0) return {};
  try {
    const parsed: unknown = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return Object.fromEntries(
        Object.entries(parsed as Record<string, unknown>)
          .filter(([, value]) => typeof value === "string" && value.length > 0)
          .map(([key, value]) => [key.slice(0, 40), (value as string).slice(0, 200)]),
      );
    }
  } catch {
    // malformed UTM payload is ignored, not an error
  }
  return {};
}

export async function submitLeadAction(
  _prevState: LeadState,
  formData: FormData,
): Promise<LeadState> {
  // 1) Honeypot: humans never fill the hidden "website" field.
  if (String(formData.get("website") ?? "").length > 0) {
    return {
      status: "success",
      message: "Terima kasih! Tim kami akan menghubungi Anda.",
    };
  }

  // 2) Time-trap: forms submitted in under 3 seconds are treated as bots.
  const startedAt = Number(formData.get("startedAt") ?? 0);
  const elapsed = Date.now() - (startedAt || Date.now());
  if (!startedAt || elapsed < MIN_FILL_TIME_MS || elapsed > MAX_FILL_TIME_MS) {
    return {
      status: "error",
      message: "Terlalu cepat mengirim. Coba sekali lagi perlahan.",
    };
  }

  // 3) Rate limit per IP.
  const headerStore = await headers();
  const ip =
    headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return {
      status: "error",
      message: "Terlalu banyak permintaan. Silakan coba lagi nanti.",
    };
  }

  // 4) Input validation.
  const parsed = leadSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    whatsapp: formData.get("whatsapp") ?? "",
    page: String(formData.get("page") ?? "/").slice(0, 300),
    utm: parseUtm(formData.get("utm")),
  });
  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Data tidak valid",
    };
  }

  await db.insert(leads).values({
    name: parsed.data.name,
    email: parsed.data.email.toLowerCase(),
    whatsapp: parsed.data.whatsapp || null,
    page: parsed.data.page,
    utm: parsed.data.utm,
  });

  return {
    status: "success",
    message: "Terima kasih! Tim kami akan menghubungi Anda dalam 1×24 jam.",
  };
}
