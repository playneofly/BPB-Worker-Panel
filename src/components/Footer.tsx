import { ArrowUpRight, BookOpenText, CloudLightning, GitFork, Package, WandSparkles } from "lucide-react";
import { docsUrl, repoUrl, upstreamUrl, wizardRepoUrl } from "../data";
import { Reveal } from "./ui";

const resources = [
  { icon: GitFork, label: "ریپوی تو (Fork)", sub: "playneofly/BPB-Worker-Panel", href: repoUrl },
  { icon: Package, label: "پروژه‌ی اصلی پنل", sub: "bia-pain-bache/BPB-Worker-Panel", href: upstreamUrl },
  { icon: WandSparkles, label: "ریپوی BPB Wizard", sub: "bia-pain-bache/BPB-Wizard", href: wizardRepoUrl },
  { icon: BookOpenText, label: "مستندات رسمی (فارسی)", sub: "bia-pain-bache.github.io", href: docsUrl },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden pt-24 pb-10">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-cf/40 to-transparent" aria-hidden />
      <div className="absolute -bottom-40 left-1/2 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-cf/9 blur-[120px]" aria-hidden />

      <div className="relative mx-auto max-w-6xl px-5">
        <Reveal>
          <div className="mb-14 text-center">
            <p className="font-mono text-xs tracking-[0.3em] text-cf/80" dir="ltr">1000+ CONFIGS · ONE WORKER</p>
            <h2 className="mx-auto mt-4 max-w-2xl text-3xl leading-snug font-black text-white md:text-4xl">
              یک ورکر، صدها راه رسیدن؛{" "}
              <span className="bg-gradient-to-l from-cf to-cf-2 bg-clip-text text-transparent">حجم زیاد به معنای انعطاف بیشتر است.</span>
            </h2>
          </div>
        </Reveal>

        <div className="grid gap-3.5 sm:grid-cols-2">
          {resources.map((r, i) => (
            <Reveal key={r.href} delay={i * 0.07}>
              <a
                href={r.href}
                target="_blank"
                rel="noreferrer"
                className="card-hover group flex items-center justify-between gap-4 rounded-2xl glass p-5"
              >
                <span className="flex items-center gap-3.5">
                  <span className="grid size-11 place-items-center rounded-xl border border-white/10 bg-white/4 text-cf transition-colors group-hover:border-cf/40">
                    <r.icon className="size-5" />
                  </span>
                  <span>
                    <span className="block font-extrabold text-white">{r.label}</span>
                    <span className="block font-mono text-[11px] text-fog/70" dir="ltr">
                      {r.sub}
                    </span>
                  </span>
                </span>
                <ArrowUpRight className="size-5 text-fog transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-cf" />
              </a>
            </Reveal>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/6 pt-7 md:flex-row">
          <span className="flex items-center gap-2 text-sm font-bold text-white">
            <span className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-cf to-cf-2 text-ink">
              <CloudLightning className="size-4.5" />
            </span>
            BPB Mega
          </span>
          <p className="max-w-xl text-center text-xs leading-6 text-fog/70 md:text-left">
            ابزار تجمیع و تقویت سابسکریپشن — کاملاً سمتِ مرورگر و بدون سرور؛ اطلاعات تو جایی فرستاده نمی‌شود. این
            پروژه تابعِ BPB Worker Panel رسمی نیست. فقط ترکیب‌کردنی که خود پنل در مقیاس کوچک انجام می‌دهد را بزرگ کرده‌ایم.
          </p>
        </div>
      </div>
    </footer>
  );
}
