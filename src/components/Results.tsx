import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  ClipboardCopy,
  Download,
  FileDown,
  Gauge,
  Link2,
  PackageCheck,
  RotateCcw,
  Search,
  Shuffle,
  Trash2,
} from "lucide-react";
import { b64encode, ConfigEntry, downloadText, faNum, PROTO_COLORS, shuffle } from "../lib/core";
import { canHttpProbe, probeBadge, ProbeResult, ScanStats, scanAddrs } from "../lib/probe";
import { CopyButton, Reveal, SectionHead, easeOut } from "./ui";
import { cn } from "../utils/cn";

const PAGE = 120;
const SCAN_CAP = 350;

export default function Results({ entries, onClear }: { entries: ConfigEntry[]; onClear: () => void }) {
  const [protoFilter, setProtoFilter] = useState<string>("all");
  const [q, setQ] = useState("");
  const [shuffled, setShuffled] = useState(false);
  const [limit, setLimit] = useState(PAGE);
  const [copiedAll, setCopiedAll] = useState(false);

  // live test state
  const [scan, setScan] = useState<Record<string, ProbeResult>>({});
  const [stats, setStats] = useState<ScanStats | null>(null);
  const [scanning, setScanning] = useState(false);
  const [onlyAlive, setOnlyAlive] = useState(false);
  const [fastSort, setFastSort] = useState(false);

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
    if (onlyAlive && Object.keys(scan).length) arr = arr.filter((e) => scan[e.addr]?.state === "ok");
    if (fastSort && Object.keys(scan).length)
      arr = [...arr].sort((a, b) => {
        const ma = scan[a.addr]?.state === "ok" ? scan[a.addr].ms ?? Infinity : Infinity;
        const mb = scan[b.addr]?.state === "ok" ? scan[b.addr].ms ?? Infinity : Infinity;
        return ma - mb;
      });
    else if (shuffled) arr = shuffle(arr);
    return arr;
  }, [entries, protoFilter, q, shuffled, onlyAlive, fastSort, scan]);

  const exported = useMemo(() => filtered.map((e) => e.raw).join("\n"), [filtered]);

  const aliveCount = useMemo(() => {
    if (!Object.keys(scan).length) return 0;
    return entries.filter((e) => scan[e.addr]?.state === "ok").length;
  }, [entries, scan]);

  const startScan = async () => {
    const uniq = [...new Set(entries.map((e) => e.addr).filter((a) => !!a))].slice(0, SCAN_CAP);
    if (!uniq.length) return;
    setScanning(true);
    setScan({});
    setStats({ total: uniq.length, done: 0, ok: 0 });
    await scanAddrs(uniq, 3200, (r, st) => {
      setScan((m) => ({ ...m, [r.addr]: r }));
      setStats(st);
    });
    setScanning(false);
  };

  if (!entries.length)
    return (
      <section id="results" className="relative py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal>
            <div className="rounded-3xl border border-dashed border-white/12 bg-white/2 p-10 text-center md:p-16">
              <PackageCheck className="mx-auto size-10 text-fog/40" />
              <h3 className="mt-4 text-xl font-black text-white md:text-2xl">هنوز کانفیگی جمع نشده</h3>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-7.5 text-fog">
                در بخش ۱ «جمع‌آوری همه» را بزن و در بخش ۲ کانفیگ‌های تقویت‌شده بساز. بعد اینجا «تست واقعی» را بزن تا
                زنده‌ها از مرده‌ها جدا شوند.
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
          kicker="مرحله‌ی سوم — زنده‌ها را پیدا کن"
          title={
            <>
              <span className="bg-gradient-to-l from-mint to-cf-2 bg-clip-text text-transparent">تست واقعی</span> از روی
              شبکه‌ی خودِ تو
            </>
          }
          desc={
            <>
              دکمه‌ی «تست واقعی» برای هر آدرسِ یکتا یک اتصال واقعی از مرورگر خودِ تو باز می‌کند و زمان پاسخ را اندازه
              می‌گیرد — آنچه «پینگ» یعنی همین است. کانفیگ‌های دامنه‌دار روی هاست HTTPS هم تست می‌شوند؛ کانفیگ‌های
              IP-دار فقط وقتی که سایت محلی روی http:// اجرا شده باشد (راهنمایش پایین‌تر). در نهایت «فقط زنده‌ها» را
              بزن و صدتای سالم را خروجی بگیر.
            </>
          }
        />

        {/* live test panel */}
        <Reveal>
          <div className="mb-6 rounded-2xl border border-mint/20 bg-gradient-to-b from-mint/8 to-transparent p-4 md:p-5">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={startScan}
                disabled={scanning}
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-l from-mint to-[#34d399] px-5 py-3 text-sm font-black text-ink shadow-[0_14px_36px_-12px_rgba(74,222,128,0.7)] transition-all hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-40"
              >
                <Activity className={cn("size-4.5", scanning && "animate-pulse-soft")} />
                {scanning ? "در حال تست…" : Object.keys(scan).length ? "تست مجدد" : "تست واقعی آدرس‌ها"}
              </button>

              {stats && (
                <>
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <span className="rounded-lg bg-mint/15 px-2.5 py-1.5 text-mint">
                      <Gauge className="me-1 inline size-3.5" />
                      {faNum(stats.ok)} پاسخ‌داد از {faNum(stats.done)} / {faNum(stats.total)} آدرس
                    </span>
                  </div>
                  <div className="h-2 w-40 overflow-hidden rounded-full bg-white/8 md:w-56">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-l from-mint to-cf"
                      animate={{ width: `${(stats.done / Math.max(stats.total, 1)) * 100}%` }}
                      transition={{ duration: 0.25 }}
                    />
                  </div>
                  <span className="text-xs text-fog">
                    {faNum(aliveCount)} کانفیگ زنده در لیست
                  </span>
                </>
              )}

              <div className="me-auto" />

              <button
                type="button"
                onClick={() => setOnlyAlive((v) => !v)}
                disabled={!Object.keys(scan).length}
                className={cn(
                  "cursor-pointer rounded-xl border px-3.5 py-2.5 text-xs font-bold transition-all disabled:opacity-35",
                  onlyAlive ? "border-mint/45 bg-mint/12 text-mint" : "border-white/10 bg-white/4 text-fog hover:text-white",
                )}
              >
                فقط زنده‌ها
              </button>
              <button
                type="button"
                onClick={() => setFastSort((v) => !v)}
                disabled={!Object.keys(scan).length}
                className={cn(
                  "cursor-pointer rounded-xl border px-3.5 py-2.5 text-xs font-bold transition-all disabled:opacity-35",
                  fastSort ? "border-cf/50 bg-cf/15 text-cf" : "border-white/10 bg-white/4 text-fog hover:text-white",
                )}
              >
                سریع‌ترین‌ها بالا
              </button>
              <button
                type="button"
                onClick={() => setScan({})}
                disabled={!Object.keys(scan).length}
                title="پاک‌سازی نتایج تست"
                className="grid size-9.5 cursor-pointer place-items-center rounded-xl border border-white/10 bg-white/4 text-fog transition-colors hover:text-rose disabled:opacity-35"
              >
                <RotateCcw className="size-4" />
              </button>
            </div>

            {!canHttpProbe() && (
              <p className="mt-3 text-[11px] leading-5.5 text-fog/80">
                در حال حاضر فقط «آدرس‌های دامنه‌دار» قابل‌تست‌اند. برای اسکن IPهای تمیزِ تقویت‌کننده به‌طور کامل،
                همین فایل را روی سرور محلی http اجرا کن: <code dir="ltr" className="mx-1 rounded bg-black/30 px-1.5 py-0.5 font-mono text-cf-2">npx serve . -l 8080</code> سپس{" "}
                <code dir="ltr" className="rounded bg-black/30 px-1.5 py-0.5 font-mono text-cf-2">http://localhost:8080</code>
              </p>
            )}
          </div>
        </Reveal>

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
              {filtered.slice(0, limit).map((e, i) => {
                const badge = probeBadge(scan[e.addr]);
                return (
                  <motion.div
                    key={e.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.25, delay: Math.min(i * 0.008, 0.3), ease: easeOut }}
                    className={cn(
                      "flex items-center gap-3 border-b border-white/5 px-4 py-2.5 last:border-0",
                      i % 2 === 0 ? "bg-white/1.5" : "",
                      onlyAlive && "bg-mint/3",
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
                    {badge && (
                      <span
                        className="shrink-0 rounded-md px-1.5 py-0.5 font-mono text-[10px] font-bold"
                        style={{ background: badge.color + "1f", color: badge.color }}
                        dir="ltr"
                      >
                        {badge.text}
                      </span>
                    )}
                    <span className="shrink-0 rounded-md bg-white/6 px-1.5 py-0.5 font-mono text-[10px] text-fog/80">
                      {e.proto}
                    </span>
                    <CopyButton value={e.raw} className="size-7" />
                  </motion.div>
                );
              })}
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
              <span className="font-extrabold text-white">تست نهایی حتماً در کلاینت است.</span> مرورگر فقط «پاسخ
              سرور» را می‌سنجد، نه اعتبار UUID و هندشیک VLESS را. بعد از خروجی، در v2rayNG همه را انتخاب کن و «Measure
              Configs Latency» بگیر تا مرده‌های باقی‌مانده هم حذف شوند. برای لینک دائمی، فایل Base64 را روی Gist یا
              Pages بگذار.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
