import { useEffect, useMemo, useRef, useState } from "react";
import { ApolloProvider } from "@apollo/client";
import { omniboxClient } from "@/apollo/omniboxClient";
import { useOmniboxLazyQuery } from "@/generated/omnibox/graphql"; // generated hook
import { useNavigate } from "react-router-dom";

export default function HeaderOmnibox() {
    return (
        <ApolloProvider client={omniboxClient}>
            <HeaderInner />
        </ApolloProvider>
    );
}

function HeaderInner() {
    const [q, setQ] = useState("");
    const [open, setOpen] = useState(false);
    const nav = useNavigate();

    // generated hook (lazy)
    const [run, { data, loading }] = useOmniboxLazyQuery({ fetchPolicy: "no-cache" });

    // cancel in-flight using AbortController per request
    const abortRef = useRef<AbortController | null>(null);

    const debounced = useMemo(() => {
        let t: any;
        return (val: string) => {
            clearTimeout(t);
            t = setTimeout(() => {
                if (!val.trim()) return;
                abortRef.current?.abort();
                const controller = new AbortController();
                abortRef.current = controller;

                // pass abort signal via Apollo context
                run({
                    variables: { q: val, limitPerGroup: 5 },
                    context: { fetchOptions: { signal: controller.signal } }
                });
            }, 250);
        };
    }, [run]);

    useEffect(() => { if (!q.trim()) setOpen(false); }, [q]);

    const results = data?.omnibox;
    const groups = [
        { k: "contacts", items: results?.contacts ?? [] },
        { k: "listings", items: results?.listings ?? [] },
        { k: "transactions", items: results?.transactions ?? [] },
        { k: "referrals", items: results?.referrals ?? [] },
        { k: "products", items: results?.products ?? [] },
        { k: "mailings", items: results?.mailings ?? [] },
    ].filter(g => g.items.length);

    const openRecord = (k: string, it: any) => {
        setOpen(false); setQ("");
        if (k === "contacts") nav(`/contacts/${it.contactId}`);
        else if (k === "listings") nav(`/listings/${it.listingId}`);
        else if (k === "transactions") nav(`/transactions/${it.transactionId}`);
    };

    return (
        <header className="position-sticky top-0 bg-light border-bottom" style={{ zIndex: 1030 }}>
            <div className="container-fluid d-flex align-items-center gap-3 py-2">
                <div className="fw-bold">Omnibox</div>
                <div className="position-relative" style={{ minWidth: 420 }}>
                    <input
                        className="form-control"
                        placeholder="Search…"
                        value={q}
                        onFocus={() => setOpen(!!q.trim())}
                        onChange={(e) => {
                            const val = e.target.value;
                            setQ(val);
                            setOpen(!!val.trim());
                            debounced(val);
                        }}
                    />
                    {open && (
                        <div className="dropdown-menu show w-100 shadow">
                            {loading && <div className="dropdown-item text-muted">Searching…</div>}
                            {!loading && groups.length === 0 && q.trim() && (
                                <div className="dropdown-item text-muted">No results</div>
                            )}
                            {groups.map(g => (
                                <div key={g.k}>
                                    <div className="dropdown-header text-uppercase small">{g.k}</div>
                                    {g.items.map((it: any) => (
                                        <button
                                            key={it.id}
                                            className="dropdown-item d-flex flex-column"
                                            onClick={() => openRecord(g.k, it)}
                                        >
                                            <span className="fw-semibold">{it.title}</span>
                                            <small className="text-muted">{it.subtitle}</small>
                                            <div className="progress mt-1" role="progressbar" style={{ height: 3 }}>
                                                <div className="progress-bar" style={{ width: `${Math.round((it.score ?? 0) * 100)}%` }} />
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
