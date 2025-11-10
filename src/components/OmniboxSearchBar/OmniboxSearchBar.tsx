import { useEffect, useMemo, useRef, useState, useLayoutEffect } from "react";
import clsx from "clsx";
import { useOmniboxQuery } from "@/generated/omnibox/graphql";
import { omniboxClient } from "@/apollo/omniboxClient";
import "./OmniboxSearchBar.scss";

type Kind = "contact" | "listing" | "transaction" | "product" | "mailing" | "referral";
export type OmniboxHit = { kind: Kind; id: string; title: string; subtitle?: string; score?: number };

type Props = {
    placeholder?: string;
    limitPerGroup?: number;
    onPick: (hit: OmniboxHit) => void;
};

/* Icon: Search-house */
function SearchHouseIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
            <path d="M3 11.5L12 4l9 7.5" />
            <path d="M5 10.5V20h6v-5h2v5h6v-9.5" />
            <circle cx="16.5" cy="8.5" r="2.25" />
            <line x1="18.2" y1="10.2" x2="20.2" y2="12.2" />
        </svg>
    );
}

/* Icon: small × (close) */
function XIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
            <line x1="5" y1="5" x2="15" y2="15" />
            <line x1="15" y1="5" x2="5" y2="15" />
        </svg>
    );
}

