import { useEffect, useMemo, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
import { useLocation, useNavigate, type Location } from "react-router-dom";
import { useContactsQuery, useDeleteContactsMutation } from "@/generated/write-oltp/graphql";

/**
 * Contacts list page:
 * - Clickable Name opens full-screen editor (ContactEditor).
 * - Row highlight on return (using location.state.highlightId).
 * - Bulk delete (if mutation available).
 * - No notifications here; editor will trigger app-wide toast via provider.
 *
 * NOTE: If your schema uses "fullName" instead of "name", change r.name → r.fullName and adjust the editor too.
 */
export default function ContactsPage() {
    const nav = useNavigate();
    const location1 = useLocation() as unknown as { state?: { highlightId?: string } };
    const location = useLocation() as Location & {
        state?: { highlightId?: string };
    };
    const [selected, setSelected] = useState<Record<string, boolean>>({});
    const [highlightId, setHighlightId] = useState<string | null>(null);

    // Load contacts (first page)
    const { data, loading, refetch } = useContactsQuery({ variables: { offset: 0, limit: 50 } });
    const [delContacts, { loading: deleting }] = useDeleteContactsMutation({ onCompleted: () => refetch() });

    const rows = data?.contacts ?? [];
    const selectedIds = useMemo(() => Object.keys(selected).filter((k) => selected[k]), [selected]);

    // Pick up highlight id from router state (once), then clear history state to avoid re-trigger on refresh
    useEffect(() => {
        if (location.state?.highlightId) {
            setHighlightId(location.state.highlightId);
        }
        // clear the one-time router state
        if (location.state) {
            // history.replaceState(null, "", location.pathname + location.search);
            window.history.replaceState(null, "", location.pathname + location.search);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="d-flex flex-column gap-3">
            {/* Pinned toolbar */}
            <div className="d-flex gap-2 align-items-center sticky-top bg-white py-2" style={{ top: 56 }}>
                <button className="btn btn-primary" onClick={() => nav("/contacts/new")}>
                    + Add
                </button>

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
                                    rows.forEach((r) => (next[r.id] = all));
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
                    {rows.map((r) => (
                        <tr
                            key={r.id}
                            className={r.id === highlightId ? "table-success" : undefined}
                            onDoubleClick={() => nav(`/contacts/${r.id}`)}
                            style={{ cursor: "pointer" }}
                        >
                            <td>
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={selected[r.id]}
                                    onChange={(e) => setSelected((s) => ({ ...s, [r.id]: e.target.checked }))}
                                />
                            </td>

                            <td>
                                {/* If your schema is fullName instead of name, replace r.name with r.fullName */}
                                <button
                                    type="button"
                                    className="btn btn-link p-0 align-baseline text-decoration-none"
                                    aria-label={`Open ${r.fullName} details`}
                                    onClick={() => nav(`/contacts/${r.id}`)}
                                >
                                    {r.fullName}
                                </button>
                            </td>

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
