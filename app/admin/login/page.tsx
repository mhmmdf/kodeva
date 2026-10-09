import { redirect } from "next/navigation";

import { LoginForm } from "@/components/admin/LoginForm";
import { getSession } from "@/lib/session";

export const instant = false;

export default async function AdminLoginPage() {
  const session = await getSession();
  if (session) {
    redirect("/admin");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">Kodeva CMS</h1>
        <p className="mt-1 text-sm text-slate-500">
          Masuk untuk mengelola konten website campaign.
        </p>
        <LoginForm />
      </div>
    </div>
  );
}
