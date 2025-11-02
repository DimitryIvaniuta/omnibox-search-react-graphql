import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    useListingsQuery,
    useDeleteListingsMutation,
} from "@/generated/write-oltp/graphql";

const ListingsPage = ()=> {
    const nav = useNavigate();
    const [selected, setSelected] = useState<Record<string, boolean>>({});
    const { data, loading, refetch } = useListingsQuery({ variables: { offset: 0, limit: 50 } });
    const [delListings, { loading: deleting }] = useDeleteListingsMutation({
        onCompleted: () => refetch(),
    });

    const rows = data?.listings ?? [];
    const selectedIds = useMemo(() => Object.keys(selected).filter(k => selected[k]), [selected]);

    return (
        <div className="d-flex flex-column gap-3">
            <div className="d-flex gap-2 align-items-center sticky-top bg-white py-2" style={{ top: 56 }}>
                <button className="btn btn-primary" onClick={() => nav("/listings/new")}>+ Add</button>
                <button
                    className="btn btn-outline-danger"
                    disabled={selectedIds.length === 0 || deleting}
                    onClick={() => delListings({ variables: { ids: selectedIds } })}
                >
                    Delete
                </button>
            </div>

            <div className="table-responsive">
                <table className="table table-sm align-middle">
                    <thead>
                    <tr>
                        <th style={{ width: 36 }}>
                            <input
                                className="form-check-input"
                                type="checkbox"
                                onChange={(e) => {
                                    const all = e.target.checked;
                                    const next: Record<string, boolean> = {};
                                    rows.forEach(r => (next[r.id] = all));
                                    setSelected(next);
                                }}
                            />
                        </th>
                        <th>Title</th>
                        <th>MLS ID</th>
                        <th className="text-end">Price</th>
                    </tr>
                    </thead>
                    <tbody>
                    {rows.map(r => (
                        <tr key={r.id} onDoubleClick={() => nav(`/listings/${r.id}`)} style={{ cursor: "pointer" }}>
                            <td>
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={selected[r.id]}
                                    onChange={(e) => setSelected(s => ({ ...s, [r.id]: e.target.checked }))}
                                />
                            </td>
                            <td>{r.title}</td>
                            <td>{r.mlsId}</td>
                            <td className="text-end">
                                {r.price ? `${r.price.amount} ${r.price.currency}` : "—"}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {loading && <div className="text-muted">Loading…</div>}
        </div>
    );
}

export default ListingsPage;