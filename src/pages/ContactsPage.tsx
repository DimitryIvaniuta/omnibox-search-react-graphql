import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    useContactsQuery,
    useDeleteContactsMutation,
} from "@/generated/write-oltp/graphql";

export default function ContactsPage() {
    const nav = useNavigate();
    const [selected, setSelected] = useState<Record<string, boolean>>({});
    const { data, loading, refetch } = useContactsQuery({ variables: { offset: 0, limit: 50 } });
    const [delContacts, { loading: deleting }] = useDeleteContactsMutation({
        onCompleted: () => refetch(),
    });

    const rows = data?.contacts ?? [];
    const selectedIds = useMemo(() => Object.keys(selected).filter(k => selected[k]), [selected]);

    return (
        <div className="d-flex flex-column gap-3">
            {/* Pinned toolbar */}
            <div className="d-flex gap-2 align-items-center sticky-top bg-white py-2" style={{ top: 56 }}>
                <button className="btn btn-primary" onClick={() => nav("/contacts/new")}>+ Add</button>
                <button
                    className="btn btn-outline-danger"
                    disabled={selectedIds.length === 0 || deleting}
                    onClick={() => delContacts({ variables: { ids: selectedIds } })}
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
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                    </tr>
                    </thead>
                    <tbody>
                    {rows.map(r => (
                        <tr key={r.id} onDoubleClick={() => nav(`/contacts/${r.id}`)} style={{ cursor: "pointer" }}>
                            <td>
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={selected[r.id]}
                                    onChange={(e) =>
                                        setSelected(s => ({ ...s, [r.id]: e.target.checked }))
                                    }
                                />
                            </td>
                            <td>{r.fullName}</td>
                            <td>{r.email}</td>
                            <td>{r.phone}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {loading && <div className="text-muted">Loading…</div>}
        </div>
    );
}
