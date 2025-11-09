import { useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";

// GENERATED hooks: adjust import paths to your project
import { useOmniboxQuery } from "@/generated/omnibox/graphql";
import { useContactByIdQuery } from "@/generated/write-oltp/graphql";

// Apollo client instances
import { omniboxClient } from "@/apollo/omniboxClient";
import { writeClient } from "@/apollo/writeClient";

type Props = {
    value: string | null;                  // contactId
    onChange: (contactId: string | null) => void;
    placeholder?: string;
    limitPerGroup?: number;               // how many per group from omnibox
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

    // Debounce 250ms to limit omnibox calls
    const [debounced, setDebounced] = useState("");
    useEffect(() => {
        const t = setTimeout(() => setDebounced(q.trim()), 250);
        return () => clearTimeout(t);
    }, [q]);

    // 1) Search in OMNIBOX (port 8080) — NOTE the `client: omniboxClient`
    const { data: omni, loading: searching } = useOmniboxQuery({
        variables: { q: debounced, limitPerGroup },
        skip: debounced.length === 0,
        client: omniboxClient,
        fetchPolicy: "cache-first",
    });

    // Contacts hits from omnibox
    const options = useMemo(() => omni?.omnibox?.contacts ?? [], [omni]);

    // 2) When a contact is preselected, show its title by fetching from WRITE-OLTP
    const { data: byId } = useContactByIdQuery({
        variables: { id: value as string },
        skip: !value,
        client: writeClient,
        fetchPolicy: "cache-first",
    });

    // Prefer the live search label; else byId; else raw id
    const selectedLabel = useMemo(() => {
        if (!value) return "";
        const fromOmni = options.find((o) => o.contactId === value);
        if (fromOmni) return fromOmni.title ?? value;
        if (byId?.contact?.fullName) return byId.contact.fullName;
        return value;
    }, [value, options, byId]);

    // Close dropdown on clicks outside
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

    const pick = (id: string) => {
        onChange(id);
        setOpen(false);
    };

    return (
        <div className="position-relative">
            <input
                ref={inputRef}
                className="form-control"
                placeholder={placeholder}
                // When open: show the query text; when closed: show the selected label
                value={open ? q : selectedLabel}
                onFocus={() => {
                    setOpen(true);
                    setTimeout(() => inputRef.current?.select(), 0);
                }}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Escape") { setOpen(false); (e.target as HTMLInputElement).blur(); }
                    if (e.key === "Enter" && options.length > 0) pick(options[0].contactId);
                }}
            />

            {open && (
                <div className="dropdown-menu show w-100 shadow-sm" style={{ maxHeight: 280, overflow: "auto" }}>
                    {searching && <div className="dropdown-item text-muted">Searching…</div>}
                    {!searching && options.length === 0 && debounced && (
                        <div className="dropdown-item text-muted">No contacts</div>
                    )}

                    {!searching &&
                        options.map((c) => (
                            <button
                                key={c.id}
                                type="button"
                                className={clsx(
                                    "dropdown-item d-flex justify-content-between align-items-center",
                                    { active: c.contactId === value }
                                )}
                                onClick={() => pick(c.contactId)}
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
