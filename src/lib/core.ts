// ─── هسته‌ی پردازش کانفیگ ───

export type Proto =
  | "vless"
  | "trojan"
  | "vmess"
  | "ss"
  | "ssr"
  | "hysteria2"
  | "tuic"
  | "wireguard"
  | "other";

export interface ConfigEntry {
  id: string; // unique-ish (uri)
  proto: Proto;
  raw: string;
  name: string;
  addr: string;
  port: number;
  uid: string; // uuid / password / method:pass...
  params: Record<string, string>;
  source: string; // کدام منبع / boost
  boosted?: boolean;
}

export interface ParsedTemplate {
  proto: "vless" | "trojan";
  uid: string;
  addr: string;
  port: number;
  params: Record<string, string>;
  name: string;
}

export const faNum = (n: number | string) => Number(n).toLocaleString("fa-IR");

// ---- base64 unicode-safe ----
export function b64encode(s: string): string {
  const bytes = new TextEncoder().encode(s);
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

export function b64decode(s: string): string {
  const clean = s.replace(/[\s\n\r]+/g, "").replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(clean + "=".repeat((4 - (clean.length % 4)) % 4));
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder("utf-8", { fatal: false }).decode(bytes);
}

function looksBase64(s: string): boolean {
  return /^[A-Za-z0-9+/=\s_-]+$/.test(s) && s.length > 24 && !s.includes("://");
}

// بدنه‌ی ساب می‌تواند base64 کل بلوک یا خط‌به‌خط باشد
export function decodeSubscription(body: string): string[] {
  const trimmed = body.trim();
  if (!trimmed) return [];
  if (looksBase64(trimmed)) {
    try {
      const dec = b64decode(trimmed);
      if (dec.includes("://")) return dec.split(/\r?\n/);
    } catch {
      /* fallthrough */
    }
  }
  return trimmed.split(/\r?\n/);
}

const PROTO_RE = /^(vless|trojan|vmess|ss|ssr|hysteria2|hy2|tuic|wireguard|wg):\/\//i;

export function isConfigLine(line: string): boolean {
  return PROTO_RE.test(line.trim());
}

function normalizeProto(p: string): Proto {
  p = p.toLowerCase();
  if (p === "hy2") return "hysteria2";
  if (p === "wg") return "wireguard";
  return (PROTO_RE.test(p + "://") ? p : "other") as Proto;
}

export function parseConfigLine(line: string, source: string): ConfigEntry | null {
  const raw = line.trim();
  if (!raw) return null;
  const m = raw.match(/^([a-zA-Z0-9]+):\/\//);
  if (!m) return null;
  const proto = normalizeProto(m[1]);
  const body = raw.slice(m[0].length);
  const [main, frag = ""] = body.split("#");
  let name = "";
  try {
    name = decodeURIComponent(frag.trim());
  } catch {
    name = frag.trim();
  }

  let uid = "";
  let addr = "";
  let port = 0;
  const params: Record<string, string> = {};

  try {
    if (proto === "vmess") {
      const j = JSON.parse(b64decode(main));
      uid = String(j.id ?? "");
      addr = String(j.add ?? "");
      port = Number(j.port ?? 0);
      name = name || String(j.ps ?? "");
      if (j.sni) params.sni = String(j.sni);
      if (j.host) params.host = String(j.host);
      if (j.path) params.path = String(j.path);
      if (j.tls) params.security = String(j.tls);
      if (j.net) params.type = String(j.net);
      if (j.fp) params.fp = String(j.fp);
    } else if (proto === "ss" || proto === "ssr") {
      // ss://base64(method:pass@addr:port) یا SIP002
      let tail = main;
      if (tail.includes("?")) tail = tail.split("?")[0];
      let decoded = tail;
      if (tail.includes("@")) {
        const [cred, hostPart] = tail.split("@");
        uid = cred;
        decoded = hostPart + ":" + cred;
        const hp = hostPart.split(":");
        addr = hp.slice(0, -1).join(":");
        port = Number(hp[hp.length - 1]) || 0;
      } else {
        try {
          const dec = b64decode(tail);
          const [credPart, hostPart] = dec.split("@");
          uid = credPart ?? "";
          const hp = (hostPart ?? "").split(":");
          addr = hp.slice(0, -1).join(":");
          port = Number(hp[hp.length - 1]) || 0;
          decoded = dec;
        } catch {
          /* keep */
        }
      }
      void decoded;
    } else {
      // vless/trojan/hysteria2/tuic/wireguard → uid@addr:port?qs
      const qIdx = main.indexOf("?");
      const auth = qIdx >= 0 ? main.slice(0, qIdx) : main;
      const qs = qIdx >= 0 ? main.slice(qIdx + 1) : "";
      const atIdx = auth.lastIndexOf("@");
      if (atIdx > 0) {
        try {
          uid = decodeURIComponent(auth.slice(0, atIdx));
        } catch {
          uid = auth.slice(0, atIdx);
        }
        const hp = auth.slice(atIdx + 1);
        // ipv6 [..]:port
        const br = hp.match(/^\[([^\]]+)\]:(\d+)/);
        if (br) {
          addr = br[1];
          port = Number(br[2]);
        } else {
          const idx = hp.lastIndexOf(":");
          addr = idx > 0 ? hp.slice(0, idx) : hp;
          port = idx > 0 ? Number(hp.slice(idx + 1)) || 0 : 0;
        }
      }
      if (qs) {
        for (const kv of qs.split("&")) {
          const eq = kv.indexOf("=");
          if (eq > 0) {
            const k = kv.slice(0, eq);
            let v = kv.slice(eq + 1);
            try {
              v = decodeURIComponent(v);
            } catch {
              /* keep */
            }
            params[k] = v;
          }
        }
      }
    }
  } catch {
    return null;
  }

  if (!name) name = `${proto}${addr ? ` · ${addr}` : ""}`;
  return {
    id: raw,
    proto,
    raw,
    name,
    addr,
    port,
    uid,
    params,
    source,
  };
}

export function parseSubscription(body: string, source: string): { entries: ConfigEntry[]; rejected: number } {
  const lines = decodeSubscription(body);
  const entries: ConfigEntry[] = [];
  let rejected = 0;
  for (const l of lines) {
    if (!l.trim()) continue;
    const e = parseConfigLine(l, source);
    if (e) entries.push(e);
    else if (l.includes("://")) rejected++;
  }
  return { entries, rejected };
}

// الگوی vless/trojan از یک URI (برای تقویت‌کننده)
export function parseTemplate(uri: string): ParsedTemplate | null {
  const e = parseConfigLine(uri, "template");
  if (!e) return null;
  if (e.proto !== "vless" && e.proto !== "trojan") return null;
  if (!e.uid || !e.addr || !e.port) return null;
  return { proto: e.proto, uid: e.uid, addr: e.addr, port: e.port, params: { ...e.params }, name: e.name };
}

// ساختِ واریانت جدید از الگو
export function buildVariant(t: ParsedTemplate, addr: string, port: number, name: string): string {
  const p = { ...t.params };
  // sni / host هرگز عوض نمی‌شوند — فقط آدرس فیزیکی اتصال
  const qs = Object.entries(p)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join("&");
  const frag = name ? `#${encodeURIComponent(name)}` : "";
  return `${t.proto}://${encodeURIComponent(t.uid)}@${addr}:${port}${qs ? `?${qs}` : ""}${frag}`;
}

export function dedup(entries: ConfigEntry[]): ConfigEntry[] {
  const seen = new Set<string>();
  const out: ConfigEntry[] = [];
  for (const e of entries) {
    const key = `${e.proto}:${e.uid}@${e.addr}:${e.port}:${e.params.sni ?? e.params.host ?? ""}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(e);
  }
  return out;
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ---- فچ منبع ----
export async function fetchText(url: string, timeoutMs = 14000): Promise<string> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: ctrl.signal, cache: "no-store", redirect: "follow" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  } finally {
    clearTimeout(t);
  }
}

export function hostOf(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

export function downloadText(filename: string, text: string, mime = "text/plain") {
  const blob = new Blob([text], { type: `${mime};charset=utf-8` });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    URL.revokeObjectURL(a.href);
    a.remove();
  }, 500);
}

export const PROTO_COLORS: Record<string, string> = {
  vless: "#f6821f",
  trojan: "#38bdf8",
  vmess: "#a78bfa",
  ss: "#f472b6",
  ssr: "#fb7185",
  hysteria2: "#4ade80",
  tuic: "#facc15",
  wireguard: "#fb923c",
  other: "#9aa4b8",
};
