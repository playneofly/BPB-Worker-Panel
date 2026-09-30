import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, MessageCircleQuestion } from "lucide-react";
import { faqs } from "../data";
import { CodeBlock, Reveal, SectionHead, easeOut } from "./ui";
import { cn } from "../utils/cn";

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-24 md:py-32">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-white/8 to-transparent" aria-hidden />
      <div className="mx-auto max-w-4xl px-5">
        <SectionHead
          index="۰۵"
          kicker="پرسش‌هایی که قطعاً داری"
          title={
            <>
              سوال‌ها، جواب‌های{" "}
              <span className="bg-gradient-to-l from-cf to-cf-2 bg-clip-text text-transparent">مستقیم</span>
            </>
          }
        />

        <div className="space-y-3.5">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={i} delay={i * 0.05}>
                <article
                  className={cn(
                    "overflow-hidden rounded-2xl border transition-colors duration-400",
                    isOpen ? "border-cf/30 bg-gradient-to-b from-cf/8 to-transparent" : "glass",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full cursor-pointer items-center justify-between gap-4 p-5 text-right md:p-6"
                    aria-expanded={isOpen}
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className={cn(
                          "grid size-9 shrink-0 place-items-center rounded-xl border transition-colors duration-300",
                          isOpen ? "border-cf/40 bg-cf/15 text-cf" : "border-white/10 bg-white/4 text-fog",
                        )}
                      >
                        <MessageCircleQuestion className="size-4.5" />
                      </span>
                      <span className="text-[15px] font-extrabold text-white md:text-base">{f.q}</span>
                    </span>
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.35, ease: easeOut }}
                      className={cn("shrink-0", isOpen ? "text-cf" : "text-fog")}
                    >
                      <ChevronDown className="size-5" />
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.45, ease: easeOut }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-3 px-5 pb-6 md:px-6">
                          {f.a.map((p, j) => (
                            <p key={j} className="text-sm leading-7.5 text-fog md:leading-8">
                              {p}
                            </p>
                          ))}
                          {f.code && (
                            <CodeBlock
                              title={f.code.startsWith("export") ? "شرط گارد نسخه‌ی ۵" : "دستور"}
                              code={f.code}
                              accent={f.code.startsWith("export") ? "rose" : "mint"}
                            />
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
