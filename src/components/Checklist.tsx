import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, ListChecks, PartyPopper } from "lucide-react";
import { checklist } from "../data";
import { Reveal, SectionHead } from "./ui";
import { cn } from "../utils/cn";

export default function Checklist() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const count = Object.values(done).filter(Boolean).length;
  const pct = Math.round((count / checklist.length) * 100);

  return (
    <section id="checklist" className="relative py-24 md:py-32">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-white/8 to-transparent" aria-hidden />
      <div className="mx-auto max-w-4xl px-5">
        <SectionHead
          index="۰۴"
          kicker="قبل از اینکه بری سراغ کانفیگ‌ها"
          title={
            <>
              چک‌لیست پنج‌تاییِ نصب سالم{" "}
              <span className="bg-gradient-to-l from-mint to-cf-2 bg-clip-text text-transparent">— تیکشان بزن</span>
            </>
          }
          desc="هر پنج مورد از پنل/داشبورد قابل بررسی‌اند. مورد دوم را جدی بگیر چون رایج‌ترین خطای آموزش‌های قدیمی است."
        />

        {/* progress */}
        <Reveal>
          <div className="mb-8 rounded-2xl glass px-5 py-4">
            <div className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-2 text-sm font-bold text-white">
                <ListChecks className="size-4.5 text-cf" />
                پیشرفت تو
              </span>
              <span className="font-mono text-sm font-bold text-cf-2" dir="ltr">
                {count} / {checklist.length}
              </span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/6">
              <motion.div
                className="h-full rounded-full bg-gradient-to-l from-cf to-mint"
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </div>
            {count === checklist.length && (
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 flex items-center gap-2 text-sm font-bold text-mint"
              >
                <PartyPopper className="size-4.5" />
                عالی — نصب تو حالا هم شباهت به خطای اولیه ندارد، هم برای آپدیت‌های بعدی دردسر نخواهد داشت.
              </motion.p>
            )}
          </div>
        </Reveal>

        <div className="space-y-3.5">
          {checklist.map((item, i) => {
            const active = !!done[item.id];
            return (
              <Reveal key={item.id} delay={i * 0.06}>
                <button
                  type="button"
                  onClick={() => setDone((d) => ({ ...d, [item.id]: !d[item.id] }))}
                  className={cn(
                    "card-hover w-full cursor-pointer rounded-2xl border p-5 text-right transition-colors duration-300 md:p-6",
                    item.warn
                      ? active
                        ? "glass"
                        : "border-rose/30 bg-rose/7"
                      : "glass",
                  )}
                >
                  <span className="flex items-start gap-4">
                    <span
                      className={cn(
                        "relative mt-1 grid size-6 shrink-0 place-items-center rounded-lg border-2 transition-all duration-300",
                        active
                          ? "border-mint bg-mint text-ink shadow-[0_0_18px_-4px_rgba(74,222,128,0.9)]"
                          : item.warn
                            ? "border-rose/60"
                            : "border-white/25",
                      )}
                      aria-hidden
                    >
                      <motion.svg
                        viewBox="0 0 24 24"
                        className="size-4"
                        initial={false}
                        animate={{ opacity: active ? 1 : 0, scale: active ? 1 : 0.4 }}
                        transition={{ duration: 0.25 }}
                      >
                        <path d="M4 12.5l5 5L20 6.5" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
                      </motion.svg>
                    </span>
                    <span className="min-w-0">
                      <span className={cn("flex flex-wrap items-center gap-2 font-extrabold", active ? "text-mint" : "text-white")}>
                        {item.title}
                        {item.warn && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-rose/15 px-2 py-0.5 text-[10px] font-bold text-rose">
                            <AlertTriangle className="size-3" />
                            تله‌ی آموزش‌های قدیمی
                          </span>
                        )}
                      </span>
                      <span
                        className={cn(
                          "mt-1.5 block text-sm leading-7.5 transition-colors duration-300",
                          active ? "text-fog/50 line-through decoration-white/20" : "text-fog",
                        )}
                      >
                        {item.desc}
                      </span>
                    </span>
                  </span>
                </button>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
