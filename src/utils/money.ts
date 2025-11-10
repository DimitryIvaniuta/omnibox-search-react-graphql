import Decimal from "decimal.js";

// Universal price formatter for Money { amount, currency }
// - Accepts Decimal | string | number in amount
// - Null/undefined -> "—"
// - Default: 0–2 fraction digits, locale-aware thousands, appends currency code
export type MoneyLike =
    | { amount: unknown; currency: string }
    | null
    | undefined;

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

export function formatMoney(
    money: MoneyLike,
    opts?: {
        locale?: string;
        /** "code" -> "12,345.67 USD" (default), "currency" → "US$12,345.67" when possible */
        style?: "code" | "currency";
        minimumFractionDigits?: number;
        maximumFractionDigits?: number;
    }
): string {
    if (!money) return "—";

    const {
        locale = undefined,
        style = "code",
        minimumFractionDigits = 0,
        maximumFractionDigits = 2,
    } = opts || {};

    // Extract amount as string first (Decimal-safe), then to number if reasonable
    let asStr =
        money.amount == null
            ? ""
            : typeof money.amount === "string"
                ? money.amount
                : (money.amount as any).toString
                    ? (money.amount as any).toString()
                    : String(money.amount);

    if (!asStr) return "—";

    // Try to format via Intl.NumberFormat; fall back to raw string if not finite
    const n = Number(asStr);
    const canNumberFormat = Number.isFinite(n);

    if (style === "currency" && canNumberFormat) {
        try {
            return new Intl.NumberFormat(locale, {
                style: "currency",
                currency: money.currency,
                minimumFractionDigits,
                maximumFractionDigits,
            }).format(n);
        } catch {
            /* ignore and fall through to "code" style */
        }
    }

    // "code" style or fallback: format number with grouping, append currency code
    if (canNumberFormat) {
        const formatted = new Intl.NumberFormat(locale, {
            minimumFractionDigits,
            maximumFractionDigits,
        }).format(n);
        return `${formatted} ${money.currency}`;
    }

    // If amount can't be parsed to a number (extremely big), show string with thin spaces for groups
    const grouped = asStr.replace(/\B(?=(\d{3})+(?!\d))/g, "\u2009");
    return `${grouped} ${money.currency}`;
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

export const formatMoneyAmount = (
    amount: unknown,
    currency: string,
    opts?: Parameters<typeof formatMoney>[1]
) => formatMoney({ amount, currency }, opts);

/** Build MoneyInput payload for GraphQL (string amount), or null if invalid/empty */
export function toMoneyInput(text: string, currency: string) {
    const d = parseDecimal(text);
    if (!d) return null;
    return { amount: d.toString(), currency };
}
