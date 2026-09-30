import {
  CheckCircle2,
  Circle,
  Globe2,
  Loader2,
  Plus,
  RefreshCw,
  ShieldCheck,
  Trash2,
  TriangleAlert,
  XCircle,
} from "lucide-react";
import { DEFAULT_PROXY_URL } from "../lib/presets";
import { SourceState } from "../types";
import { Reveal, SectionHead } from "./ui";
import { cn } from "../utils/cn";
import { useState } from "react";

function StatusPill({ s }: { s: SourceState }) {
  if (s.status === "loading")
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#8ab4f8]/10 px-2.5 py-1 text-[11px] font-bold text-[#8ab4f8]">
        <Loader2 className="size-3.5 animate-spin" />
        در حال دریافت…
      </span>
    );
  if (s.status === "ok")
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-mint/10 px-2.5 py-1 text-[11px] font-bold text-mint">
        <CheckCircle2 className="size-3.5" />
        {s.count.toLocaleString("fa-IR")} کانفیگ
      </span>
    );
  if (s.status === "fail")
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-rose/10 px-2.5 py-1 text-[11px] font-bold text-rose">
        <XCircle className="size-3.5" />
        ناموفق
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1 text-[11px] font-bold text-fog/70">
      <Circle className="size-3.5" />
      در انتظار
    </span>
  );
}

