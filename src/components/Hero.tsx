import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { AlertOctagon, ArrowDown, Languages, ShieldCheck, Timer } from "lucide-react";
import { deployLog, LogTone } from "../data";
import { cn } from "../utils/cn";
import { easeOut } from "./ui";

const toneClass: Record<LogTone, string> = {
  cmd: "text-white font-semibold",
  ok: "text-mint",
  dim: "text-fog/55",
  info: "text-[#8ab4f8]",
  err: "text-rose",
};

function Terminal() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!inView) return;
    if (count < deployLog.length) {
      const t = setTimeout(() => setCount((c) => c + 1), 210);
      return () => clearTimeout(t);
    }
    const finish = setTimeout(() => setDone(true), 350);
    const loop = setTimeout(() => {
      setCount(0);
      setDone(false);
    }, 8000);
    return () => {
      clearTimeout(finish);
      clearTimeout(loop);
    };
  }, [inView, count]);

  return (
    <div ref={ref} dir="ltr" className="relative overflow-hidden rounded-2xl glass-deep text-left shadow-[0_40px_120px_-30px_rgba(0,0,0,0.85)]">
      {/* top glow line */}
      <div className="h-0.5 w-full bg-gradient-to-r from-cf/80 via-cf-2/60 to-transparent" />

      <div className="flex items-center justify-between border-b border-white/6 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-rose/80" />
          <span className="size-2.5 rounded-full bg-cf-2/80" />
          <span className="size-2.5 rounded-full bg-mint/80" />
        </div>
        <span className="font-mono text-[11px] text-fog/70">cloudflare · workers builds · deploy.log</span>
      </div>

      <div className="relative min-h-[340px] px-4 py-4 font-mono text-[12px] leading-[1.9] md:text-[13px]">
        {deployLog.slice(0, count).map((l, i) => (
          <div
            key={i}
            className={cn(
              "whitespace-pre-wrap break-all rounded px-1.5 -mx-1.5",
              toneClass[l.tone],
              l.tone === "err" && "mt-1 bg-rose/10 border-r-2 border-rose animate-shake",
            )}
          >
            {l.text}
          </div>
        ))}
        {!done && count > 0 && <span className="caret inline-block" />}
        {done && <div className="scanline" />}
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-white/6 px-4 py-2.5">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md px-2 py-1 font-mono text-[11px] font-bold transition-colors duration-500",
            done ? "bg-rose/15 text-rose" : "bg-white/5 text-fog/60",
          )}
        >
          <AlertOctagon className="size-3.5" />
          exit code 1
        </span>
        <span className="font-mono text-[11px] text-fog/50">@ bpb-panel@5.1.1</span>
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden pt-36 pb-16 md:pt-44 md:pb-24">
      {/* backdrop */}
      <div className="bg-grid absolute inset-0" aria-hidden />
      <div className="absolute -top-32 right-[12%] h-105 w-105 rounded-full bg-cf/16 blur-[130px] animate-float" aria-hidden />
      <div className="absolute top-1/3 -left-24 h-80 w-80 rounded-full bg-rose/10 blur-[120px]" aria-hidden />
      <div className="absolute bottom-0 left-1/2 h-72 w-140 -translate-x-1/2 rounded-full bg-mint/6 blur-[120px]" aria-hidden />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
        {/* copy */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: easeOut }}
            className="mb-6 inline-flex flex-wrap items-center gap-2"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full border border-rose/30 bg-rose/10 px-3 py-1.5 text-xs font-bold text-rose">
              <AlertOctagon className="size-3.5" />
              خطای دیپلوی روی Workers Builds
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-mint/25 bg-mint/10 px-3 py-1.5 text-xs font-bold text-mint">
              <Timer className="size-3.5" />
              قابل رفع در ۵ دقیقه
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 34, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1, delay: 0.4, ease: easeOut }}
            className="text-4xl leading-[1.3] font-black text-white sm:text-5xl md:text-[56px] md:leading-[1.22]"
          >
            بیلدِ تو موفق بود؛
            <br />
            <span className="bg-gradient-to-l from-cf via-cf-2 to-rose bg-clip-text text-transparent">
              دیپلوی بود که شکست خورد.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.6, ease: easeOut }}
            className="mt-6 max-w-xl text-base leading-8.5 text-fog md:text-lg md:leading-9"
          >
            ارور «فایل استاتیک پیدا نشد» یعنی{" "}
            <code dir="ltr" className="rounded-md bg-white/6 px-1.5 py-0.5 font-mono text-[0.85em] text-cf-2">
              wrangler deploy
            </code>{" "}
            در ریپوی BPB اصلاً نمی‌داند چه چیزی را دیپلوی کند — این ریپو نه کانفیگ wrangler دارد و نه خروجی بیلدش یک سایت استاتیک است. و نکته‌ی مهم‌تر: راهِ درستِ نصب نسخه‌ی ۵ اصلاً گیت‌هاب و Workers Builds نیست.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.75, ease: easeOut }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <a
              href="#solution"
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-l from-cf to-cf-2 px-6 py-3.5 text-sm font-extrabold text-ink shadow-[0_16px_40px_-12px_rgba(246,130,31,0.7)] transition-transform duration-300 hover:-translate-y-0.5"
            >
              <ShieldCheck className="size-4.5" />
              راه‌حل درست (BPB Wizard)
            </a>
            <a
              href="#diagnosis"
              className="inline-flex items-center gap-2 rounded-xl border border-white/12 bg-white/4 px-6 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:border-cf/45 hover:bg-cf/10"
            >
              <ArrowDown className="size-4.5" />
              اول ریشه را نشانم بده
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.95 }}
            className="mt-7 inline-flex max-w-md items-start gap-2 rounded-xl border border-white/8 bg-white/3 px-4 py-3"
          >
            <Languages className="mt-0.5 size-4 shrink-0 text-cf-2" />
            <p className="text-xs leading-6 text-fog">
              <span className="font-bold text-white">ترجمه‌ی خطا:</span> «پوشه‌ای شامل فایل‌های استاتیک مثل
              html و css و js برای این پروژه پیدا نشد.» — یعنی wrangler دنبال یک سایت می‌گشته، نه یک Worker.
            </p>
          </motion.div>
        </div>

        {/* terminal */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.55, ease: easeOut }}
          className="relative"
        >
          <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-cf/12 via-transparent to-rose/10 blur-xl" aria-hidden />
          <Terminal />
        </motion.div>
      </div>
    </section>
  );
}
