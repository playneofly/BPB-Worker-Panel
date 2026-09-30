// ─── پریست‌های پروژه ───

export interface SourcePreset {
  id: string;
  name: string;
  url: string;
  note: string;
  defaultOn: boolean;
  badge?: string;
}

export const DEFAULT_SOURCES: SourcePreset[] = [
  {
    id: "proxycollector",
    name: "ProxyCollector",
    url: "https://raw.githubusercontent.com/Mahdi0024/ProxyCollector/master/sub/proxies.txt",
    note: "مخزن گیت‌هابِ به‌روزکاربر — VLESS / Trojan / VMess",
    defaultOn: true,
    badge: "تأییدشده",
  },
  {
    id: "barryfar",
    name: "V2ray Configs (barry-far)",
    url: "https://raw.githubusercontent.com/barry-far/V2ray-Configs/main/All_Configs_Sub.txt",
    note: "یکی از معروف‌ترین آگریگیتورها — حجم بالا",
    defaultOn: true,
    badge: "حجم بالا",
  },
  {
    id: "epodonios",
    name: "Epodonios Configs",
    url: "https://raw.githubusercontent.com/Epodonios/v2ray-configs/main/All_Configs_Sub.txt",
    note: "آگریگیتور فعال دیگر — پشتیبان خوب",
    defaultOn: true,
  },
];

export const DEFAULT_PROXY_URL = "https://api.allorigins.win/raw?url=";

// ─── حوض IP تمیز کلودفلر — ۴۸ آی‌پی زنده، مرتب‌شده از سریع‌ترین ───
// نتایج اسکن واقعی HTTP:80 — مرده‌ها (۱۸۸.۱۱۴.* و ۱۰۴.۲۲.* و ...) حذف شدند
export const DEFAULT_CLEAN_IPS = `162.159.250.178
104.24.197.20
198.41.209.78
104.16.249.249
172.67.255.35
104.16.62.74
172.64.145.30
172.67.126.36
190.93.246.46
104.17.42.10
141.101.113.174
104.18.196.46
104.25.90.15
198.41.216.138
162.159.133.21
104.19.30.144
104.20.22.46
162.159.249.236
173.245.49.60
190.93.245.184
162.159.135.42
172.64.152.43
104.26.7.85
172.64.74.13
104.17.65.190
104.19.45.118
172.67.75.172
104.18.32.47
104.16.51.13
172.64.80.198
104.19.54.50
108.162.195.48
104.17.147.22
104.16.90.3
104.18.14.128
108.162.194.15
162.159.61.194
104.21.93.115
172.64.147.234
104.21.233.158
104.27.201.66
104.18.164.175
198.41.205.128
104.16.236.100
104.18.35.253
104.25.102.78`;

// ─── دامنه‌های CDN معروف کلادفلر (برای سناریوی پیشرفته‌ی جایگزینی آدرس) ───
export const DEFAULT_CDN_DOMAINS = `www.speedtest.net
www.npmjs.com
www.gstatic.com
medium.com
www.twitch.tv
discord.com
gitlab.com
www.whatsapp.com
portal.azure.com`;

export const TLS_PORTS = [
  { p: 443, label: "443", on: true },
  { p: 2053, label: "2053", on: false },
  { p: 2083, label: "2083", on: false },
  { p: 2087, label: "2087", on: false },
  { p: 2096, label: "2096", on: false },
  { p: 8443, label: "8443", on: false },
];

export const HTTP_PORTS = [
  { p: 80, label: "80", on: false },
  { p: 8080, label: "8080", on: false },
  { p: 8880, label: "8880", on: false },
  { p: 2052, label: "2052", on: false },
  { p: 2082, label: "2082", on: false },
  { p: 2095, label: "2095", on: false },
];
