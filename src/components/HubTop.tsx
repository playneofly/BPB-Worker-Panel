import { motion } from "framer-motion";
import { ArrowDown, Boxes, Filter, Radar, Server } from "lucide-react";
import { faNum } from "../lib/core";
import { easeOut } from "./ui";

function AnimatedN({ value, className }: { value: number; className?: string }) {
  return (
    <motion.span
      key={value}
      initial={{ opacity: 0.3, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: easeOut }}
      className={className}
    >
      {faNum(value)}
    </motion.span>
  );
}

export default function HubTop({
  total,
  unique,
  boosted,
  sourcesOk,
}: {
  total: number;
  unique: number;
  boosted: number;
  sourcesOk: number;
}) {
  const stats = [
    { icon: Boxes, label: "کل کانفیگ‌های جمع‌شده", value: total, color: "text-white" },
    { icon: Filter, label: "پس از حذف تکراری", value: unique, color: "text-cf-2" },
    { icon: Radar, label: "ساخته‌شده توسط تقویت‌کننده", value: boosted, color: "text-mint" },
    { icon: Server, label: "منابع موفق", value: sourcesOk, color: "text-[#8ab4f8]" },
  ];
  return (
    <section className="relative overflow-hidden pt-32 pb-14 md:pt-40 md:pb-16">
      <div className="bg-grid absolute inset-0" aria-hidden />
      <div className="absolute -top-24 left-[15%] h-90 w-90 rounded-full bg-cf/14 blur-[130px] animate-float" aria-hidden />
      <div className="absolute top-1/4 -right-24 h-72 w-72 rounded-full bg-mint/8 blur-[120px]" aria-hidden />

      <div className="relative mx-auto max-w-6xl px-5">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: easeOut }}
          className="mb-5 flex flex-wrap items-center gap-2"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-cf/30 bg-cf/10 px-3 py-1.5 text-xs font-bold text-cf">
            <Radar className="size-3.5" />
            بر پایه‌ی BPB Worker Panel
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/4 px-3 py-1.5 text-xs font-bold text-fog">
            کاملاً سمتِ مرورگر — بدون سرور
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.9, delay: 0.3, ease: easeOut }}
          className="max-w-3xl text-4xl leading-[1.28] font-black text-white md:text-[54px] md:leading-[1.2]"
        >
          کارخانه‌ی کانفیگ؛
          <br />
          <span className="bg-gradient-to-l from-cf via-cf-2 to-mint bg-clip-text text-transparent">
            از یک الگو تا ۱٬۰۰۰ کانفیگ آماده‌ی ساب
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.5, ease: easeOut }}
          className="mt-5 max-w-2xl text-base leading-8 text-fog md:text-lg md:leading-9"
        >
          سابسکریپشن‌های عمومی را جمع می‌کند، کانفیگِ خودِ ورکر BPB تو را روی ده‌ها{" "}
          <span className="font-bold text-white">IP تمیز کلادفلر</span> و پورت‌های مختلف
          <span className="font-bold text-white"> ضرب می‌کند</span>، تکراری‌ها را حذف می‌کند و خروجیِ
          آماده‌ی v2rayNG / Clash / sing-box تحویل می‌دهد.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.65, ease: easeOut }}
          className="mt-8 flex flex-wrap items-center gap-3"
        >
          <a
            href="#sources"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-l from-cf to-cf-2 px-6 py-3.5 text-sm font-extrabold text-ink shadow-[0_16px_40px_-12px_rgba(246,130,31,0.7)] transition-transform duration-300 hover:-translate-y-0.5"
          >
            <ArrowDown className="size-4.5" />
            شروع جمع‌آوری
          </a>
          <a
            href="#boost"
            className="inline-flex items-center gap-2 rounded-xl border border-white/12 bg-white/4 px-6 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:border-mint/45 hover:bg-mint/10"
          >
            <Radar className="size-4.5" />
            برو به تقویت‌کننده
          </a>
        </motion.div>

        {/* live counters */}
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.8, ease: easeOut }}
          className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4"
        >
          {stats.map((s) => (
            <div key={s.label} className="glass rounded-2xl px-4 py-4 md:px-5">
              <div className="flex items-center gap-2 text-[11px] font-bold text-fog">
                <s.icon className="size-4 shrink-0 text-cf-2/80" />
                {s.label}
              </div>
              <div className="mt-2">
                <AnimatedN value={s.value} className={`text-3xl font-black md:text-4xl ${s.color}`} />
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
