// ─── داده‌های صفحه (بر اساس سورس واقعی ریپو و لاگ کاربر) ───

export type LogTone = "cmd" | "ok" | "dim" | "err" | "info";

export interface LogLine {
  tone: LogTone;
  text: string;
}

// خلاصه‌شده‌ی همان لاگ واقعی دیپلوی کاربر
export const deployLog: LogLine[] = [
  { tone: "cmd", text: "$ bun install" },
  { tone: "dim", text: "198 packages installed [1.79s]" },
  { tone: "cmd", text: "$ npm run build" },
  { tone: "dim", text: "> bpb-panel@5.1.1 build  >  node scripts/build.js" },
  { tone: "ok", text: "✔ Assets bundled successfuly!" },
  { tone: "ok", text: "✔ Worker built successfuly!" },
  { tone: "ok", text: "✔ Worker minified successfuly!" },
  { tone: "ok", text: "✔ Done!  →  خروجی فقط یک فایل است: dist/worker.js" },
  { tone: "info", text: "Success: Build command completed" },
  { tone: "cmd", text: "$ npx wrangler deploy" },
  { tone: "dim", text: "⛅️ wrangler 4.145.0 — بدون هیچ کانفیگی (wrangler.json نداریم!)" },
  { tone: "err", text: "✘ [ERROR] Could not detect a directory containing static files" },
  { tone: "err", text: "           (e.g. html, css and js) for the project" },
  { tone: "err", text: "Failed: error occurred while running deploy command" },
];

export const wranglerSnippet = `// wrangler.json — با این فایل دیپلوی گیت‌هابی «انجام می‌شود» ولی...
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "bpb-panel",
  "main": "dist/worker.js",                        // ← خروجی scripts/build.js
  "compatibility_date": "2026-09-30",
  "compatibility_flags": ["nodejs_compat"],        // ← اکسترنال‌های node:crypto
  "kv_namespaces": [
    { "binding": "kv", "id": "<KV_NAMESPACE_ID>" } // ← بایندینگ حتماً باید kv باشد
  ]
}
// ولی بعد از دیپلوی باز هم پنل بالا نمی‌آید:
// EMBEDED_SETTINGS وجود ندارد → همان خطای «فقط با BPB Wizard» برمی‌گردد.`;

export const initGuardSnippet = `// src/settings/settings.ts — قلب ماجرا ⬇
export function init(request: Request, env: Env) {
  if (env.UUID || env.TR_PASS || typeof EMBEDED_SETTINGS === 'undefined') {
    throw new Error("BPB Panel v5 can only be installed using BPB Wizard v3 or later.");
  }
  // ...
}`;

export const wizardUrl = "https://wizard.bpb-panel.workers.dev";

export const wizardCli = {
  windows: "irm https://raw.githubusercontent.com/bia-pain-bache/BPB-Wizard/main/install.ps1 | iex",
  unix: "bash <(curl -fsSL https://raw.githubusercontent.com/bia-pain-bache/BPB-Wizard/main/install.sh)",
};

export const repoUrl = "https://github.com/playneofly/BPB-Worker-Panel";
export const upstreamUrl = "https://github.com/bia-pain-bache/BPB-Worker-Panel";
export const wizardRepoUrl = "https://github.com/bia-pain-bache/BPB-Wizard";
export const docsUrl = "https://bia-pain-bache.github.io/BPB-Worker-Panel/fa/wizard/";

export interface Step {
  no: string;
  title: string;
  desc: string;
  code?: { label: string; value: string };
  tip?: string;
}

