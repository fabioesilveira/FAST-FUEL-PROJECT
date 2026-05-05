import type { Sale } from "../components/orders/types";

export function formatDate(iso: string | null) {
  if (!iso) return "-";
  return new Date(iso).toLocaleString();
}

export function safeParseItems(items: any) {
  try {
    if (typeof items === "string") return JSON.parse(items);
    return items ?? [];
  } catch {
    return [];
  }
}

export function cleanProductName(name: string) {
  return String(name || "").split("/")[0].trim();
}

export function formatPayment(
  method?: Sale["payment_method"],
  status?: Sale["payment_status"]
) {
  const m = method ?? "card";

  const methodLabel =
    m === "apple_pay"
      ? "Apple Pay"
      : m === "google_pay"
        ? "Google Pay"
        : m === "cash"
          ? "Cash"
          : "Card";

  const statusLabel =
    status === "pending"
      ? "Pending"
      : status === "declined"
        ? "Declined"
        : status === "refunded"
          ? "Refunded"
          : "Approved";

  if (m === "cash") return `Pay on delivery • Cash`;

  return `${statusLabel} • ${methodLabel}`;
}

type AddrParts = {
  line1: string;
  line2: string;
  line3?: string;
};

function normalizeCountry(v?: string) {
  const s = String(v || "").trim().toLowerCase();
  if (!s) return "USA";
  if (["usa", "us", "u.s.", "u.s.a."].includes(s)) return "USA";
  if (s.includes("united states")) return "USA";
  return String(v).trim();
}

function parseAddressParts(addr: any): AddrParts | null {
  let a = addr;

  if (typeof addr === "string") {
    try {
      a = JSON.parse(addr);
    } catch {
      a = null;
    }
  }

  if (!a) return null;

  const streetRaw = a.street ?? a.line1 ?? "";
  const aptRaw = a.apt ?? a.line2 ?? "";
  const city = a.city ?? "";
  const state = a.state ?? a.region ?? "";
  const zip = a.zip ?? a.postalCode ?? "";
  const country = normalizeCountry(a.country ?? "");

  const street = String(streetRaw || "").split(",")[0].trim();
  const apt = String(aptRaw || "").trim();

  const line1 = [street, apt ? `Apt ${apt.replace(/^apt\s*/i, "").trim()}` : ""]
    .filter(Boolean)
    .join(" • ");

  const line2 = [String(city).trim(), String(state).trim(), String(zip).trim()]
    .filter(Boolean)
    .join(", ")
    .replace(/,\s*,/g, ",");

  const line3 = country ? country : undefined;

  const safe1 = line1.trim();
  const safe2 = line2.trim();

  if (!safe1 && !safe2 && !line3) return null;

  return {
    line1: safe1 || "-",
    line2: safe2 || "-",
    line3,
  };
}

export function addressOneLine(addr: any) {
  const p = parseAddressParts(addr);
  if (!p) return "-";
  return [p.line1, p.line2, p.line3].filter(Boolean).join(" • ");
}