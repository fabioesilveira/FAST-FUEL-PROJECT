export type DeliveryAddress = {
    street?: string;
    apt?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
};

export function formatDate(iso: string | null) {
    if (!iso) return "-";
    return new Date(iso).toLocaleString();
}

export function safeParseJson(value: any) {
    try {
        if (typeof value === "string") return JSON.parse(value);
        return value ?? null;
    } catch {
        return null;
    }
}

export function cleanProductName(name: any) {
    return String(name ?? "Item").split("/")[0].trim();
}

export function onlyStreet(v?: string) {
    return String(v || "").split(",")[0].trim();
}

export function normalizeCountry(v?: string) {
    const s = String(v || "").trim().toLowerCase();

    if (!s) return "USA";
    if (["usa", "us", "u.s.", "u.s.a."].includes(s)) return "USA";
    if (s.includes("united states")) return "USA";

    return String(v).trim();
}

export function addressToLines(addr: any) {
    const a = safeParseJson(addr) as DeliveryAddress | null;

    if (!a) return null;

    const street = onlyStreet(a.street ?? "");
    const aptRaw = String(a.apt ?? "").trim();
    const apt = aptRaw ? `Apt ${aptRaw.replace(/^apt\s*/i, "").trim()}` : "";

    const city = String(a.city ?? "").trim();
    const state = String(a.state ?? "").trim();
    const zip = String(a.zip ?? "").trim();
    const country = normalizeCountry(a.country ?? "");

    const line1 = [street, apt].filter(Boolean).join(" • ");
    const line2 = [city, state, zip, country].filter(Boolean).join(", ");

    if (!line1 && !line2) return null;

    return { line1: line1 || "-", line2 };
}