export const wizardSteps: Step[] = [
  {
    no: "۰۱",
    title: "پروژه‌ی گیت‌هابیِ خراب را پاک کن",
    desc: "در داشبورد Cloudflare، Workers & Pages ← پروژه‌ای که برای Workers Builds ساخته بودی و شکست خورد را پیدا و Delete کن. بدون این کار، هر کامیت جدید دوباره همان خطای فایل‌های استاتیک را می‌دهد.",
    tip: "هیچ Workeri هنوز ساخته نشده؛ حذف پروژه امن است.",
  },
  {
    no: "۰۲",
    title: "یک API Token بساز",
    desc: "اینجا: My Profile ← API Tokens ← Create Token. راحت‌ترین مسیر تمپلیت «Edit Cloudflare Workers» است. اگر دامنه‌ی سفارشی هم می‌خواهی، دسترسی ‎Zone → DNS ‎را هم فعال کن. خودِ ویزارد در قدم اول لیست دقیق دسترسی‌ها را نشان می‌دهد.",
    tip: "این توکن فقط روی دستگاه تو مصرف می‌شود؛ ویزارد جایی ذخیره‌اش نمی‌کند.",
  },
  {
    no: "۰۳",
    title: "Account ID را کپی کن",
    desc: "در Overview داشبورد کلادفلر، در ستون کناریِ صفحه، یک رشته‌ی ۳۲ حرفی به نام Account ID داری. کنارش دکمه‌ی کپی دارد.",
  },
  {
    no: "۰۴",
    title: "ویزارد وب را باز کن و نصب را شروع کن",
    desc: "ایمیل اکانت، Account ID و توکن را وارد کن؛ روش Workers (یا Pages) را انتخاب کن؛ UUID و پسورد Trojan را بده یا تصادفی بساز. ادامه بده تا نصب تمام شود — معمولاً زیر یک دقیقه.",
    code: { label: "BPB Wizard — نسخه‌ی وب", value: wizardUrl },
  },
  {
    no: "۰۵",
    title: "ویزارد همه‌کار را خودش می‌کند",
    desc: "KV Namespace می‌سازد و با نام دقیق ‎kv ‎به ورکر Bind می‌کند، کد ورکر را با تنظیمات Embedded (شامل UUID، پسورد و مسیر امن) می‌سازد و از طریق API کلادفلر دیپلوی می‌کند. هیچ wrangler و هیچ دیپلوی گیت‌هابی لازم نیست.",
    tip: "به‌همین دلیل است که v5 فقط با ویزارد کار می‌کند.",
  },
  {
    no: "۰۶",
    title: "Private Link را نگه دار",
    desc: "انتهای نصب، ویزارد یک «لینک خصوصی» می‌دهد. با آن، نصب بعدی روی همان اکانت تک‌کلیکی است و برای آپدیت‌های بعدی پنل هم دردسرها نداری. آن را جایی امن ذخیره کن.",
  },
];

export interface CheckItem {
  id: string;
  title: string;
  desc: string;
  warn?: boolean;
}

export const checklist: CheckItem[] = [
  {
    id: "kv",
    title: "بایندینگ KV دقیقاً با نام kv باشد",
    desc: "اگر با ویزارد نصب کرده‌ای خودش درست می‌شود؛ اگر دستی KV وصل می‌کنی، در Settings ← Bindings نام Variable باید حتماً kv باشد وگرنه پنل بالا می‌آید ولی تنظیمات را نمی‌تواند بخواند/بنویسد.",
  },
  {
    id: "secrets",
    title: "به هیچ وجه Secret با نام‌های UUID و TR_PASS نساز",
    desc: "این آموزش‌های قدیمیِ نسخه‌های قبل از ۵ است. در نسخه ۵ خودِ کد چک می‌کند: اگر env.UUID یا env.TR_PASS وجود داشته باشد، همان خطای «فقط با BPB Wizard» را می‌گیرد.",
    warn: true,
  },
  {
    id: "domain",
    title: "دامنه‌ی workers.dev یا سفارشی را فعال کن",
    desc: "پس از نصب، اگر دامنه‌ی دلخواه به کلادفلر اضافه کرده‌ای می‌توانی از داخل خودِ پنل (Admin Settings) روی Worker دامنه‌ی سفارشی بنشانی — چون ویزارد با توکن دسترسی DNS را هم دارد.",
  },
  {
    id: "path",
    title: "آدرس پنل = مسیر امن (Secure Path)",
    desc: "پنل روی روت سایت نیست؛ روی مسیری مخفی است که هنگام نصب مشخص شده (مثل /abcdef/panel). این مسیر را گم نکنی و به کسی ندهی.",
  },
  {
    id: "update",
    title: "برای آپدیت فقط از Private Link استفاده کن",
    desc: "دیپلوی گیت‌هابی را فراموش کن. هر بار پنل نسخه‌ی جدید داد، از همان ویزارد/لینک خصوصی آپدیت کن تا EMBEDED_SETTINGS حفظ شود.",
  },
];

