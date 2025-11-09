import { useEffect, useMemo, useRef, useState, useLayoutEffect } from "react";
import clsx from "clsx";
import { useOmniboxQuery } from "@/generated/omnibox/graphql";
import { omniboxClient } from "@/apollo/omniboxClient";

/** Discriminated union for result kind */
type Kind = "contact" | "listing" | "transaction" | "product" | "mailing" | "referral";

/** Flat hit used by the UI and the onPick callback */
export type OmniboxHit = {
    kind: Kind;
    id: string;
    title: string;
    subtitle?: string;
    score?: number;
};

type Props = {
    placeholder?: string;
    limitPerGroup?: number;
    onPick: (hit: OmniboxHit) => void;
};

/* === Icon: Search-house (inherits currentColor) === */
function SearchHouseIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            {...props}
        >
            {/* house */}
            <path d="M3 11.5L12 4l9 7.5" />
            <path d="M5 10.5V20h6v-5h2v5h6v-9.5" />
            {/* magnifier */}
            <circle cx="16.5" cy="8.5" r="2.25" />
            <line x1="18.2" y1="10.2" x2="20.2" y2="12.2" />
        </svg>
    );
}

export default function OmniboxSearchBar({
                                             placeholder = "Search… contacts, listings, transactions",
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

    // Omnibox query (correct client)
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
                const id =
                    x.contactId ||
                    x.listingId ||
                    x.transactionId ||
                    x.productId ||
                    x.mailingId ||
                    x.referralId;
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
            contact: [],
            listing: [],
            transaction: [],
            product: [],
            mailing: [],
            referral: [],
        };
        for (const h of hits) groups[h.kind].push(h);

        const order: Kind[] = ["contact", "listing", "transaction", "product", "mailing", "referral"];
        const labeled = order
            .map((k) => ({ label: labelOf(k), kind: k, rows: groups[k] }))
            .filter((g) => g.rows.length > 0);

        return { flat: hits, grouped: labeled };
    }, [data]);

    // Open while typing, close when cleared
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

    // Map global index to grouped index for rendering
    const indexFor = (gi: number, ri: number) =>
        grouped.slice(0, gi).reduce((acc, g) => acc + g.rows.length, 0) + ri;

    /* ===== Dropdown width: exactly input width; positioned after label ===== */
    const [dropDims, setDropDims] = useState<{ left: number; width: number }>({ left: 0, width: 0 });

    const recomputeDropdown = () => {
        const labelW = labelRef.current?.offsetWidth ?? 0;
        const inputW = inputRef.current?.offsetWidth ?? 0;
        setDropDims({ left: labelW, width: inputW - 5 });
    };

    useLayoutEffect(() => {
        if (!open) return;
        recomputeDropdown();

        // Track resize of the wrapper (more robust than window resize alone)
        const obs = new (window as any).ResizeObserver(() => recomputeDropdown());
        if (obs && wrapRef.current) obs.observe(wrapRef.current);

        const onWinResize = () => recomputeDropdown();
        window.addEventListener("resize", onWinResize);

        return () => {
            window.removeEventListener("resize", onWinResize);
            obs?.disconnect?.();
        };
        // re-evaluate when dropdown opens or results change (height may affect scrollbar)
    }, [open, dq]);

    return (
        <div
            ref={wrapRef}
            className="omnibox mx-auto position-relative"
            style={{ minWidth: 360, maxWidth: 720 }}
        >
            {/* Pill label + input */}
            <div className="input-group shadow-sm rounded-pill omnibox-group">
        <span
            ref={labelRef}
            className="input-group-text bg-white border-end-0 rounded-start-pill omnibox-label"
            aria-label="Search"
        >
          <SearchHouseIcon className="me-1" />
          <span className="visually-hidden">Search</span>
        </span>
                <input
                    ref={inputRef}
                    className="form-control border-start-0 rounded-end-pill ps-1 omnibox-input"
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
            </div>

            {/* Dropdown: category label + records on next lines */}
            {open && (
                <div
                    id="omnibox-dropdown"
                    ref={listRef}
                    className={clsx("dropdown-menu show shadow-sm mt-1 omnibox-menu")}
                    style={{
                        position: "absolute",
                        left: dropDims.left,
                        width: dropDims.width,
                        maxHeight: 460,
                        overflow: "auto",
                    }}
                    role="listbox"
                >
                    {loading && <div className="dropdown-item text-muted">Searching…</div>}

                    {!loading && dq && grouped.length === 0 && (
                        <div className="dropdown-item text-muted">No results</div>
                    )}

                    {!loading &&
                        grouped.map((g, gi) => (
                            <div key={g.kind} className="py-1">
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
                                            onClick={() => pick(x)}
                                            title={x.subtitle ?? ""}
                                        >
                                            <span className="fw-semibold text-truncate">{x.title}</span>
                                            {x.subtitle && (
                                                <small className="text-muted text-truncate">{x.subtitle}</small>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        ))}
                </div>
            )}

            {/* Minimal local styles (works with Bootstrap) */}
            <style>{`
        .omnibox-group { transition: box-shadow .15s ease; }
        .omnibox-input:focus { box-shadow: none; }
        .omnibox-group:focus-within { box-shadow: 0 0 0 .2rem rgba(13,110,253,.15); }
        .omnibox-label { border-color: var(--bs-border-color); color: var(--bs-body-color); }
        .omnibox-label svg { display: block; }
        .omnibox-menu { border-radius: 1rem; overflow: hidden; }
      `}</style>
        </div>
    );
}

/* Helpers */
function labelOf(k: Kind): string {
    switch (k) {
        case "contact":
            return "Contacts";
        case "listing":
            return "Listings";
        case "transaction":
            return "Transactions";
        case "product":
            return "Products";
        case "mailing":
            return "Mailings";
        case "referral":
            return "Referrals";
    }
}
