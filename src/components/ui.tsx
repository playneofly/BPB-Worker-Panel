import { ReactNode, useState } from "react";
import { motion, cubicBezier } from "framer-motion";
import { Check, Copy } from "lucide-react";
import { cn } from "../utils/cn";

export const easeOut = cubicBezier(0.22, 1, 0.36, 1);

export function Reveal({
  children,
  delay = 0,
  className,
  y = 28,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.8, delay, ease: easeOut }}
    >
      {children}
    </motion.div>
  );
}

export function CopyButton({ value, className, light }: { value: string; className?: string; light?: boolean }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setDone(true);
          setTimeout(() => setDone(false), 1900);
        } catch {
          /* ignore */
        }
      }}
      className={cn(
        "inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border transition-all duration-300",
        done
          ? "border-mint/50 bg-mint/15 text-mint"
          : light
            ? "border-black/15 bg-black/5 text-black/60 hover:bg-black/10"
            : "border-white/10 bg-white/5 text-fog hover:border-cf/40 hover:text-cf",
        className,
      )}
      aria-label="کپی"
    >
      {done ? <Check className="size-4" /> : <Copy className="size-4" />}
    </button>
  );
}

export function CodeBlock({
  title,
  code,
  accent = "cf",
  copyValue,
  className,
}: {
  title?: string;
  code: string;
  accent?: "cf" | "rose" | "mint";
  copyValue?: string;
  className?: string;
}) {
  const accents = {
    cf: "from-cf/50",
    rose: "from-rose/60",
    mint: "from-mint/50",
  } as const;
  return (
    <div className={cn("group/code relative overflow-hidden rounded-2xl glass-deep", className)}>
      <div className={cn("h-0.5 w-full bg-gradient-to-l to-transparent", accents[accent])} />
      <div className="flex items-center justify-between gap-3 border-b border-white/6 px-4 py-2.5">
        <div className="flex items-center gap-2" dir="ltr">
          <span className="size-2.5 rounded-full bg-rose/70" />
          <span className="size-2.5 rounded-full bg-cf-2/70" />
          <span className="size-2.5 rounded-full bg-mint/70" />
        </div>
        <span className="truncate text-xs text-fog/80" dir="auto">{title ?? "code"}</span>
        <CopyButton value={copyValue ?? code} />
      </div>
      <pre
        dir="ltr"
        className="overflow-x-auto px-4 py-4 text-left font-mono text-[12.5px] leading-6 text-[#c9d3e6]"
      >
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function SectionHead({
  index,
  kicker,
  title,
  desc,
}: {
  index: string;
  kicker: string;
  title: ReactNode;
  desc?: ReactNode;
}) {
  return (
    <div className="relative mb-12 md:mb-16">
      <Reveal>
        <div className="mb-4 flex items-center gap-3">
          <span className="font-mono text-xs tracking-widest text-cf">{index}</span>
          <span className="h-px w-10 bg-gradient-to-l from-cf/70 to-transparent" />
          <span className="text-sm font-semibold text-cf-2">{kicker}</span>
        </div>
        <h2 className="max-w-3xl text-3xl leading-[1.25] font-black text-white md:text-5xl md:leading-[1.2]">
          {title}
        </h2>
        {desc && <p className="mt-5 max-w-2xl text-base leading-8 text-fog md:text-lg md:leading-9">{desc}</p>}
      </Reveal>
    </div>
  );
}
