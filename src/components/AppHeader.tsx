"use client";

import Image from "next/image";
import { APP_NAME, ONE_LINER, APP_VERSION } from "@/lib/appMeta";

export default function AppHeader() {
  return (
    <header className="border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4 flex items-start justify-between">
        {/* Left: Title + One-liner */}
        <div className="flex min-w-0 flex-col">
          <div className="flex items-center gap-2">
            <h1 className="text-[22px] font-semibold tracking-tight text-slate-900">
              {APP_NAME}
            </h1>
            <span className="inline-flex items-center rounded-full border border-slate-200 px-2 py-0.5 text-xs font-medium text-slate-600">
              {APP_VERSION}
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-600">
            {ONE_LINER}
          </p>
        </div>

        {/* Right: Brand mark */}
        <div className="shrink-0 pt-1">
          <Image
            src="/kolabs-logo-black.png"
            alt="KOLABS.DESIGN"
            width={138}
            height={28}
            priority
            className="opacity-90"
          />
        </div>
      </div>
    </header>
  );
}
