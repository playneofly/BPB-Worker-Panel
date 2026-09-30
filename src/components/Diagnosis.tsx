import { Ban, ChevronLeft, FileCode2, FileSearch, FolderTree, SearchX } from "lucide-react";
import { initGuardSnippet } from "../data";
import { CodeBlock, Reveal, SectionHead } from "./ui";
import { cn } from "../utils/cn";

const chain = [
  {
    no: "۱",
    icon: FileCode2,
    color: "text-mint",
    ring: "border-mint/25 bg-mint/10",
    title: "بیلد فقط یک فایل می‌سازد",
    desc: "اسکریپت scripts/build.js کل پنل (HTML و CSS و JS داخل خودِ کد) را در یک اسکریپت تک‌فایلی تولید می‌کند:",
    code: "writeFileSync('./dist/worker.js', ...);\n// ✔ Done! — نه index.html در کار است",
  },
  {
    no: "۲",
    icon: FileSearch,
    color: "text-cf-2",
    ring: "border-cf/30 bg-cf/10",
    title: "ریپو هیچ wrangler config ندارد",
    desc: "در ریشه‌ی ریپو فقط این‌ها داریم: package.json و scripts/ و src/ و tsconfig.json و docs. هیچ wrangler.json یا wrangler.toml یا wrangler.jsonc نیست که به wrangler بگوید main = dist/worker.js.",
  },
  {
    no: "۳",
    icon: SearchX,
    color: "text-rose",
    ring: "border-rose/25 bg-rose/10",
    title: "Wrangler 4 حدس اشتباه می‌زند",
    desc: "وقتی main تعریف نشده باشد، نسخه‌های ۴ به‌بالای wrangler به حالت «Worker فقط‌استاتیک» برمی‌گردند: فقط ریشه و یک سطح زیرش را برای index.html می‌گردند. dist فقط worker.js دارد، پس همان خطای مشهور را می‌گیری.",
    code: "✘ Could not detect a directory containing\n  static files (e.g. html, css and js) ...",
  },
];

export default function Diagnosis() {
  return (
    <section id="diagnosis" className="relative py-24 md:py-32">
      <div className="absolute inset-x-0 top-24 h-px bg-gradient-to-l from-transparent via-white/8 to-transparent" aria-hidden />
      <div className="mx-auto max-w-6xl px-5">
        <SectionHead
          index="۰۱"
          kicker="ریشه‌ی مشکل"
          title={
            <>
              سه حلقه‌ای که خطا را ساخت —{" "}
              <span className="bg-gradient-to-l from-cf to-rose bg-clip-text text-transparent">به ترتیب</span>
            </>
          }
          desc="لاگ تو دو بخش دارد: بیلد که همه‌اش ✔ است، و دیپلوی که با یک ✘ تمام می‌شود. پل بین این دو، سه واقعیتِ ریپوی BPB است."
        />

        {/* chain */}
        <div className="relative grid gap-6 lg:grid-cols-3">
          {chain.map((c, i) => (
            <Reveal key={c.no} delay={i * 0.12} className="relative">
              {i < chain.length - 1 && (
                <span className="absolute top-1/2 -left-4 z-10 hidden -translate-y-1/2 text-cf lg:block" aria-hidden>
                  <ChevronLeft className="size-6 animate-pulse-soft" />
                </span>
              )}
              <article className="card-hover relative h-full overflow-hidden rounded-2xl glass p-6 md:p-7">
                <span className="text-stroke absolute -top-3 left-4 text-7xl font-black select-none" aria-hidden>
                  {c.no}
                </span>
                <span className={cn("relative mb-5 inline-grid size-12 place-items-center rounded-xl border", c.ring)}>
                  <c.icon className={cn("size-6", c.color)} />
                </span>
                <h3 className="text-lg font-extrabold text-white">{c.title}</h3>
                <p className="mt-3 text-sm leading-7.5 text-fog">{c.desc}</p>
                {c.code && (
                  <pre
                    dir="ltr"
                    className={cn(
                      "mt-4 overflow-x-auto rounded-xl border px-3.5 py-3 text-left font-mono text-[11.5px] leading-6",
                      i === 2 ? "border-rose/25 bg-rose/8 text-rose" : "border-white/8 bg-black/30 text-[#9fb4d8]",
                    )}
                  >
                    <code>{c.code}</code>
                  </pre>
                )}
              </article>
            </Reveal>
          ))}
        </div>

        {/* repo tree evidence */}
        <Reveal delay={0.15} className="my-10">
          <div className="glass rounded-2xl px-5 py-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 text-sm font-bold text-white">
                <FolderTree className="size-4.5 text-cf" />
                ساختار واقعی ریشه‌ی ریپوی تو:
              </span>
              <div className="flex flex-wrap items-center gap-2 font-mono text-[11.5px]" dir="ltr">
                {["package.json", "scripts/", "src/", "docs/", "tsconfig.json"].map((f) => (
                  <span key={f} className="rounded-md border border-white/10 bg-white/4 px-2 py-1 text-fog">
                    {f}
                  </span>
                ))}
                <span className="inline-flex items-center gap-1 rounded-md border border-rose/30 bg-rose/10 px-2 py-1 font-bold text-rose">
                  <Ban className="size-3.5" />
                  wrangler.json ✗
                </span>
              </div>
            </div>
          </div>
        </Reveal>

        {/* plot twist */}
        <Reveal delay={0.1}>
          <div className="relative overflow-hidden rounded-3xl border border-rose/20 bg-gradient-to-bl from-rose/12 via-ink-3 to-ink-2 p-7 md:p-10">
            <div className="absolute -top-16 -left-16 h-56 w-56 rounded-full bg-rose/16 blur-[90px]" aria-hidden />
            <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_1.1fr]">
              <div>
                <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-rose/30 bg-rose/10 px-3 py-1.5 text-xs font-bold text-rose">
                  <Ban className="size-3.5" />
                  پیچِ داستان — مهم‌ترین بخش
                </span>
                <h3 className="text-2xl leading-snug font-black text-white md:text-3xl">
                  حتی اگر wrangler.json بسازی، پنل v5{" "}
                  <span className="text-rose">بالا نمی‌آید.</span>
                </h3>
                <p className="mt-4 text-sm leading-8 text-fog md:text-base md:leading-8.5">
                  با اضافه کردن کانفیگ، خطای فایل‌های استاتیک رفع می‌شود و ورکر ساخته می‌شود؛ ولی کدِ پنل در اولین
                  درخواست چک می‌کند که آیا تنظیمات Embedded وجود دارد یا نه. آن تنظیمات فقط زمانی وجود دارد که نصب
                  از طریق <span className="font-bold text-white">BPB Wizard v3+</span> انجام شده باشد. پس به‌جای
                  پنل، همان ارور «فقط با ویزارد» را می‌بینی.
                </p>
                <p className="mt-3 text-sm leading-8 text-fog md:text-base md:leading-8.5">
                  خواندن دقیقِ همان شرط: حتی وجود Secretهای قدیمی <code dir="ltr" className="rounded bg-white/7 px-1 font-mono text-cf-2">UUID</code> یا{" "}
                  <code dir="ltr" className="rounded bg-white/7 px-1 font-mono text-cf-2">TR_PASS</code> هم این خطا را فعال می‌کند.
                </p>
              </div>
              <CodeBlock title="src/settings/settings.ts — همان شرطِ گارد" code={initGuardSnippet} accent="rose" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
