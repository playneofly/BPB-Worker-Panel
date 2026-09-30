// ─── موتور تست زنده‌ی آدرس‌ها (کاملاً سمتِ مرورگر) ───
//
// حقیقتِ فنی مرورگرها:
//  - آدرس‌های دامنه‌دار → می‌توان با fetch(no-cors) روی HTTPS پاسخ واقعی گرفت (پینگ واقعی).
//  - آدرس‌های IP  → فقط روی صفحه‌ی http:// (یا file:) قابل‌سنجش‌اند (HTTP پورت ۸۰)؛
//    از روی HTTPS مرورگر mixed-content بلاک می‌کند و TLS با SNI=IP هم روی اج کلودفلر جواب نمی‌دهد.
//  پس به‌جای نتیجه‌ی دروغین، «تست‌ناپذیر» گزارش می‌کنیم.

export type ProbeState = "ok" | "dead" | "untestable";

export interface ProbeResult {
  addr: string;
  state: ProbeState;
  ms: number | null;
  via: "https" | "http80" | "blocked";
}

export const IPV4_RE = /^(\d{1,3}\.){3}\d{1,3}$/;

export function isIP(addr: string): boolean {
  return IPV4_RE.test(addr) || addr.includes(":");
}

export function canHttpProbe(): boolean {
  try {
    return window.location.protocol === "http:" || window.location.protocol === "file:";
  } catch {
    return false;
  }
}

async function timedGet(url: string, timeoutMs: number): Promise<number | null> {
  const t0 = performance.now();
  const ctrl = new AbortController();
  const to = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    await fetch(url, { mode: "no-cors", cache: "no-store", signal: ctrl.signal, redirect: "follow" });
    return Math.round(performance.now() - t0);
  } catch {
    return null;
  } finally {
    clearTimeout(to);
  }
}

export async function probeAddr(addr: string, timeoutMs = 3200): Promise<ProbeResult> {
  const ip = isIP(addr);
  const httpOk = canHttpProbe();

  if (ip && !httpOk) {
    // از روی HTTPS به دروغ «مرده» نمی‌گوییم — عمداً رد می‌کنیم
    return { addr, state: "untestable", ms: null, via: "blocked" };
  }

  if (ip) {
    const httpMs = await timedGet(`http://${addr}/`, timeoutMs);
    if (httpMs !== null) return { addr, state: "ok", ms: httpMs, via: "http80" };
    const httpsMs = await timedGet(`https://${addr}/`, Math.min(timeoutMs, 2200));
    if (httpsMs !== null) return { addr, state: "ok", ms: httpsMs, via: "https" };
    return { addr, state: "dead", ms: null, via: "http80" };
  }

  const httpsMs = await timedGet(`https://${addr}/`, timeoutMs);
  if (httpsMs !== null) return { addr, state: "ok", ms: httpsMs, via: "https" };
  if (httpOk) {
    const httpMs = await timedGet(`http://${addr}/`, timeoutMs);
    if (httpMs !== null) return { addr, state: "ok", ms: httpMs, via: "http80" };
  }
  return { addr, state: "dead", ms: null, via: "https" };
}

export interface ScanStats {
  total: number;
  done: number;
  ok: number;
}

export async function scanAddrs(
  addrs: string[],
  timeoutMs: number,
  onOne: (r: ProbeResult, stats: ScanStats) => void,
  concurrency = 8,
): Promise<Map<string, ProbeResult>> {
  const map = new Map<string, ProbeResult>();
  const total = addrs.length;
  let done = 0;
  let okc = 0;
  const queue = [...addrs];

  const worker = async () => {
    while (queue.length) {
      const addr = queue.shift();
      if (!addr) break;
      const r = await probeAddr(addr, timeoutMs); // eslint-disable-line no-await-in-loop
      map.set(addr, r);
      done++;
      if (r.state === "ok") okc++;
      onOne(r, { total, done, ok: okc });
    }
  };

  await Promise.all(Array.from({ length: Math.min(concurrency, total || 1) }, () => worker()));
  return map;
}

export function probeBadge(r: ProbeResult | undefined): { text: string; color: string } | null {
  if (!r) return null;
  if (r.state === "ok" && r.ms !== null)
    return {
      text: `${r.ms}ms`,
      color: r.ms <= 180 ? "#4ade80" : r.ms <= 500 ? "#facc15" : "#fb923c",
    };
  if (r.state === "dead") return { text: "بدون پاسخ", color: "#ff5964" };
  return { text: "تست‌ناپذیر", color: "#9aa4b8" };
}