export default function OmniboxSearchBar({
                                             placeholder = "contacts, listings, transactions",
                                             limitPerGroup = 5,
                                             onPick,
                                         }: Props) {
    const wrapRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const labelRef = useRef<HTMLSpanElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    const [q, setQ] = useState("");
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);

    // Debounce
    const [dq, setDq] = useState("");
    useEffect(() => {
        const t = window.setTimeout(() => setDq(q.trim()), 250);
        return () => window.clearTimeout(t);
    }, [q]);

    // Omnibox query
    const { data, loading } = useOmniboxQuery({
        variables: { q: dq, limitPerGroup },
        skip: dq.length === 0,
        client: omniboxClient,
        fetchPolicy: "cache-first",
    });

    // Flatten + group
    const { flat, grouped } = useMemo(() => {
        const hits: OmniboxHit[] = [];
        const push = (kind: Kind, arr?: any[]) =>
            arr?.forEach((x) => {
                const id = x.contactId || x.listingId || x.transactionId || x.productId || x.mailingId || x.referralId;
                if (!id) return;
                hits.push({
                    kind,
                    id: String(id),
                    title: String(x.title ?? id),
                    subtitle: x.subtitle ?? undefined,
                    score: typeof x.score === "number" ? x.score : undefined,
                });
            });

        if (data?.omnibox) {
            push("contact", data.omnibox.contacts);
            push("listing", data.omnibox.listings);
            push("transaction", data.omnibox.transactions);
            push("product", data.omnibox.products);
            push("mailing", data.omnibox.mailings);
            push("referral", data.omnibox.referrals);
        }

        const groups: Record<Kind, OmniboxHit[]> = {
            contact: [], listing: [], transaction: [], product: [], mailing: [], referral: [],
        };
        for (const h of hits) groups[h.kind].push(h);

        const order: Kind[] = ["contact", "listing", "transaction", "product", "mailing", "referral"];
        const labeled = order.map((k) => ({ label: labelOf(k), kind: k, rows: groups[k] })).filter((g) => g.rows.length > 0);

        return { flat: hits, grouped: labeled };
    }, [data]);

    // Open while typing; close when cleared
    const onChangeInput: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const val = e.target.value;
        setQ(val);
        const hasText = val.trim().length > 0;
        setOpen(hasText);
        if (!hasText) setActiveIndex(-1);
    };
    const onFocusInput: React.FocusEventHandler<HTMLInputElement> = () => {
        if (q.trim()) setOpen(true);
    };

    // Outside click -> close
    useEffect(() => {
        const onOutside = (e: MouseEvent) => {
            if (!wrapRef.current) return;
            if (!wrapRef.current.contains(e.target as Node)) {
                setOpen(false);
                setActiveIndex(-1);
            }
        };
        document.addEventListener("pointerdown", onOutside);
        return () => document.removeEventListener("pointerdown", onOutside);
    }, []);

    // Keyboard navigation (acts on flat array)
    const pick = (hit: OmniboxHit) => {
        onPick(hit);
        setOpen(false);
        setActiveIndex(-1);
        setTimeout(() => inputRef.current?.blur(), 0);
    };

    const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
        const hasText = q.trim().length > 0;
        if (!open && (e.key === "ArrowDown" || e.key === "Enter")) {
            if (hasText) setOpen(true);
            return;
        }
        if (!flat.length) return;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            const next = (activeIndex + 1) % flat.length;
            setActiveIndex(next);
            listRef.current?.querySelector<HTMLButtonElement>(`[data-idx="${next}"]`)?.focus();
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            const prev = (activeIndex - 1 + flat.length) % flat.length;
            setActiveIndex(prev);
            listRef.current?.querySelector<HTMLButtonElement>(`[data-idx="${prev}"]`)?.focus();
        } else if (e.key === "Enter" && activeIndex >= 0) {
            e.preventDefault();
            pick(flat[activeIndex]);
        } else if (e.key === "Escape") {
            setOpen(false);
            setActiveIndex(-1);
            inputRef.current?.focus();
        }
    };

    const indexFor = (gi: number, ri: number) =>
        grouped.slice(0, gi).reduce((acc, g) => acc + g.rows.length, 0) + ri;

    /* Dropdown width = input width, positioned after label */
    const [dropDims, setDropDims] = useState<{ left: number; width: number }>({ left: 0, width: 0 });
    const recomputeDropdown = () => {
        const labelW = labelRef.current?.offsetWidth ?? 0;
        const inputW = inputRef.current?.offsetWidth ?? 0;
        setDropDims({ left: labelW - 30, width: inputW + 60 });
    };
    useLayoutEffect(() => {
        if (!open) return;
        recomputeDropdown();

        const obs = new (window as any).ResizeObserver(() => recomputeDropdown());
        if (obs && wrapRef.current) obs.observe(wrapRef.current);

        const onWinResize = () => recomputeDropdown();
        window.addEventListener("resize", onWinResize);

        return () => {
            window.removeEventListener("resize", onWinResize);
            obs?.disconnect?.();
        };
    }, [open, dq, q]);

    const hasText = q.trim().length > 0;
    const clear = () => {
        setQ("");
        setOpen(false);
        setActiveIndex(-1);
        inputRef.current?.focus();
    };

    return (
        <div ref={wrapRef} className="omnibox mx-auto position-relative" style={{ minWidth: 360, maxWidth: 720 }}>
            {/* Pill group: icon label | input | clear button (shows only when text present) */}
            <div className="input-group shadow-sm rounded-pill omnibox-group">

                {/* Left label (icon) */}
                <span
                    ref={labelRef}
                    className="input-group-text bg-white border-end-0 rounded-start-pill omnibox-label"
                    aria-label="Search"
                >
                  <SearchHouseIcon className="me-1" />
                  <span className="visually-hidden">Search</span>
                </span>

                {/* The input: when clear button is visible, remove right rounding to keep pill shape consistent */}
                <input
                    ref={inputRef}
                    className={clsx(
                        "form-control border-start-0 ps-1 omnibox-input",
                        hasText ? "border-end-0 rounded-0" : "rounded-end-pill"
                    )}
                    placeholder={placeholder}
                    value={q}
                    onFocus={onFocusInput}
                    onChange={onChangeInput}
                    onKeyDown={onKeyDown}
                    autoComplete="off"
                    role="combobox"
                    aria-expanded={open}
                    aria-controls="omnibox-dropdown"
                    aria-autocomplete="list"
                />

                {/* Trailing clear control — keeps the pill rounded on the right */}
                <span
                    className={clsx(
                        "input-group-text bg-white rounded-end-pill omnibox-clear-wrap p-0", // <-- add omnibox-clear-wrap
                        hasText ? "border-start-0" : "border-0"
                    )}
                    aria-hidden={!hasText}
                    style={{ overflow: "hidden" }}
                >
          {hasText && (
              <button
                  type="button"
                  className={clsx("btn btn-link text-muted px-3 py-2 omnibox-clear-btn", hasText && "is-visible")}
                  onClick={clear}
                  aria-label="Clear search"
                  title="Clear"
              >
                  <XIcon />
              </button>
          )}
        </span>
            </div>

            {/* Dropdown: category header + records on next lines */}
            {open && grouped && grouped.length > 0 && (
                <div
                    id="omnibox-dropdown"
                    ref={listRef}
                    className={clsx("dropdown-menu show shadow-sm mt-0 omnibox-menu")}
                    style={{
                        position: "absolute",
                        left: dropDims.left,
                        width: dropDims.width,
                        maxHeight: 360,
                        overflow: "auto",
                    }}
                    role="listbox"
                >
                    {loading && <div className="dropdown-item text-muted">...</div>}

                    {!loading && dq && grouped.length === 0 && (
                        <div className="dropdown-item text-muted">No results</div>
                    )}

                    {!loading &&
                        grouped.map((g, gi) => {
                            return <>{g.rows && g.label && <div key={g.kind} className="py-0">
                                <div className="dropdown-header text-uppercase small">{g.label}</div>
                                {g.rows.map((x, ri) => {
                                    const flatIdx = indexFor(gi, ri);
                                    const isActive = activeIndex === flatIdx;
                                    return (
                                        <button
                                            key={`${x.kind}:${x.id}:${ri}`}
                                            data-idx={flatIdx}
                                            type="button"
                                            role="option"
                                            aria-selected={isActive}
                                            className={clsx(
                                                "dropdown-item d-flex flex-column align-items-start text-start",
                                                isActive && "active"
                                            )}
                                            onMouseEnter={() => setActiveIndex(flatIdx)}
                                            onClick={() => onPick(x)}
                                            title={x.subtitle ?? ""}
                                        >
                                            <span className="fw-semibold text-truncate">{x.title}</span>
                                            {x.subtitle && <small className="text-muted text-truncate">{x.subtitle}</small>}
                                        </button>
                                    );
                                })}
                            </div>}</>
                    })}
                </div>
            )}
        </div>
    );
}

function labelOf(k: Kind): string {
    switch (k) {
        case "contact": return "Contacts";
        case "listing": return "Listings";
        case "transaction": return "Transactions";
        case "product": return "Products";
        case "mailing": return "Mailings";
        case "referral": return "Referrals";
    }
}