export interface Faq {
  q: string;
  a: string[];
  code?: string;
}

export const faqs: Faq[] = [
  {
    q: "بیلد من سبز بود، پس چرا دیپلوی خراب شد؟",
    a: [
      "مرحله‌ی build فقط با اسکریپت scripts/build.js فایل dist/worker.js را می‌سازد و بس. مرحله‌ی بعد، فرمان npx wrangler deploy اجرا می‌شود. Wrangler نسخه‌ی ۴ وقتی در ریپو هیچ wrangler.json/toml/jsonc پیدا نکند، نمی‌فهمد چه چیزی را باید دیپلوی کند؛ به حدس می‌زند که پروژه یک Worker بدون اسکریپت و فقط با فایل‌های استاتیک است و دنبال پوشه‌ای می‌گردد که index.html داشته باشد (فقط ریشه و یک سطح زیر آن). چیزی پیدا نمی‌کند و همان خطا را می‌دهد.",
      "یعنی خطا هیچ ربطی به کد پنل ندارد؛ به ساختار پروژه/تنظیمات دیپلوی برمی‌گردد.",
    ],
  },
  {
    q: "ترجمه‌ی دقیق خودِ خطا چیست؟",
    a: [
      "«نمی‌توان پوشه‌ای شامل فایل‌های استاتیک (مثل html، css و js) برای این پروژه پیدا کرد.» Wrangler فکر می‌کند تو یک سایت استاتیک می‌خواهی منتشر کنی، در صورتی‌که این ریپو یک اسکریپت تک‌فایلی Workers است.",
    ],
  },
  {
    q: "اگر فقط wrangler.json بسازم چه می‌شود؟",
    a: [
      "دیپلوی انجام می‌شود و ورکر ساخته می‌شود؛ ولی این پایان قضیه نیست. به محض باز کردن آدرس، پنل این خطا را برمی‌گرداند، چون فایل خام بدون EMBEDED_SETTINGS کار نمی‌کند:",
      "پس در نسخه‌ی ۵ به‌بعد، نصب گیت‌هابی واقعاً گزینه نیست؛ پروژه عمداً برای نصب از طریق ویزارد طراحی شده.",
    ],
    code: initGuardSnippet,
  },
  {
    q: "آیا باید Secretهایی مثل UUID و TR_PASS بگذارم؟",
    a: [
      "نه. این جزئیات مال نسخه‌های ۱ تا ۴ است. در v5 تنظیمات (UUID، پسورد Trojan، مسیر امن و…) هنگام نصب توسط ویزارد داخل خودِ اسکریپت Embedded می‌شوند و مابقی در KV ذخیره می‌شود. وجود این Secretها حتی ممنوع است — همان شرط if در کد بالا، خطا می‌دهد.",
    ],
  },
  {
    q: "Workers بهتر است یا Pages؟",
    a: [
      "ویزارد هر دو روش را ساپورت می‌کند و هر دو پنل یکسانی می‌دهند. تفاوت اصلی در نحوه‌ی دیپلوی و مقابله با فیلترینگ است؛ اگر دامنه‌ی workers.dev برای تو فیلتر است، با روش Workers + دامنه‌ی سفارشی (یا Pages) نتیجه‌ی پایدارتری می‌گیری.",
    ],
  },
  {
    q: "بدون لپ‌تاپ هم می‌شود؟",
    a: [
      "آره. نسخه‌ی CLI ویزارد روی ترمینال ویندوز (PowerShell)، و روی گوشی با ترموکس (Termux) قابل اجراست. فقط حتماً Termux را از گیت‌هاب خود‌شان دانلود کن نه گوگل‌پلی.",
    ],
    code: wizardCli.unix,
  },
];

export const ticker = [
  "scripts/build.js",
  "dist/worker.js",
  "npx wrangler deploy",
  "wrangler 4.145.0",
  "assets-only fallback",
  "EMBEDED_SETTINGS",
  "kv binding: kv",
  "BPB Wizard v3+",
  "nodejs_compat",
  "Private Link",
];
