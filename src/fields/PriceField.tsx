import { useEffect, useMemo, useRef, useState } from "react";
import { useController, useFormContext, useWatch } from "react-hook-form";

export type MoneyInput = { amount: string; currency: string };

type Props = {
    name: string;               // e.g. "price"
    label?: string;
    required?: boolean;
    defaultCurrency?: string;
    disabled?: boolean;
    className?: string;
};

const DIGIT = /\d/;

/* ── locale helpers ─────────────────────────────────────────────────── */
function detectGroupSep() {
    const s = Intl.NumberFormat().format(11111);
    return s.replace(/1/g, "") || " ";
}
function shownDecimalFromGroup(groupSep: string) {
    return groupSep === "," ? "." : ",";
}

/* ── text helpers ────────────────────────────────────────────────────── */
/** visible → canonical editable: "1234" | "1234.5" | "1234.56" */
function cleanToEditable(visible: string, shownDec: string): string {
    if (!visible) return "";
    const t = visible.replace(/[\s\u00A0]/g, "").replace(new RegExp(`\\${shownDec}`, "g"), ".");
    let out = "", hasDot = false;
    for (const ch of t) {
        if (DIGIT.test(ch)) out += ch;
        else if (ch === "." && !hasDot) { out += "."; hasDot = true; }
    }
    if (hasDot) {
        const [i, f = ""] = out.split(".");
        out = `${i}.${f.slice(0, 2)}`;
    }
    return out;
}
/** editable → visible, group integers; show decimal only if present */
function formatForDisplay(editable: string, groupSep: string, shownDec: string) {
    if (!editable) return "";
    const [i, f = ""] = editable.split(".");
    const grp = i.replace(/\B(?=(\d{3})+(?!\d))/g, groupSep);
    return editable.includes(".") ? `${grp}${shownDec}${f}` : grp;
}
/** map caret to “logical” index (digits + visible decimal) */
function caretToLogical(display: string, caret: number, shownDec: string) {
    let n = 0;
    for (let i = 0; i < Math.min(caret, display.length); i++) {
        const ch = display[i];
        if (DIGIT.test(ch) || ch === shownDec) n++;
    }
    return n;
}
/** map logical index back to caret in a given display string */
function logicalToCaret(display: string, logical: number, shownDec: string) {
    let n = 0;
    for (let i = 0; i < display.length; i++) {
        const ch = display[i];
        if (DIGIT.test(ch) || ch === shownDec) {
            n++;
            if (n === logical) return i + 1;
        }
    }
    return display.length;
}
/** count significant chars (digits + decimal) in a VISIBLE string */
function sigCount(display: string, shownDec: string) {
    let n = 0;
    for (const ch of display) if (DIGIT.test(ch) || ch === shownDec) n++;
    return n;
}

