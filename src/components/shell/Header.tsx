import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { ApolloProvider } from "@apollo/client";
import { omniboxClient } from "@/apollo/omniboxClient";
import { useOmniboxLazyQuery } from "@/generated/omnibox/graphql";
import { useNavigate, Link } from "react-router-dom";
import clsx from "clsx";

/**
 * Header (outer) — isolates the omnibox traffic to the omnibox Apollo client.
 */
const Header = ()=> {
    return (
        <ApolloProvider client={omniboxClient}>
            <HeaderInner />
        </ApolloProvider>
    );
}

/**
 * HeaderInner — debounced omnibox with in-flight cancellation + a11y keyboard nav.
 */
function HeaderInner() {
    const [q, setQ] = useState("");
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState<number>(-1); // keyboard highlight
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const nav = useNavigate();

    // Generated hook (lazy) — no gql() usage anywhere
    const [run, { data, loading }] = useOmniboxLazyQuery({ fetchPolicy: "no-cache" });

    // AbortController per request (cancels in-flight on new keystroke)
    const abortRef = useRef<AbortController | null>(null);

    const issueSearch = useCallback(
        (term: string) => {
            abortRef.current?.abort();
            if (!term.trim()) return;

            const controller = new AbortController();
            abortRef.current = controller;

            run({
                variables: { q: term, limitPerGroup: 5 },
                context: { fetchOptions: { signal: controller.signal } }
            });
        },
        [run]
    );

    // 250ms debounce
    const debounced = useMemo(() => {
        let t: number | undefined;
        return (val: string) => {
            if (t) window.clearTimeout(t);
            t = window.setTimeout(() => issueSearch(val), 250);
        };
    }, [issueSearch]);

    useEffect(() => {
        if (!q.trim()) {
            setOpen(false);
            setActiveIndex(-1);
        }
    }, [q]);

    useEffect(() => {
        return () => abortRef.current?.abort(); // cancel on unmount
    }, []);

    const results = data?.omnibox;
    type Row = { id: string; title: string; subtitle?: string | null; score?: number | null; _route: string };
    const grouped: { label: string; rows: Row[] }[] = useMemo(() => {
        if (!results) return [];
        const collect = <T extends { id: string; title: string; subtitle?: string | null; score?: number | null }>(
            arr: T[] | null | undefined,
            mapRoute: (t: T) => string
        ): Row[] => (arr ?? []).map((t) => ({ ...t, _route: mapRoute(t) }));

        return [
            { label: "Contacts",     rows: collect(results.contacts,    (t: any) => `/contacts/${t.contactId}`) },
            { label: "Listings",     rows: collect(results.listings,    (t: any) => `/listings/${t.listingId}`) },
            { label: "Transactions", rows: collect(results.transactions,(t: any) => `/transactions/${t.transactionId}`) },
            { label: "Referrals",    rows: collect(results.referrals,   (_: any) => "#") },
            { label: "Products",     rows: collect(results.products,    (_: any) => "#") },
            { label: "Mailings",     rows: collect(results.mailings,    (_: any) => "#") }
        ].filter(g => g.rows.length > 0);
    }, [results]);

    const flat: Row[] = useMemo(() => grouped.flatMap(g => g.rows), [grouped]);

    const openRow = (row: Row) => {
        setOpen(false);
        setQ("");
        setActiveIndex(-1);
        if (row._route !== "#") nav(row._route);
    };

    // keyboard support
    const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (!open && (e.key === "ArrowDown" || e.key === "Enter")) {
            setOpen(true);
            return;
        }
        if (!flat.length) return;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIndex((i) => (i + 1) % flat.length);
            listRef.current?.querySelector<HTMLElement>(`[data-idx="${(activeIndex + 1) % flat.length}"]`)?.focus();
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex((i) => (i - 1 + flat.length) % flat.length);
            listRef.current?.querySelector<HTMLElement>(`[data-idx="${(activeIndex - 1 + flat.length) % flat.length}"]`)?.focus();
        } else if (e.key === "Enter" && activeIndex >= 0) {
            e.preventDefault();
            openRow(flat[activeIndex]);
        } else if (e.key === "Escape") {
            setOpen(false);
            setActiveIndex(-1);
            inputRef.current?.focus();
        }
    };

    return (
        <header className="position-sticky top-0 bg-light border-bottom" style={{ zIndex: 1030 }}>
            <div className="container-fluid d-flex align-items-center gap-3 py-2">
                <Link to="/" className="navbar-brand fw-semibold mb-0 text-decoration-none">Omnibox</Link>

                <div className="position-relative flex-grow-1" style={{ maxWidth: 640 }}>
                    <label className="visually-hidden" htmlFor="global-search">Search</label>
                    <input
                        id="global-search"
                        ref={inputRef}
                        className="form-control"
                        placeholder="Search across contacts, listings, transactions…"
                        value={q}
                        onFocus={() => setOpen(!!q.trim())}
                        onChange={(e) => {
                            const val = e.target.value;
                            setQ(val);
                            setOpen(!!val.trim());
                            setActiveIndex(-1);
                            debounced(val);
                        }}
                        onKeyDown={onKeyDown}
                        autoComplete="off"
                        role="combobox"
                        aria-expanded={open}
                        aria-controls="omnibox-dropdown"
                        aria-autocomplete="list"
                    />

                    {open && (
                        <div
                            id="omnibox-dropdown"
                            className="dropdown-menu show w-100 shadow p-0"
                            role="listbox"
                            ref={listRef}
                        >
                            {loading && <div className="dropdown-item text-muted">Searching…</div>}

                            {!loading && grouped.length === 0 && q.trim() && (
                                <div className="dropdown-item text-muted">No results</div>
                            )}

                            {!loading && grouped.map((g, gi) => (
                                <div key={g.label} className="py-1">
                                    <div className="dropdown-header text-uppercase small">{g.label}</div>
                                    {g.rows.map((row, ri) => {
                                        const idx = grouped.slice(0, gi).reduce((s, cur) => s + cur.rows.length, 0) + ri;
                                        const pct = Math.max(0, Math.min(100, Math.round((row.score ?? 0) * 100)));
                                        return (
                                            <button
                                                key={row.id}
                                                type="button"
                                                role="option"
                                                data-idx={idx}
                                                aria-selected={activeIndex === idx}
                                                className={clsx(
                                                    "dropdown-item d-flex flex-column text-start",
                                                    activeIndex === idx && "active"
                                                )}
                                                onMouseEnter={() => setActiveIndex(idx)}
                                                onClick={() => openRow(row)}
                                            >
                                                <span className="fw-semibold">{row.title}</span>
                                                {row.subtitle && <small className="text-muted">{row.subtitle}</small>}
                                                <div className="progress mt-1" aria-hidden style={{ height: 3 }}>
                                                    <div className="progress-bar" style={{ width: `${pct}%` }} />
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <nav className="d-none d-md-flex align-items-center gap-3">
                    <Link to="/contacts" className="text-decoration-none">Contacts</Link>
                    <Link to="/listings" className="text-decoration-none">Listings</Link>
                    <Link to="/transactions" className="text-decoration-none">Transactions</Link>
                </nav>
            </div>
        </header>
    );
}

export default Header;