export default function Sources({
  sources,
  setSources,
  busy,
  onFetchAll,
  onFetchOne,
  onAdd,
  proxyUrl,
  setProxyUrl,
}: {
  sources: SourceState[];
  setSources: (fn: (s: SourceState[]) => SourceState[]) => void;
  busy: boolean;
  onFetchAll: () => void;
  onFetchOne: (id: string, useProxy: boolean) => void;
  onAdd: (name: string, url: string) => void;
  proxyUrl: string;
  setProxyUrl: (v: string) => void;
}) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [addOpen, setAddOpen] = useState(false);

  const enabledCount = sources.filter((s) => s.enabled).length;
  const totalFetched = sources.reduce((a, s) => a + s.count, 0);

  return (
    <section id="sources" className="relative py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHead
          index="۰۱"
          kicker="مرحله‌ی اول — جمع‌آوری"
          title={
            <>
              منابع سابسکریپشن{" "}
              <span className="bg-gradient-to-l from-cf to-cf-2 bg-clip-text text-transparent">+ ساب خودِ BPB‌ات</span>
            </>
          }
          desc="همان سابِ رمزدارِ پنل BPB خودت (مثل /sub) را هم می‌توانی اینجا اضافه کنی تا کنار منابع عمومی تجمیع شود. فچ از مخازن گیت‌هاب معمولاً مستقیم انجام می‌شود؛ اگر جایی خطای CORS گرفتی، با پروکسی دوباره بزن."
        />

        <Reveal>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 text-xs text-fog">
              <span className="rounded-lg border border-white/10 bg-white/4 px-3 py-1.5">
                <span className="font-bold text-white">{enabledCount.toLocaleString("fa-IR")}</span> منبع فعال
              </span>
              <span className="rounded-lg border border-white/10 bg-white/4 px-3 py-1.5">
                <span className="font-bold text-mint">{totalFetched.toLocaleString("fa-IR")}</span> کانفیگ تاکنون
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setAddOpen((v) => !v)}
                className="inline-flex items-center gap-2 rounded-xl border border-white/12 bg-white/4 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:border-cf/40 hover:bg-cf/10"
              >
                <Plus className="size-4" />
                منبع جدید
              </button>
              <button
                type="button"
                onClick={onFetchAll}
                disabled={busy || enabledCount === 0}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-l from-cf to-cf-2 px-5 py-2.5 text-sm font-extrabold text-ink shadow-[0_12px_32px_-10px_rgba(246,130,31,0.65)] transition-all hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-40"
              >
                {busy ? <Loader2 className="size-4 animate-spin" /> : <Globe2 className="size-4" />}
                {busy ? "در حال جمع‌آوری…" : "جمع‌آوری همه"}
              </button>
            </div>
          </div>
        </Reveal>

        {addOpen && (
          <Reveal className="mb-6">
            <div className="glass rounded-2xl p-5">
              <p className="mb-3 flex items-center gap-2 text-sm font-bold text-white">
                <Globe2 className="size-4 text-cf" />
                افزودن منبع — آدرس لینک ساب (مثلاً ساب BPB خودت)
              </p>
              <div className="grid gap-2.5 md:grid-cols-[180px_1fr_auto]">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="نام (اختیاری)"
                  className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-fog/40 focus:border-cf/50 focus:outline-none"
                />
                <input
                  dir="ltr"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://your-worker.workers.dev/xxxx/sub"
                  className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 font-mono text-left text-[13px] text-white placeholder:text-fog/40 focus:border-cf/50 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (url.trim()) {
                      onAdd(name.trim(), url.trim());
                      setName("");
                      setUrl("");
                      setAddOpen(false);
                    }
                  }}
                  className="rounded-xl bg-white px-5 py-3 text-sm font-extrabold text-ink transition-colors hover:bg-cf"
                >
                  افزودن
                </button>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-fog" dir="rtl">
                <span className="text-fog/70">پروکسی CORS (فقط برای ساب‌هایی که مستقیم باز نمی‌شوند):</span>
                <input
                  dir="ltr"
                  value={proxyUrl}
                  onChange={(e) => setProxyUrl(e.target.value)}
                  placeholder={DEFAULT_PROXY_URL}
                  className="min-w-64 flex-1 rounded-lg border border-white/10 bg-black/30 px-3 py-2 font-mono text-left text-[11px] text-white focus:border-cf/50 focus:outline-none md:flex-none"
                />
              </div>
            </div>
          </Reveal>
        )}

        <div className="grid gap-3.5">
          {sources.map((s, i) => (
            <Reveal key={s.id} delay={i * 0.04}>
              <article
                className={cn(
                  "card-hover rounded-2xl border p-4 transition-colors md:p-5",
                  s.enabled ? "glass" : "border-white/6 bg-white/2 opacity-60",
                )}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3.5">
                    <button
                      type="button"
                      onClick={() => setSources((arr) => arr.map((x) => (x.id === s.id ? { ...x, enabled: !x.enabled } : x)))}
                      aria-label={s.enabled ? "غیرفعال" : "فعال"}
                      className={cn(
                        "relative h-6 w-11 shrink-0 cursor-pointer rounded-full border transition-colors duration-300",
                        s.enabled ? "border-mint/40 bg-mint/25" : "border-white/15 bg-white/5",
                      )}
                    >
                      <span
                        className={cn(
                          "absolute top-1/2 size-4 -translate-y-1/2 rounded-full transition-all duration-300",
                          s.enabled ? "right-1 bg-mint" : "right-6 bg-fog/50",
                        )}
                      />
                    </button>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="truncate font-extrabold text-white">{s.name}</h3>
                        {s.badge && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-cf/25 bg-cf/10 px-2 py-0.5 text-[10px] font-bold text-cf-2">
                            <ShieldCheck className="size-3" />
                            {s.badge}
                          </span>
                        )}
                        {s.isCustom && (
                          <span className="rounded-full bg-white/8 px-2 py-0.5 text-[10px] font-bold text-fog">سفارشی</span>
                        )}
                      </div>
                      <p className="mt-0.5 max-w-105 truncate font-mono text-[11px] text-fog/60" dir="ltr" title={s.url}>
                        {s.url}
                      </p>
                      {s.note && <p className="mt-1 text-xs leading-5.5 text-fog/80">{s.note}</p>}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {s.rejected > 0 && (
                      <span className="hidden items-center gap-1 rounded-full bg-white/5 px-2 py-1 text-[10px] text-fog/70 sm:inline-flex">
                        <TriangleAlert className="size-3.5" />
                        {s.rejected.toLocaleString("fa-IR")} ناخوانا
                      </span>
                    )}
                    <StatusPill s={s} />
                    <button
                      type="button"
                      onClick={() => onFetchOne(s.id, false)}
                      disabled={busy}
                      className="grid size-9 cursor-pointer place-items-center rounded-xl border border-white/10 bg-white/4 text-fog transition-colors hover:border-cf/40 hover:text-cf disabled:opacity-40"
                      aria-label="دریافت مجدد"
                    >
                      <RefreshCw className={cn("size-4", s.status === "loading" && "animate-spin")} />
                    </button>
                    {s.status === "fail" && (
                      <button
                        type="button"
                        onClick={() => onFetchOne(s.id, true)}
                        disabled={busy}
                        className="rounded-xl border border-rose/30 bg-rose/10 px-3 py-2 text-[11px] font-bold text-rose transition-colors hover:bg-rose/20 disabled:opacity-40"
                      >
                        تلاش با پروکسی
                      </button>
                    )}
                    {s.isCustom && (
                      <button
                        type="button"
                        onClick={() => setSources((arr) => arr.filter((x) => x.id !== s.id))}
                        className="grid size-9 cursor-pointer place-items-center rounded-xl border border-white/10 bg-white/4 text-fog/70 transition-colors hover:border-rose/40 hover:text-rose"
                        aria-label="حذف منبع"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    )}
                  </div>
                </div>
                {s.error && (
                  <p className="mt-2.5 rounded-lg border border-rose/20 bg-rose/8 px-3 py-2 font-mono text-[11px] text-rose" dir="ltr">
                    {s.error}
                  </p>
                )}
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-6 flex flex-wrap items-start gap-2 rounded-2xl border border-white/8 bg-white/3 px-4 py-3.5">
            <TriangleAlert className="mt-0.5 size-4 shrink-0 text-cf-2" />
            <p className="text-xs leading-6.5 text-fog">
              سابِ BPB در حالت عادی پاسخ CORS ندارد؛ پس یا آدرس را مستقیماً در v2rayNG بگذار، یا فیلد بالا را با پروکسی
              <code dir="ltr" className="mx-1 rounded bg-white/8 px-1.5 py-0.5 font-mono text-cf-2">
                allorigins
              </code>
              پر کن و «تلاش با پروکسی» را بزن. می‌توانی از هر پروکسی CORS دلخواه استفاده کنی.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}