/* ── component ──────────────────────────────────────────────────────── */
export default function PriceField({
                                       name,
                                       label = "Price",
                                       required,
                                       defaultCurrency = "USD",
                                       disabled,
                                       className,
                                   }: Props) {
    const { control } = useFormContext();
    const { field, fieldState } = useController<{ [k: string]: MoneyInput | null }>({ name, control });

    // Watch external value so reset()/prefill can update us.
    const external = useWatch({ control, name }) as MoneyInput | null | undefined;

    const groupSep = useMemo(() => detectGroupSep(), []);
    const shownDec = useMemo(() => shownDecimalFromGroup(groupSep), [groupSep]);

    // Local state: canonical editable, display, currency.
    const [editable, setEditable] = useState<string>("");
    const [display, setDisplay] = useState<string>("");
    const [currency, setCurrency] = useState<string>(defaultCurrency);

    const inputRef = useRef<HTMLInputElement>(null);
    const lastPushed = useRef<string>("");   // JSON snapshot of last value we sent to RHF

    /* ---------- one-way sync FROM RHF (only if external change differs from our last push) ---------- */
    useEffect(() => {
        const extJSON = JSON.stringify(
            external ? { amount: String((external as any).amount), currency: external.currency } : null
        );
        if (extJSON === lastPushed.current) return; // ignore our own last write

        const amt = external?.amount ? String((external as any).amount) : "";
        const cur = external?.currency ?? defaultCurrency;

        const e = cleanToEditable(amt, shownDec);
        const d = formatForDisplay(e, groupSep, shownDec);

        setEditable(e);
        setDisplay(d);
        setCurrency(cur);
    }, [external, defaultCurrency, groupSep, shownDec]);

    /* ---------- push TO RHF whenever editable/currency become a valid value ---------- */
    useEffect(() => {
        const next = editable ? ({ amount: editable, currency } as MoneyInput) : (required ? null : null);
        const snap = JSON.stringify(next);
        if (snap !== lastPushed.current) {
            lastPushed.current = snap;
            field.onChange(next);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editable, currency, required]);

    /* ---------- typing guards ---------- */
    const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (disabled) return;
        const k = e.key;
        if (
            k === "Backspace" || k === "Delete" || k === "ArrowLeft" || k === "ArrowRight" ||
            k === "Home" || k === "End" || k === "Tab" || e.ctrlKey || e.metaKey
        ) return;

        if (DIGIT.test(k)) {
            // enforce max 2 decimals only when caret is after decimal
            const el = e.currentTarget;
            const curEditable = cleanToEditable(el.value, shownDec);
            if (curEditable.includes(".")) {
                const [i, f = ""] = curEditable.split(".");
                const caret = el.selectionStart ?? el.value.length;
                const logical = caretToLogical(formatForDisplay(curEditable, groupSep, shownDec), caret, shownDec);
                const dotLogical = caretToLogical(
                    formatForDisplay(i + "." /* temp dot for calc */, groupSep, shownDec),
                    Infinity,
                    shownDec
                );
                const caretInFrac = logical > dotLogical;
                if (caretInFrac && f.length >= 2) { e.preventDefault(); return; }
            }
            return;
        }
        if ((k === "," || k === ".") && !cleanToEditable(e.currentTarget.value, shownDec).includes(".")) return;
        e.preventDefault();
    };

    /* ---------- main onChange: compute next editable/display and preserve caret ---------- */
    const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const el = e.currentTarget;

        const prevDisplay = display;
        const prevCaret = el.selectionStart ?? prevDisplay.length;
        const prevLogical = caretToLogical(prevDisplay, prevCaret, shownDec);

        const nextEditable = cleanToEditable(el.value, shownDec);
        const nextDisplay = formatForDisplay(nextEditable, groupSep, shownDec);

        if (nextEditable !== editable || nextDisplay !== display) {
            setEditable(nextEditable);
            setDisplay(nextDisplay);

            // Adjust target logical pos by the change in significant chars (digits/decimal)
            const deltaSig = sigCount(nextDisplay, shownDec) - sigCount(prevDisplay, shownDec);
            const targetLogical = Math.max(0, prevLogical + deltaSig);

            // restore caret on the next frame
            requestAnimationFrame(() => {
                const node = inputRef.current;
                if (!node) return;
                const nextCaret = logicalToCaret(nextDisplay, targetLogical, shownDec);
                node.setSelectionRange(nextCaret, nextCaret);
            });
        }
    };

    const onPaste: React.ClipboardEventHandler<HTMLInputElement> = (e) => {
        if (disabled) return;
        const pasted = (e.clipboardData.getData("text") || "").trim();
        const nextEditable = cleanToEditable(pasted, shownDec);
        if (nextEditable || pasted === "") {
            e.preventDefault();
            const nextDisplay = formatForDisplay(nextEditable, groupSep, shownDec);
            setEditable(nextEditable);
            setDisplay(nextDisplay);
            requestAnimationFrame(() => {
                const node = inputRef.current;
                if (!node) return;
                const c = nextDisplay.length;
                node.setSelectionRange(c, c);
            });
        }
    };

    const onBlur: React.FocusEventHandler<HTMLInputElement> = (e) => {
        const ebl = cleanToEditable(e.currentTarget.value, shownDec);
        const disp = formatForDisplay(ebl, groupSep, shownDec);
        if (ebl !== editable) setEditable(ebl);
        if (disp !== display) setDisplay(disp);
    };

    return (
        <div className={className}>
            <label className="form-label">
                {label} {required && <span className="text-danger">*</span>}
            </label>

            <div className="input-group">
                <input
                    ref={inputRef}
                    className={`form-control${fieldState.invalid ? " is-invalid" : ""}`}
                    type="text"
                    inputMode="decimal"
                    autoComplete="off"
                    placeholder={``}
                    value={display}
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                    onPaste={onPaste}
                    onBlur={onBlur}
                    disabled={disabled}
                    aria-invalid={fieldState.invalid}
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

            {fieldState.error && (
                <div className="invalid-feedback d-block">{fieldState.error.message}</div>
            )}
        </div>
    );
}
