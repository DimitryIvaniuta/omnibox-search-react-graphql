// - Debounced typeahead powered by Omnibox (contacts group only)
// - Shows top N contacts with title/subtitle; stores contactId (string | null)
// - Uses generated hooks only (no `graphql(...)`)

import { useEffect, useMemo, useRef, useState } from "react";
import { useOmniboxQuery } from "@/generated/omnibox/graphql"; // generated hook name from your codegen
import clsx from "clsx";

type Props = {
    value: string | null;
    onChange: (contactId: string | null) => void;
    placeholder?: string;
    limitPerGroup?: number;
};

export default function ContactPicker({
                                          value,
                                          onChange,
                                          placeholder = "Search contacts…",
                                          limitPerGroup = 8,
                                      }: Props) {
    const [q, setQ] = useState("");
    const [open, setOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // debounce 250ms
    const [debounced, setDebounced] = useState(q);
    useEffect(() => {
        const t = setTimeout(() => setDebounced(q.trim()), 250);
        return () => clearTimeout(t);
    }, [q]);

    const { data, loading } = useOmniboxQuery({
        variables: { q: debounced, limitPerGroup },
        skip: debounced.length === 0,
        fetchPolicy: "cache-first",
    });

    const options = useMemo(
        () => data?.omnibox?.contacts ?? [],
        [data]
    );

    const onPick = (id: string) => {
        onChange(id);
        setOpen(false);
    };

    useEffect(() => {
        const onDoc = (e: MouseEvent) => {
            if (!inputRef.current) return;
            if (!inputRef.current.parentElement?.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", onDoc);
        return () => document.removeEventListener("mousedown", onDoc);
    }, []);

    const selectedLabel = useMemo(() => {
        // If we have current results and selected value is among them, show its title; otherwise show id
        const found = options.find((o) => o.contactId === value);
        return found ? found.title : value ?? "";
    }, [options, value]);

    return (
        <div className="position-relative">
            <input
                ref={inputRef}
                className="form-control"
                placeholder={placeholder}
                value={open ? q : selectedLabel}
                onFocus={() => {
                    setOpen(true);
                    setTimeout(() => inputRef.current?.select(), 0);
                }}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Escape") { setOpen(false); (e.target as HTMLInputElement).blur(); }
                    if (e.key === "Enter" && options.length > 0) onPick(options[0].contactId);
                }}
            />

            {/* dropdown */}
            {open && (
                <div className="dropdown-menu show w-100 shadow-sm" style={{ maxHeight: 280, overflow: "auto" }}>
                    {loading && <div className="dropdown-item text-muted">Searching…</div>}
                    {!loading && options.length === 0 && (
                        <div className="dropdown-item text-muted">No contacts</div>
                    )}

                    {!loading &&
                        options.map((c) => (
                            <button
                                key={c.id}
                                type="button"
                                className={clsx("dropdown-item d-flex justify-content-between align-items-center", {
                                    active: c.contactId === value,
                                })}
                                onClick={() => onPick(c.contactId)}
                                title={c.subtitle ?? ""}
                            >
                                <span className="text-truncate">{c.title}</span>
                                {typeof c.score === "number" && (
                                    <small className="ms-2 text-muted">{Math.round(c.score * 100)}%</small>
                                )}
                            </button>
                        ))}
                </div>
            )}

            {/* clear selection */}
            {value && (
                <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary mt-2"
                    onClick={() => onChange(null)}
                >
                    Clear
                </button>
            )}
        </div>
    );
}
