import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ClipboardCopy,
  Download,
  FileDown,
  Link2,
  PackageCheck,
  Search,
  Shuffle,
  Trash2,
} from "lucide-react";
import { b64encode, ConfigEntry, downloadText, faNum, PROTO_COLORS, shuffle } from "../lib/core";
import { CopyButton, Reveal, SectionHead, easeOut } from "./ui";
import { cn } from "../utils/cn";

const PAGE = 120;

export default function Results({ entries, onClear }: { entries: ConfigEntry[]; onClear: () => void }) {
  const [protoFilter, setProtoFilter] = useState<string>("all");
  const [q, setQ] = useState("");
  const [shuffled, setShuffled] = useState(false);
  const [limit, setLimit] = useState(PAGE);
  const [copiedAll, setCopiedAll] = useState(false);

  const byProto = useMemo(() => {
    const m = new Map<string, number>();
    for (const e of entries) m.set(e.proto, (m.get(e.proto) ?? 0) + 1);
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  }, [entries]);

  const filtered = useMemo(() => {
    let arr = entries;
    if (protoFilter !== "all") arr = arr.filter((e) => e.proto === protoFilter);
    const s = q.trim().toLowerCase();
    if (s) arr = arr.filter((e) => e.name.toLowerCase().includes(s) || e.addr.toLowerCase().includes(s));
    return shuffled ? shuffle(arr) : arr;
  }, [entries, protoFilter, q, shuffled]);

  const exported = useMemo(() => filtered.map((e) => e.raw).join("\n"), [filtered]);

  if (!entries.length)
    return (
      <section id="results" className="relative py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal>
            <div className="rounded-3xl border border-dashed border-white/12 bg-white/2 p-10 text-center md:p-16">
              <PackageCheck className="mx-auto size-10 text-fog/40" />
              <h3 className="mt-4 text-xl font-black text-white md:text-2xl">لا! بعد هنوز کانفیگی جمع نشده</h3>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-7.5 text-fog">
                در بخش ۱ «جمع‌آوری همه» را بزن تا منابع عمومی بارگذاری شوند، و در بخش ۲ با یک الگو از ورکرِ خودت
                کانفیگ‌های تقویت‌شده بساز. هر دو اینجا جمع و حذف‌تکراری می‌شوند.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    );

  return (
    <section id="results" className="relative py-20 md:py-24">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-white/8 to-transparent" aria-hidden />
      <div className="mx-auto max-w-6xl px-5">
        <SectionHead
          index="۰۳"
          kicker="مرحله‌ی سوم — خروجی"
          title={
            <>
              نتایج:{" "}
              <span className="bg-gradient-to-l from-cf to-mint bg-clip-text text-transparent">{faNum(entries.length)}</span>{" "}
              کانفیگ یکتا
            </>
          }
          desc="همین لیست را کپی یا دانلود کن. اگر می‌خواهی لینک ساب دائمی داشته باشی، فایل را روی Gist یا Cloudflare Pages بگذار و URL‌اش را در کلاینت‌ها به‌کار ببر."
        />

        {/* toolbar */}
        <Reveal>
          <div className="glass rounded-2xl p-4 md:p-5">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setProtoFilter("all")}
                className={cn(
                  "cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-bold transition-all",
                  protoFilter === "all" ? "border-cf/50 bg-cf/15 text-cf" : "border-white/10 bg-white/4 text-fog hover:text-white",
                )}
              >
                همه · {faNum(entries.length)}
              </button>
              {byProto.map(([p, n]) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setProtoFilter(p)}
                  className={cn(
                    "cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-bold transition-all",
                    protoFilter === p ? "border-white/40 bg-white/12 text-white" : "border-white/10 bg-white/4 text-fog hover:text-white",
                  )}
                  style={protoFilter === p ? { borderColor: PROTO_COLORS[p] + "80" } : undefined}
                >
                  <span className="mr-1.5 inline-block size-2 rounded-full align-middle" style={{ background: PROTO_COLORS[p] }} />
                  {p} · {faNum(n)}
                </button>
              ))}
              <div className="me-auto" />
              <div className="relative">
                <Search className="absolute top-1/2 right-3 size-4 -translate-y-1/2 text-fog/50" />
                <input
                  value={q}
                  onChange={(e) => {
                    setQ(e.target.value);
                    setLimit(PAGE);
                  }}
                  placeholder="جست‌وجو در نام / آدرس…"
                  className="w-56 rounded-xl border border-white/10 bg-black/30 py-2.5 pr-9 pl-3 text-xs text-white placeholder:text-fog/40 focus:border-cf/50 focus:outline-none"
                />
              </div>
              <button
                type="button"
                onClick={() => setShuffled((v) => !v)}
                className={cn(
                  "inline-flex cursor-pointer items-center gap-1.5 rounded-xl border px-3.5 py-2.5 text-xs font-bold transition-all",
                  shuffled ? "border-mint/45 bg-mint/12 text-mint" : "border-white/10 bg-white/4 text-fog hover:text-white",
                )}
              >
                <Shuffle className="size-3.5" />
                به‌هم‌ریخته
              </button>
              <button
                type="button"
                onClick={onClear}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-rose/25 bg-rose/8 px-3.5 py-2.5 text-xs font-bold text-rose transition-colors hover:bg-rose/15"
              >
                <Trash2 className="size-3.5" />
                پاک‌سازی همه
              </button>
            </div>

            {/* exports */}
            <div className="mt-4 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
              <button
                type="button"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(b64encode(exported));
                    setCopiedAll(true);
                    setTimeout(() => setCopiedAll(false), 2000);
                  } catch {
                    /* */
                  }
                }}
                className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-cf to-cf-2 px-4 py-3.5 text-xs font-black text-ink transition-all hover:-translate-y-0.5"
              >
                <ClipboardCopy className="size-4.5" />
                {copiedAll ? "کپی شد!" : `کپی ساب Base64 (${faNum(filtered.length)})`}
              </button>
              <button
                type="button"
                onClick={() => downloadText("mega-sub.txt", exported)}
                className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/12 bg-white/5 px-4 py-3.5 text-xs font-extrabold text-white transition-all hover:border-cf/40 hover:bg-cf/10"
              >
                <Download className="size-4.5" />
                دانلود فایل متنی
              </button>
              <button
                type="button"
                onClick={() => downloadText("mega-sub.base64.txt", b64encode(exported))}
                className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/12 bg-white/5 px-4 py-3.5 text-xs font-extrabold text-white transition-all hover:border-mint/40 hover:bg-mint/10"
              >
                <FileDown className="size-4.5" />
                دانلود نسخه‌ی Base64
              </button>
              <button
                type="button"
                onClick={() => {
                  for (const [p] of byProto) {
                    const part = entries.filter((e) => e.proto === p).map((e) => e.raw).join("\n");
                    if (part.trim()) downloadText(`mega-${p}.txt`, part);
                  }
                }}
                className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/12 bg-white/5 px-4 py-3.5 text-xs font-extrabold text-white transition-all hover:border-[#8ab4f8]/40 hover:bg-[#8ab4f8]/10"
              >
                <Link2 className="size-4.5" />
                دانلود تفکیک‌شده
              </button>
            </div>
          </div>
        </Reveal>

        {/* list */}
        <Reveal delay={0.08} className="mt-6">
          <div className="overflow-hidden rounded-2xl glass">
            <AnimatePresence initial={false}>
              {filtered.slice(0, limit).map((e, i) => (
                <motion.div
                  key={e.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.25, delay: Math.min(i * 0.008, 0.3), ease: easeOut }}
                  className={cn(
                    "flex items-center gap-3 border-b border-white/5 px-4 py-2.5 last:border-0",
                    i % 2 === 0 ? "bg-white/1.5" : "",
                  )}
                >
                  <span className="grid size-6 shrink-0 place-items-center">
                    <span className="size-2.5 rounded-full" style={{ background: PROTO_COLORS[e.proto] ?? "#9aa4b8" }} />
                  </span>
                  <span className="min-w-0 flex-1 truncate text-[12.5px] font-bold text-white/90">{e.name}</span>
                  {e.boosted && (
                    <span className="hidden shrink-0 rounded-md bg-mint/12 px-1.5 py-0.5 font-mono text-[9.5px] font-bold text-mint sm:inline">
                      BOOST
                    </span>
                  )}
                  <span className="hidden shrink-0 font-mono text-[11px] text-fog/60 md:inline" dir="ltr">
                    {e.addr || "—"}:{e.port || "—"}
                  </span>
                  <span className="shrink-0 rounded-md bg-white/6 px-1.5 py-0.5 font-mono text-[10px] text-fog/80">
                    {e.proto}
                  </span>
                  <CopyButton value={e.raw} className="size-7" />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          {filtered.length > limit && (
            <button
              type="button"
              onClick={() => setLimit((l) => l + PAGE * 2)}
              className="mt-4 w-full cursor-pointer rounded-xl border border-white/10 bg-white/4 py-3 text-xs font-bold text-fog transition-colors hover:border-cf/40 hover:text-cf"
            >
              نمایش {faNum(Math.min(filtered.length - limit, PAGE * 2))} مورد دیگر (از مجموع {faNum(filtered.length)})
            </button>
          )}
        </Reveal>

        <Reveal delay={0.12} className="mt-6">
          <div className="rounded-2xl border border-[#8ab4f8]/20 bg-[#8ab4f8]/6 px-5 py-4">
            <p className="text-xs leading-6.5 text-fog">
              <span className="font-extrabold text-white">چطور تبدیلش کنم به لینک ساب؟</span> فایل Base64 را روی Gist
              (public یا secret) ذخیره کن و لینک Raw را در v2rayNG به‌عنوان Subscription بده؛ یا فایل را روی
              Cloudflare Pages میزبان کن. پاسخ هر URL‌ای که در Content-Type متن برگردد، کلاینت قاعدتاً می‌خواند.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
