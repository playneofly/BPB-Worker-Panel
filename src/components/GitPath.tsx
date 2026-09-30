import { GitBranch, Skull, Stamp } from "lucide-react";
import { wranglerSnippet } from "../data";
import { CodeBlock, Reveal, SectionHead } from "./ui";

export default function GitPath() {
  return (
    <section id="gitpath" className="relative py-24 md:py-32">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-white/8 to-transparent" aria-hidden />
      <div className="mx-auto max-w-6xl px-5">
        <SectionHead
          index="۰۳"
          kicker="برای کنجکاوها"
          title={
            <>
              «خب بسازمش دیگه!» — اگر باز هم{" "}
              <span className="bg-gradient-to-l from-rose to-cf bg-clip-text text-transparent">گیت‌هاب دیپلوی</span>
              {" "}بخواهی
            </>
          }
          desc="از نظر فنی، این فایل خطای wrangler را رفع می‌کند. ولی چون EMBEDED_SETTINGS فقط در نسخه‌های ساخته‌شده توسط ویزارد وجود دارد، حاصلِ آن یک ورکرِ خطا نشان‌دهنده است. این کارت فقط برای فهم ماجرا است."
        />

        <div className="grid items-start gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <div className="relative rounded-3xl glass p-7 md:p-8">
              <span
                className="absolute -top-3 left-6 inline-flex -rotate-6 items-center gap-1.5 rounded-lg border-2 border-rose bg-rose/15 px-3 py-1.5 text-xs font-black tracking-wide text-rose"
                aria-hidden
              >
                <Skull className="size-4" />
                مسیر بن‌بست در v5
              </span>

              <h3 className="flex items-center gap-2 text-xl font-black text-white">
                <GitBranch className="size-5 text-cf" />
                فرض کنیم فایل را ساختیم…
              </h3>
              <ol className="mt-5 space-y-4">
                {[
                  [
                    "wrangler.json اضافه می‌کنی و KV Namespace می‌سازی:",
                    "$ npx wrangler kv namespace create kv",
                  ],
                  [
                    "شناسه‌ی KV را در فایل کنار binding با نام kv قرار می‌دهی و پوش می‌کنی.",
                    null,
                  ],
                  [
                    "Workers Builds دوباره می‌سازد و این بار دیپلوی موفق است.",
                    null,
                  ],
                  [
                    "آدرس ورکر را باز می‌کنی و با این خطاست مواجه می‌شوی:",
                    "BPB Panel v5 can only be installed using BPB Wizard v3 or later.",
                  ],
                ].map(([text, code], i) => (
                  <li key={i} className="flex gap-3.5">
                    <span className="grid size-7 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/4 font-mono text-xs font-bold text-cf-2">
                      {["۱", "۲", "۳", "۴"][i]}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm leading-7 text-fog">{text}</p>
                      {code && (
                        <code
                          dir="ltr"
                          className="mt-1.5 block overflow-x-auto rounded-lg border border-white/8 bg-black/35 px-3 py-2 text-left font-mono text-[11.5px] text-[#9fb4d8] whitespace-nowrap"
                        >
                          {code}
                        </code>
                      )}
                    </div>
                  </li>
                ))}
              </ol>

              <p className="mt-6 rounded-xl border border-cf/20 bg-cf/8 px-4 py-3 text-xs leading-6.5 text-cf-2">
                نتیجه: فقط مسیرِ خطا ریخته شده؛ از «خطای دیپلوی» به «خطای زمان اجرا» رسیدی. نسخه‌ی ۵ برای نصبِ مستقیم
                گیت‌هابی ساخته نشده — ویزارد، تنها نصب‌کننده‌ی رسمی است.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="relative">
              <div className="absolute -inset-2 rounded-3xl bg-gradient-to-br from-cf/10 to-rose/12 blur-lg" aria-hidden />
              <CodeBlock
                title="wrangler.json — رفع رسمیِ خطای static files (و نه بیشتر)"
                code={wranglerSnippet}
                accent="cf"
              />
            </div>
            <p className="mt-4 flex items-start gap-2 text-xs leading-6 text-fog">
              <Stamp className="mt-0.5 size-4 shrink-0 text-rose" />
              مقادیر compatibility_date و نامورکر را برای خودت تنظیم کن. این بلوک را به‌عنوان راه‌حلِ نهایی در نظر
              نگیر؛ فقط همان یک خطای ساختاری را می‌پوشاند.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
