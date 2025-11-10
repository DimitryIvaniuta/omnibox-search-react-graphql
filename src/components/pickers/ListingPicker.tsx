// Debounced typeahead for Listings: queries Omnibox (listings group) and shows the selected listing's titl
// by fetching from write-oltp when value already present.
import { useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import { useOmniboxQuery } from "@/generated/omnibox/graphql";
import { useListingByIdQuery } from "@/generated/write-oltp/graphql";
import { omniboxClient } from "@/apollo/omniboxClient";
import { writeClient } from "@/apollo/writeClient";

type Props = {
    value: string | null;                       // listingId
    onChange: (listingId: string | null) => void;
    placeholder?: string;
    limitPerGroup?: number;
};

const ListingPicker = ({
                                          value,
                                          onChange,
                                          placeholder = "Search listings…",
                                          limitPerGroup = 8,
                                      }: Props)=> {
    const [q, setQ] = useState("");
    const [open, setOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // debounce
    const [debounced, setDebounced] = useState("");
    useEffect(() => {
        const t = setTimeout(() => setDebounced(q.trim()), 250);
        return () => clearTimeout(t);
    }, [q]);

    // omnibox (listings)
    const { data: omni, loading: searching } = useOmniboxQuery({
        variables: { q: debounced, limitPerGroup },
        skip: debounced.length === 0,
        client: omniboxClient,
        fetchPolicy: "no-cache",
        notifyOnNetworkStatusChange: true,
    });
    const options = useMemo(() => omni?.omnibox?.listings ?? [], [omni]);

    // selected label by id
    const { data: byId } = useListingByIdQuery({
        variables: { id: value as string },
        skip: !value,
        client: writeClient,
        fetchPolicy: "cache-first",
    });

    const selectedLabel = useMemo(() => {
        if (!value) return "";
        const fromOmni = options.find((o) => o.listingId === value);
        if (fromOmni) return fromOmni.title ?? value;
        if (byId?.listing?.title) return byId.listing.title;
        return value;
    }, [value, options, byId]);

    // outside click
    useEffect(() => {
        const onDoc = (e: MouseEvent) => {
            if (!inputRef.current) return;
            if (!inputRef.current.parentElement?.contains(e.target as Node)) setOpen(false);
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
                value={open ? q : selectedLabel}
                onFocus={() => {
                    setOpen(true);
                    setTimeout(() => inputRef.current?.select(), 0);
                }}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Escape") { setOpen(false); (e.target as HTMLInputElement).blur(); }
                    if (e.key === "Enter" && options.length > 0) pick(options[0].listingId);
                }}
            />

            {open && (
                <div className="dropdown-menu show w-100 shadow-sm" style={{ maxHeight: 280, overflow: "auto" }}>
                    {searching && <div className="dropdown-item text-muted">Searching…</div>}
                    {!searching && options.length === 0 && debounced && (
                        <div className="dropdown-item text-muted">No listings</div>
                    )}
                    {!searching && options.map((l) => (
                        <button
                            key={l.id}
                            type="button"
                            className={clsx("dropdown-item text-truncate", { active: l.listingId === value })}
                            onClick={() => pick(l.listingId)}
                            title={l.subtitle ?? ""}
                        >
                            {l.title}
                        </button>
                    ))}
                </div>
            )}

            {value && (
                <button type="button" className="btn btn-sm btn-outline-secondary mt-2" onClick={() => onChange(null)}>
                    Clear
                </button>
            )}
        </div>
    );
}

export default ListingPicker;