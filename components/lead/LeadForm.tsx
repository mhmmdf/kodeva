"use client";

import { useActionState, useEffect, useRef } from "react";

import {
  submitLeadAction,
  type LeadState,
} from "@/app/actions/leads";
import { captureUtm } from "@/lib/tracking/utm";

const idleState: LeadState = { status: "idle" };

const inputClassName =
  "w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200";

export function LeadForm() {
  const startedAtRef = useRef(0);

  const [state, formAction, pending] = useActionState(
    (_prev: LeadState, formData: FormData) => {
      // Tracking metadata is attached at submit time so it is always
      // fresh and no setState is needed inside an effect.
      formData.set("startedAt", String(startedAtRef.current || ""));
      formData.set("page", window.location.pathname);
      formData.set("utm", JSON.stringify(captureUtm()));
      return submitLeadAction(_prev, formData);
    },
    idleState,
  );

  useEffect(() => {
    startedAtRef.current = Date.now();
  }, []);

  if (state.status === "success") {
    return (
      <div
        role="status"
        className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-sm leading-6 text-emerald-800"
      >
        {state.message}
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">
            Nama lengkap
          </span>
          <input
            type="text"
            name="name"
            required
            minLength={2}
            maxLength={80}
            autoComplete="name"
            placeholder="Nama Anda"
            className={inputClassName}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">
            Email
          </span>
          <input
            type="email"
            name="email"
            required
            maxLength={120}
            autoComplete="email"
            placeholder="nama@bisnis.co.id"
            className={inputClassName}
          />
        </label>
      </div>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-slate-700">
          Nomor WhatsApp <span className="font-normal text-slate-400">(opsional)</span>
        </span>
        <input
          type="tel"
          name="whatsapp"
          maxLength={16}
          autoComplete="tel"
          placeholder="0812xxxxxxx"
          className={inputClassName}
        />
      </label>

      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />

      {state.status === "error" ? (
        <p
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
        >
          {state.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Mengirim…" : "Minta Demo Gratis"}
      </button>
      <p className="text-xs leading-5 text-slate-400">
        Data Anda hanya dipakai untuk menghubungi Anda kembali. Tidak ada spam.
      </p>
    </form>
  );
}
