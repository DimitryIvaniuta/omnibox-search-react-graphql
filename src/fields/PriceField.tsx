import { useEffect, useMemo, useState } from "react";
import type Decimal from "decimal.js";

/** GraphQL payload shape */
export type MoneyInput = { amount: string; currency: string };

type Props<FormShape extends object> = {
    /** Parent form object (from useState in the editor) */
    form: FormShape;
    /** Parent form setter: setForm(prev => ({ ...prev, price: … })) */
    setForm: (updater: (prev: FormShape) => FormShape) => void;

    /** Field name in the form to write to (default: 'price') */
    name?: keyof FormShape;

    /** Existing server value (Decimal|string OK) – used to prefill the input */
    value?: { amount: Decimal | string; currency: string } | null;

    /** UI bits */
    label?: string;
    required?: boolean;
    defaultCurrency?: string;
    disabled?: boolean;
    className?: string;
};

/* ── helpers (no Decimal.js at runtime) ─────────────────────────────── */

const DECIMAL_RE = /^(\d+)([.,]\d{0,2})?$/; // allow 0..2 fraction digits
const DIGITS = "0123456789";

function normalizeMoneyText(t: string): string | null {
    const raw = t.trim().replace(/\s+/g, "");
    if (!raw) return null;
    const withDot = raw.replace(",", ".");
    const m = DECIMAL_RE.exec(withDot);
    if (!m) return null;
    const [, i, frac] = m;
    return frac ? `${i}${frac.replace(",", ".")}` : i;
}

function isNavKey(e: React.KeyboardEvent<HTMLInputElement>) {
    const k = e.key;
    return (
        k === "Backspace" ||
        k === "Delete" ||
        k === "ArrowLeft" ||
        k === "ArrowRight" ||
        k === "Home" ||
        k === "End" ||
        k === "Tab" ||
        e.ctrlKey ||
        e.metaKey
    );
}

export default function PriceField<FormShape extends Record<string, any>>(
    {
        form,
        setForm,
        name,
        value = null,
        label = "Price",
        required,
        defaultCurrency = "USD",
        disabled,
        className,
    }: Props<FormShape>) {
    const fieldName = (name ?? ("price" as keyof FormShape)) as string;

    // Local UI state (text + currency); parent does NOT track price at all
    const [text, setText] = useState<string>("");
    const [currency, setCurrency] = useState<string>(defaultCurrency);

    // Prefill from server/parent value (Decimal or string amount)
    useEffect(() => {
        if (!value) {
            setText("");
            setCurrency(defaultCurrency);
            // also clear parent form's price
            setForm((prev) => ({ ...prev, [fieldName]: null }) as FormShape);
            return;
        }
        const amt = typeof value.amount === "string" ? value.amount : value.amount.toString();
        setText(amt ?? "");
        setCurrency(value.currency ?? defaultCurrency);
        // write normalized value (if valid) into form immediately
        const norm = amt ? normalizeMoneyText(amt) : null;
        setForm((prev) => ({ ...prev, [fieldName]: norm ? { amount: norm, currency: value.currency ?? defaultCurrency } : null }) as FormShape);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value, defaultCurrency]);

    // Derived validity + normalized string
    const normalized = useMemo(() => (text ? normalizeMoneyText(text) : ""), [text]);
    const valid = useMemo(() => (text.trim() ? normalizeMoneyText(text) !== null : !required), [text, required]);

    // Push updates into parent form whenever user edits (only when valid or empty)
    useEffect(() => {
        const next =
            normalized && valid
                ? ({ amount: normalized, currency } as MoneyInput)
                : text.trim()
                    ? null // invalid – store null
                    : null; // empty – store null

        setForm((prev) => ({ ...prev, [fieldName]: next }) as FormShape);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [normalized, currency, valid]);

    // Prevent non-numeric typing
    const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (disabled) return;
        if (isNavKey(e)) return;
        if (DIGITS.includes(e.key)) return;
        if ((e.key === "." || e.key === ",") && !/[.,]/.test(e.currentTarget.value || "")) return;
        e.preventDefault();
    };

    // Sanitize paste
    const onPaste: React.ClipboardEventHandler<HTMLInputElement> = (e) => {
        if (disabled) return;
        const paste = (e.clipboardData.getData("text") || "").trim();
        if (!paste) return;
        let out = "",
            sep = false;
        for (const ch of paste) {
            if (DIGITS.includes(ch)) out += ch;
            else if ((ch === "." || ch === ",") && !sep) {
                out += ".";
                sep = true;
            }
        }
        const norm = normalizeMoneyText(out);
        if (norm) {
            e.preventDefault();
            setText(norm);
        }
    };

    // Gentle normalize on blur
    const onBlur: React.FocusEventHandler<HTMLInputElement> = (e) => {
        const n = normalizeMoneyText(e.currentTarget.value);
        if (n !== null) setText(n);
    };

    return (
        <div className={className}>
            <label className="form-label">
                {label} {required && <span className="text-danger">*</span>}
            </label>

            <div className="input-group">
                <input
                    className={`form-control${!valid ? " is-invalid" : ""}`}
                    type="text"
                    inputMode="decimal"
                    autoComplete="off"
                    placeholder="1234.56"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={onKeyDown}
                    onPaste={onPaste}
                    onBlur={onBlur}
                    disabled={disabled}
                    aria-invalid={!valid}
                    aria-describedby="price-help"
                />
                <select
                    className="form-select"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    disabled={disabled}
                    style={{ maxWidth: 120 }}
                >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="PLN">PLN</option>
                </select>
            </div>

            {!valid ? (
                <div className="invalid-feedback d-block">Enter a valid amount (e.g. 1234.56)</div>
            ) : text ? (
                <div id="price-help" className="form-text">
                    Normalized: {normalized} {currency}
                </div>
            ) : null}
        </div>
    );
}
