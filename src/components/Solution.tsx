import {
  Database,
  ExternalLink,
  FileCog,
  KeyRound,
  Link2,
  Rocket,
  Sparkles,
  TerminalSquare,
} from "lucide-react";
import { wizardCli, wizardSteps } from "../data";
import { CodeBlock, CopyButton, Reveal, SectionHead } from "./ui";

const wizardOutputs = [
  { icon: Database, text: "ساخت KV Namespace و بایندینگ با نام دقیق ‎kv" },
  { icon: FileCog, text: "ساخت اسکریپت ورکر با تنظیمات Embedded (UUID، پسورد، مسیر امن و…)" },
  { icon: Rocket, text: "دیپلوی مستقیم با Cloudflare API — بدون wrangler، بدون گیت‌هاب" },
  { icon: Link2, text: "تحویل Private Link برای نصبِ تک‌کلیکی‌های بعدی" },
];

export default function Solution() {
  return (
    <section id="solution" className="relative py-24 md:py-32">
      <div className="absolute top-40 right-0 h-80 w-80 rounded-full bg-cf/8 blur-[130px]" aria-hidden />
      <div className="mx-auto max-w-6xl px-5">
        <SectionHead
          index="۰۲"
          kicker="راه‌حل رسمی نسخه‌ی ۵"
          title={
            <>
              نصب با <span className="bg-gradient-to-l from-cf to-cf-2 bg-clip-text text-transparent">BPB Wizard</span>
              {" "}— دقیقاً همان راهی که پروژه برایش ساخته شده
            </>
          }
          desc="ویزارد همان کارهایی را انجام می‌دهد که دستی انجامشان غیرممکن شده: تنظیمات را داخل کد ورکر کار می‌گذارد، KV را وصل می‌کند و با API کلادفلر مستقیم دیپلوی می‌کند. شش قدم، زیر پنج دقیقه."
        />

        <div className="grid gap-12 lg:grid-cols-[1fr_350px] lg:gap-10">
          {/* timeline */}
          <ol className="relative space-y-4">
            <div className="absolute top-2 bottom-2 right-6 w-px bg-gradient-to-b from-cf/60 via-white/10 to-transparent" aria-hidden />
            {wizardSteps.map((s, i) => (
              <Reveal key={s.no} delay={i * 0.06}>
                <li className="relative pr-16">
                  <span className="absolute top-5 right-0 z-10 grid size-12 -translate-y-1 place-items-center rounded-2xl border border-cf/30 bg-ink-3 font-mono text-sm font-bold text-cf-2 shadow-[0_0_24px_-6px_rgba(246,130,31,0.5)]">
                    {s.no}
                  </span>
                  <article className="card-hover rounded-2xl glass p-5 md:p-6">
                    <h3 className="text-lg font-extrabold text-white">{s.title}</h3>
                    <p className="mt-2.5 text-sm leading-7.5 text-fog">{s.desc}</p>
                    {s.code && (
                      <div dir="ltr" className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-cf/25 bg-cf/8 px-3.5 py-3">
                        <div className="min-w-0">
                          <span className="block text-[10px] font-bold tracking-wide text-cf-2/80">{s.code.label}</span>
                          <span className="block truncate font-mono text-[13px] font-semibold text-white">{s.code.value}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <a
                            href={s.code.value}
                            target="_blank"
                            rel="noreferrer"
                            className="grid size-8 place-items-center rounded-lg bg-cf text-ink transition-transform hover:scale-105"
                            aria-label="باز کردن ویزارد"
                          >
                            <ExternalLink className="size-4" />
                          </a>
                          <CopyButton value={s.code.value} />
                        </div>
                      </div>
                    )}
                    {s.tip && (
                      <p className="mt-3 flex items-start gap-1.5 text-xs leading-6 text-cf-2/90">
                        <Sparkles className="mt-1 size-3.5 shrink-0" />
                        {s.tip}
                      </p>
                    )}
                  </article>
                </li>
              </Reveal>
            ))}
          </ol>

          {/* sticky aside */}
          <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <div className="rounded-2xl glass p-6">
                <h4 className="flex items-center gap-2 font-extrabold text-white">
                  <KeyRound className="size-4.5 text-cf" />
                  ویزارد دقیقاً چه چیزهایی می‌سازد؟
                </h4>
                <ul className="mt-4 space-y-3.5">
                  {wizardOutputs.map((o, i) => (
                    <li key={i} className="flex items-start gap-3 text-[13px] leading-6.5 text-fog">
                      <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/4">
                        <o.icon className="size-3.5 text-cf-2" />
                      </span>
                      <span dir="auto">{o.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="rounded-2xl glass p-6">
                <h4 className="flex items-center gap-2 font-extrabold text-white">
                  <TerminalSquare className="size-4.5 text-cf" />
                  اگر ترمینال دوست داری (نسخه‌ی CLI)
                </h4>
                <p className="mt-2 text-xs leading-6 text-fog">
                  ویندوز (PowerShell)، ترموکس/لینوکس/مک — فقط اسکریپت زیر را اجرا کن:
                </p>
                <div className="mt-4 space-y-3">
                  <CodeBlock title="Windows PowerShell" code={wizardCli.windows} />
                  <CodeBlock title="Android (Termux) / Linux / macOS" code={wizardCli.unix} />
                </div>
                <p className="mt-3 text-[11px] leading-5.5 text-fog/70">
                  ترموکس را حتماً از ریپوی گیت‌هاب خودشان نصب کن، نه گوگل‌پلی.
                </p>
              </div>
            </Reveal>
          </aside>
        </div>
      </div>
    </section>
  );
}
