import { useMemo, useState } from "react";
import Nav from "./components/Nav";
import HubTop from "./components/HubTop";
import Sources from "./components/Sources";
import Multiplier from "./components/Multiplier";
import Results from "./components/Results";
import Footer from "./components/Footer";
import { ConfigEntry, dedup, fetchText, parseSubscription } from "./lib/core";
import { DEFAULT_PROXY_URL, DEFAULT_SOURCES } from "./lib/presets";
import { SourceState } from "./types";

const tickerItems = [
  "vless://  trojan://  vmess://",
  "Cloudflare edge fronting",
  "54 clean IPs",
  "× 6 TLS ports",
  "1 template → 1000 configs",
  "UUID & SNI preserved",
  "dedup by key",
  "base64 subscription",
  "v2rayNG · sing-box · Clash",
];

function Ticker() {
  const items = [...tickerItems, ...tickerItems];
  return (
    <div className="relative overflow-hidden border-y border-white/6 bg-ink-2/70 py-3.5" dir="ltr" aria-hidden>
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-28 bg-gradient-to-r from-ink to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-28 bg-gradient-to-l from-ink to-transparent" />
      <div className="flex w-max animate-marquee items-center gap-8">
        {items.map((t, i) => (
          <span key={i} className="flex items-center gap-8 font-mono text-xs tracking-wider text-fog/70 whitespace-nowrap">
            {t}
            <span className="size-1.5 rounded-full bg-cf/60" />
          </span>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [sources, setSources] = useState<SourceState[]>(() =>
    DEFAULT_SOURCES.map((s) => ({
      ...s,
      enabled: s.defaultOn,
      status: "idle",
      count: 0,
      rejected: 0,
    })),
  );
  const [entries, setEntries] = useState<ConfigEntry[]>([]);
  const [busy, setBusy] = useState(false);
  const [proxyUrl, setProxyUrl] = useState(DEFAULT_PROXY_URL);

  const patch = (id: string, p: Partial<SourceState>) =>
    setSources((arr) => arr.map((s) => (s.id === id ? { ...s, ...p } : s)));

  const fetchOne = async (id: string, useProxy: boolean) => {
    const src = sources.find((s) => s.id === id);
    if (!src || src.status === "loading") return;
    patch(id, { status: "loading", error: undefined });
    const url = useProxy ? `${proxyUrl || DEFAULT_PROXY_URL}${encodeURIComponent(src.url)}` : src.url;
    try {
      const text = await fetchText(url);
      const { entries: list, rejected } = parseSubscription(text, src.name);
      if (!list.length) throw new Error("nothing parsed — فرمت متن، ساب نبود");
      setEntries((prev) => [...prev, ...list]);
      patch(id, { status: "ok", count: list.length, rejected });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      patch(id, {
        status: "fail",
        error:
          /Abort|timeout|timed out/i.test(msg)
            ? "timeout 14s — اتصال خیلی کند بود"
            : /Failed to fetch|NetworkError|CORS|load failed/i.test(msg)
              ? "CORS بلاک یا اتصال ناموفق — «تلاش با پروکسی» را بزن"
              : msg,
      });
    }
  };

  const fetchAll = async () => {
    setBusy(true);
    try {
      for (const s of sources.filter((x) => x.enabled)) {
        // eslint-disable-next-line no-await-in-loop
        await fetchOne(s.id, false);
      }
    } finally {
      setBusy(false);
    }
  };

  const addSource = (name: string, url: string) => {
    setSources((arr) => [
      ...arr,
      {
        id: `c-${Date.now()}`,
        name: name || `منبع ${arr.filter((x) => x.isCustom).length + 1}`,
        url,
        enabled: true,
        status: "idle",
        count: 0,
        rejected: 0,
        isCustom: true,
        note: url.includes("workers.dev") ? "ساب شخصی BPB — احتمالاً به پروکسی نیاز دارد" : undefined,
      },
    ]);
  };

  const unique = useMemo(() => dedup(entries), [entries]);
  const boostedCount = useMemo(() => entries.filter((e) => e.boosted).length, [entries]);
  const okSources = sources.filter((s) => s.status === "ok").length;

  return (
    <div className="noise relative min-h-screen bg-ink text-white selection:bg-cf selection:text-ink">
      <Nav />
      <main>
        <HubTop total={entries.length} unique={unique.length} boosted={boostedCount} sourcesOk={okSources} />
        <Ticker />
        <Sources
          sources={sources}
          setSources={setSources}
          busy={busy}
          onFetchAll={fetchAll}
          onFetchOne={fetchOne}
          onAdd={addSource}
          proxyUrl={proxyUrl}
          setProxyUrl={setProxyUrl}
        />
        <Multiplier onGenerated={(list) => setEntries((prev) => [...list, ...prev])} />
        <Results entries={unique} onClear={() => setEntries([])} />
      </main>
      <Footer />
    </div>
  );
}
