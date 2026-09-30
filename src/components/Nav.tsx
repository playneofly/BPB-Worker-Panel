import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CloudLightning, Wrench } from "lucide-react";
import { cn } from "../utils/cn";
import { easeOut } from "./ui";

const links = [
  { href: "#sources", label: "منابع" },
  { href: "#boost", label: "تقویت‌کننده" },
  { href: "#results", label: "نتایج و خروجی" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: easeOut, delay: 0.15 }}
      className="fixed inset-x-0 top-0 z-50 px-4 pt-4"
    >
      <nav
        className={cn(
          "mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-2xl px-4 py-3 transition-all duration-500",
          scrolled ? "glass shadow-[0_18px_50px_-20px_rgba(0,0,0,0.7)]" : "bg-transparent border border-transparent",
        )}
      >
        <a href="#hero" className="group flex items-center gap-2.5">
          <span className="relative grid size-9 place-items-center rounded-xl bg-gradient-to-br from-cf to-cf-2 text-ink shadow-[0_6px_20px_-6px_rgba(246,130,31,0.8)]">
            <CloudLightning className="size-5" strokeWidth={2.4} />
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-extrabold text-white">BPB Mega</span>
            <span className="block text-[11px] text-fog">کارخانه‌ی کانفیگ ۱۰۰۰تایی</span>
          </span>
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-2 text-sm font-semibold text-fog transition-colors duration-300 hover:bg-white/5 hover:text-white"
            >
              {l.label}
            </a>
          ))}
        </div>

        <a
          href="#boost"
          className="flex items-center gap-2 rounded-xl bg-white px-3.5 py-2 text-sm font-extrabold text-ink transition-all duration-300 hover:bg-cf hover:text-ink"
        >
          <Wrench className="size-4" />
          <span className="hidden sm:inline">شروع تولید</span>
          <span className="sm:hidden">تولید</span>
        </a>
      </nav>
    </motion.header>
  );
}
