import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ClipboardPaste,
  Eye,
  EyeOff,
  Info,
  KeyRound,
  Radar,
  ScanLine,
  Sparkles,
  TriangleAlert,
} from "lucide-react";
import {
  buildVariant,
  ConfigEntry,
  faNum,
  ParsedTemplate,
  parseTemplate,
} from "../lib/core";
import { DEFAULT_CDN_DOMAINS, DEFAULT_CLEAN_IPS, HTTP_PORTS, TLS_PORTS } from "../lib/presets";
import { Reveal, SectionHead, easeOut } from "./ui";
import { cn } from "../utils/cn";

function maskUid(uid: string) {
  if (uid.length <= 8) return "••••••••";
  return `${uid.slice(0, 6)}•••${uid.slice(-4)}`;
}

function useLS(key: string, initial: string): [string, (v: string) => void] {
  const [v, setV] = useState(() => {
    try {
      return localStorage.getItem(key) ?? initial;
    } catch {
      return initial;
    }
  });
  const set = (val: string) => {
    setV(val);
    try {
      localStorage.setItem(key, val);
    } catch {
      /* */
    }
  };
  return [v, set];
}

export default function Multiplier({ onGenerated }: { onGenerated: (entries: ConfigEntry[]) => void }) {
  const [templatesText, setTemplatesText] = useLS("bpb-mega-templates", "");
  const [ipPoolText, setIpPoolText] = useLS("bpb-mega-ips", DEFAULT_CLEAN_IPS);
  const [cdnText, setCdnText] = useLS("bpb-mega-cdn", DEFAULT_CDN_DOMAINS);
  const [useDomains, setUseDomains] = useState(false);
  const [ports, setPorts] = useState<Record<number, boolean>>(() =>
    Object.fromEntries([...TLS_PORTS, ...HTTP_PORTS].map((p) => [p.p, p.on])),
  );
  const [target, setTarget] = useState(1000);
  const [showUid, setShowUid] = useState(false);

  const templates = useMemo(
    () =>
      templatesText
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(Boolean)
        .map(parseTemplate)
        .filter((t): t is ParsedTemplate => t !== null),
    [templatesText],
  );

  const pool = useMemo(
    () =>
      (useDomains ? `${ipPoolText}\n${cdnText}` : ipPoolText)
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter((l) => l && !l.startsWith("#")),
    [ipPoolText, cdnText, useDomains],
  );

  const activePorts = Object.entries(ports)
    .filter(([, v]) => v)
    .map(([k]) => Number(k));

  const potential = templates.length * pool.length * Math.max(activePorts.length, 0);
  const effective = Math.min(target, potential);

  const generate = () => {
    if (!templates.length || !pool.length || !activePorts.length) return;
    const out: ConfigEntry[] = [];
    let i = 0;
    outer: for (const addr of pool) {
      for (const port of activePorts) {
        const t = templates[i % templates.length];
        i++;
        const name = `BPB × ${String(out.length + 1).padStart(4, "0")} · ${addr}:${port}`;
        const raw = buildVariant(t, addr, port, name);
        out.push({
          id: raw,
          proto: t.proto,
          raw,
          name,
          addr,
          port,
          uid: t.uid,
          params: { ...t.params },
          source: "boost",
          boosted: true,
        });
        if (out.length >= effective) break outer;
      }
    }
    onGenerated(out);
  };

  const t0 = templates[0];

  return (
    <section id="boost" className="relative py-20 md:py-24">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-white/8 to-transparent" aria-hidden />
      <div className="absolute top-32 left-0 h-72 w-72 rounded-full bg-mint/7 blur-[130px]" aria-hidden />
      <div className="mx-auto max-w-6xl px-5">
        <SectionHead
          index="۰۲"
          kicker="مرحله‌ی دوم — ضرب‌کننده"
          title={
            <>
              تقویت‌کننده: از{" "}
              <span className="bg-gradient-to-l from-mint to-cf-2 bg-clip-text text-transparent">۱ کانفیگ</span> به{" "}
              <span className="bg-gradient-to-l from-cf-2 to-mint bg-clip-text text-transparent">۱٬۰۰۰ کانفیگ</span>
            </>
          }
          desc="از پنل BPB خودت یک کانفیگ VLESS یا Trojan را کپی کن و در باکس الگو بگذار. تقویت‌کننده همان UUID و همان Host/SNI ورکر تو را نگه می‌دارد و فقط آدرس فیزیکی اتصال را بین IPهای تمیز و پورت‌های کلودفلر پخش می‌کند — دقیقاً همان کاری که فهرست «IP تمیز / آدرس CDN» در خودِ پنل BPB انجام می‌دهد، با حجم خیلی بیشتر."
        />

        <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr]">
          {/* input side */}
          <div className="space-y-5">
            <Reveal>
              <div className="glass rounded-2xl p-5 md:p-6">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <h3 className="flex items-center gap-2 text-sm font-extrabold text-white md:text-base">
                    <ClipboardPaste className="size-4.5 text-cf" />
                    الگو — هر خط یک کانفیگ VLESS/Trojan از پنل خودِ تو
                  </h3>
                  <span className="rounded-full bg-white/6 px-2.5 py-1 text-[10px] font-bold text-fog">
                    {faNum(templates.length)} الگوی معتبر
                  </span>
                </div>
                <textarea
                  dir="ltr"
                  value={templatesText}
                  onChange={(e) => setTemplatesText(e.target.value)}
                  rows={3}
                  spellCheck={false}
                  placeholder={"vless://uuid@worker-name.workers.dev:443?security=tls&sni=...&type=ws&path=...&#name\ntrojan://pass@worker-name.workers.dev:443?sni=..."}
                  className="w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 font-mono text-left text-[11.5px] leading-6 text-white placeholder:text-fog/35 focus:border-cf/50 focus:outline-none"
                />

                {t0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: easeOut }}
                    className="mt-4 rounded-xl border border-mint/20 bg-mint/7 p-4"
                  >
                    <p className="mb-2.5 flex items-center gap-2 text-xs font-bold text-mint">
                      <Sparkles className="size-4" />
                      الگوی اول شناسایی شد:
                    </p>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[11.5px] sm:grid-cols-3" dir="ltr">
                      <div>
                        <span className="block text-fog/60">proto</span>
                        <span className="font-mono font-bold text-white">{t0.proto}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="flex items-center gap-1 text-fog/60">
                          id / password
                          <button
                            type="button"
                            onClick={() => setShowUid((v) => !v)}
                            className="cursor-pointer text-fog/60 hover:text-white"
                            aria-label="نمایش"
                          >
                            {showUid ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                          </button>
                        </span>
                        <span className="break-all font-mono font-bold text-cf-2">
                          {showUid ? t0.uid : maskUid(t0.uid)}
                        </span>
                      </div>
                      <div>
                        <span className="block text-fog/60">type</span>
                        <span className="font-mono font-bold text-white">{t0.params.type ?? "tcp"}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="block text-fog/60">sni / host</span>
                        <span className="break-all font-mono font-bold text-white">
                          {t0.params.sni ?? t0.params.host ?? "—"}
                        </span>
                      </div>
                      <div className="col-span-3">
                        <span className="block text-fog/60">path</span>
                        <span className="break-all font-mono font-bold text-white">{t0.params.path ?? "—"}</span>
                      </div>
                    </div>
                    {!t0.params.sni && !t0.params.host && (
                      <p className="mt-2.5 flex items-start gap-1.5 text-[11px] leading-5.5 text-rose">
                        <TriangleAlert className="mt-0.5 size-3.5 shrink-0" />
                        الگوی تو sni یا host ندارد — بدون آنها اتصال از مسیر IP اجازه‌ی عبور نمی‌گیرد (معمولاً باید دامنه‌ی ورکر خودت باشد).
                      </p>
                    )}
                  </motion.div>
                )}
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="glass rounded-2xl p-5 md:p-6">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <h3 className="flex items-center gap-2 text-sm font-extrabold text-white md:text-base">
                    <ScanLine className="size-4.5 text-mint" />
                    حوض IP تمیز کلودفلر
                    <span className="rounded-full bg-mint/10 px-2.5 py-1 text-[10px] font-bold text-mint" dir="ltr">
                      {faNum(ipPoolText.split(/\r?\n/).filter((l) => l.trim() && !l.startsWith("#")).length)} آی‌پی
                    </span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIpPoolText(DEFAULT_CLEAN_IPS)}
                    className="text-[11px] font-bold text-fog transition-colors hover:text-cf-2"
                  >
                    بازگردانی پیش‌فرض
                  </button>
                </div>
                <textarea
                  dir="ltr"
                  value={ipPoolText}
                  onChange={(e) => setIpPoolText(e.target.value)}
                  rows={4}
                  spellCheck={false}
                  className="w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 font-mono text-left text-[11.5px] leading-6 text-white focus:border-mint/40 focus:outline-none"
                />
                <p className="mt-2 text-[11px] leading-5.5 text-fog/70">
                  این فهرست فقط نقطه‌ی شروع است؛ هر هفته با اسکنر طرف‌حسابت یا ابزار «اسکنر IP تمیز» داخل پنل BPB به‌روزش کن.
                </p>
              </div>
            </Reveal>
          </div>

          {/* config side */}
          <div className="space-y-5">
            <Reveal delay={0.05}>
              <div className="glass rounded-2xl p-5 md:p-6">
                <h3 className="mb-4 flex items-center gap-2 text-sm font-extrabold text-white md:text-base">
                  <KeyRound className="size-4.5 text-cf-2" />
                  پورت‌ها و تنظیمات تولید
                </h3>

                <p className="mb-2 text-[11px] font-bold text-fog">پورت‌های TLS (توصیه‌شده)</p>
                <div className="mb-4 flex flex-wrap gap-2" dir="ltr">
                  {TLS_PORTS.map((o) => (
                    <button
                      key={o.p}
                      type="button"
                      onClick={() => setPorts((p) => ({ ...p, [o.p]: !p[o.p] }))}
                      className={cn(
                        "cursor-pointer rounded-lg border px-3 py-1.5 font-mono text-[12px] font-bold transition-all",
                        ports[o.p]
                          ? "border-cf/50 bg-cf/15 text-cf"
                          : "border-white/10 bg-white/4 text-fog/60 hover:text-white",
                      )}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
                <p className="mb-2 text-[11px] font-bold text-fog">پورت‌های HTTP (بدون TLS)</p>
                <div className="mb-5 flex flex-wrap gap-2" dir="ltr">
                  {HTTP_PORTS.map((o) => (
                    <button
                      key={o.p}
                      type="button"
                      onClick={() => setPorts((p) => ({ ...p, [o.p]: !p[o.p] }))}
                      className={cn(
                        "cursor-pointer rounded-lg border px-3 py-1.5 font-mono text-[12px] font-bold transition-all",
                        ports[o.p]
                          ? "border-[#8ab4f8]/50 bg-[#8ab4f8]/15 text-[#8ab4f8]"
                          : "border-white/10 bg-white/4 text-fog/60 hover:text-white",
                      )}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>

                <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/4 px-4 py-3">
                  <span className="text-[12px] font-bold text-white">۲۵ دامنه‌ی CDN معروف را هم به حوض اضافه کن</span>
                  <button
                    type="button"
                    onClick={() => setUseDomains((v) => !v)}
                    className={cn(
                      "relative h-6 w-11 shrink-0 cursor-pointer rounded-full border transition-colors",
                      useDomains ? "border-mint/40 bg-mint/25" : "border-white/15 bg-white/5",
                    )}
                  >
                    <span
                      className={cn(
                        "absolute top-1/2 size-4 -translate-y-1/2 rounded-full transition-all",
                        useDomains ? "right-1 bg-mint" : "right-6 bg-fog/50",
                      )}
                    />
                  </button>
                </label>

                {useDomains && (
                  <textarea
                    dir="ltr"
                    value={cdnText}
                    onChange={(e) => setCdnText(e.target.value)}
                    rows={3}
                    spellCheck={false}
                    className="mt-3 w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 font-mono text-left text-[11.5px] leading-6 text-white focus:border-cf/50 focus:outline-none"
                  />
                )}

                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between text-[12px] font-bold">
                    <span className="text-fog">تعداد هدف</span>
                    <span className="font-mono text-cf-2" dir="ltr">{faNum(target)}</span>
                  </div>
                  <input
                    type="range"
                    dir="ltr"
                    min={50}
                    max={3000}
                    step={10}
                    value={target}
                    onChange={(e) => setTarget(Number(e.target.value))}
                    className="w-full accent-[#f6821f]"
                  />
                  <div className="mt-1 flex justify-between font-mono text-[10px] text-fog/50" dir="ltr">
                    <span>50</span>
                    <span>3000</span>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.12}>
              <div className="rounded-2xl border border-cf/25 bg-gradient-to-b from-cf/12 to-transparent p-5 md:p-6">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="font-mono text-2xl font-black text-white" dir="ltr">{faNum(templates.length)}</p>
                    <p className="mt-1 text-[10.5px] font-bold text-fog">الگو</p>
                  </div>
                  <div>
                    <p className="font-mono text-2xl font-black text-white" dir="ltr">{faNum(pool.length)}</p>
                    <p className="mt-1 text-[10.5px] font-bold text-fog">آدرس جایگزین</p>
                  </div>
                  <div>
                    <p className="font-mono text-2xl font-black text-white" dir="ltr">{faNum(activePorts.length)}</p>
                    <p className="mt-1 text-[10.5px] font-bold text-fog">پورت</p>
                  </div>
                </div>
                <div className="my-4 h-px bg-gradient-to-l from-transparent via-white/12 to-transparent" />
                <p className="text-center text-xs leading-6 text-fog">
                  ظرفیت ممکن: <span className="font-mono font-bold text-cf-2">{faNum(potential)}</span> — خروجی فعلی:{" "}
                  <span className="font-mono font-bold text-mint">{faNum(effective)}</span> کانفیگ
                </p>
                <button
                  type="button"
                  onClick={generate}
                  disabled={!templates.length || !pool.length || !activePorts.length || effective <= 0}
                  className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-cf to-cf-2 px-6 py-4 text-sm font-black text-ink shadow-[0_16px_44px_-12px_rgba(246,130,31,0.75)] transition-all duration-300 hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-35"
                >
                  <Radar className="size-5" />
                  تولید {faNum(effective)} کانفیگ
                </button>
              </div>
            </Reveal>

            <Reveal delay={0.18}>
              <div className="rounded-2xl border border-white/8 bg-white/3 p-5">
                <p className="flex items-start gap-2 text-xs leading-6.5 text-fog">
                  <Info className="mt-0.5 size-4 shrink-0 text-cf-2" />
                  نکته‌ی صادقانه: همه‌ی کانفیگ‌های تقویت‌شده به همان یک ورکر BPB خودِ تو ختم می‌شوند؛ IPهای تمیز فقط
                  راه‌های دیگرِ رسیدن به همان سرورند، نه سرورهای جدا. یعنی اگر یکی روی اپراتورت پاسخ نداد، ۹۹۹ تای
                  دیگر را تست می‌کنی — دقیقاً کاری که لازم داری. بعد از ایمپورت، در کلاینت «تست پینگ واقعی» بگیر و بهترین را نگه دار.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
