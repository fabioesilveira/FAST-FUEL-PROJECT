export function formatDate(iso: string | null) {
    if (!iso) return "-";
    return new Date(iso).toLocaleString();
}

export function formatPhoneUS(phone: string | null) {
    const digits = String(phone ?? "").replace(/\D/g, "");

    if (!digits) return "—";

    const d =
        digits.length === 11 && digits.startsWith("1")
            ? digits.slice(1)
            : digits;

    if (d.length !== 10) return phone;

    const a = d.slice(0, 3);
    const b = d.slice(3, 6);
    const c = d.slice(6);

    return `(${a}) ${b}-${c}`;
}