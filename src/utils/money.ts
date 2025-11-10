import Decimal from "decimal.js";

export type Money = { amount: Decimal; currency: string };

const DECIMAL_RE = /^(\d+)([.,]\d{0,2})?$/; // 2 fraction digits; tweak if you need more

/** Returns normalized "1234.56" or null */
export function normalizeMoneyText(text: string): string | null {
    const t = text.trim().replace(/\s+/g, "");
    if (!t) return null;
    const m = DECIMAL_RE.exec(t.replace(",", "."));
    if (!m) return null;
    const [, int, frac] = m;
    return frac ? `${int}${frac.replace(",", ".")}` : int;
}

/** Parse to Decimal safely; returns null when invalid */
export function parseDecimal(text: string): Decimal | null {
    const norm = normalizeMoneyText(text);
    if (norm == null) return null;
    try {
        return new Decimal(norm);
    } catch {
        return null;
    }
}

/** Build MoneyInput payload for GraphQL (string amount), or null if invalid/empty */
export function toMoneyInput(text: string, currency: string) {
    const d = parseDecimal(text);
    if (!d) return null;
    return { amount: d.toString(), currency };
}
