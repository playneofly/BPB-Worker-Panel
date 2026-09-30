export interface SourceState {
  id: string;
  name: string;
  url: string;
  note?: string;
  badge?: string;
  enabled: boolean;
  status: "idle" | "loading" | "ok" | "fail";
  count: number;
  rejected: number;
  error?: string;
  isCustom?: boolean;
}
