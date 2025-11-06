import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, type Location } from "react-router-dom";
import { useContactsQuery, useDeleteContactsMutation } from "@/generated/write-oltp/graphql";
import SmartTable, { type Column } from "@/components/table/SmartTable";

const SELECTION_KEY = "contacts:selectedIds";

export default function ContactsPage() {
    const nav = useNavigate();
    const location = useLocation() as Location & { state?: { highlightId?: string } };

    const { data, loading, refetch } = useContactsQuery({
        variables: { offset: 0, limit: 50 },
        fetchPolicy: "cache-and-network",
    });
    const [delContacts, { loading: deleting }] = useDeleteContactsMutation({
        onCompleted: () => refetch(),
    });

    const rows = data?.contacts ?? [];

    // Read highlightId from router state; SmartTable will fade it internally
    const highlightedId = location.state?.highlightId ?? null;
    useEffect(() => {
        if (location.state) {
            window.history.replaceState(null, "", location.pathname + location.search);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const noneSelected = selectedIds.length === 0;

    const columns = useMemo<Column<(typeof rows)[number]>[]>(() => [
        {
            key: "name",
            header: "Name",
            minWidth: 240,
            cell: (r) => (
                <button
                    type="button"
                    className="btn btn-link p-0 align-baseline text-decoration-none"
                    aria-label={`Open ${r.fullName} details`}
                    onClick={() => nav(`/contacts/${r.id}`)}
                >
                    {r.fullName}
                </button>
            ),
        },
        {
            key: "email",
            header: "Email",
            minWidth: 220,
            cell: (r) => r.email ?? <span className="text-muted">—</span>,
        },
        {
            key: "phone",
            header: "Phone",
            minWidth: 140,
            cell: (r) => r.phone ?? <span className="text-muted">—</span>,
        },
        {
            key: "actions",
            header: "",
            width: 60,
            className: "text-end",
            cell: (r) => (
                <div className="btn-group btn-group-sm" role="group">
                    <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => nav(`/contacts/${r.id}`)}
                        title="Edit"
                        aria-label="Edit"
                    >
                        <i className="bi bi-pencil-square" />
                    </button>
                    <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={() => delContacts({ variables: { ids: [r.id] } })}
                        title="Delete"
                        aria-label="Delete"
                    >
                        <i className="bi bi-trash" />
                    </button>
                </div>
            ),
        },
    ], [nav, delContacts]);

    return (
        <div className="d-flex flex-column gap-3">
            {/* Toolbar */}
            <div
                className="toolbar d-flex flex-wrap gap-2 align-items-center sticky-top bg-white py-2 border-bottom"
                style={{ top: 56, zIndex: 1 }}
            >
                <button className="btn btn-primary" onClick={() => nav("/contacts/new")}>
                    <i className="bi bi-plus-lg me-1" />
                    Add
                </button>

                <button
                    className="btn btn-outline-danger"
                    disabled={noneSelected || deleting}
                    onClick={() => delContacts({ variables: { ids: selectedIds } })}
                    title={noneSelected ? "Delete" : `Delete ${selectedIds.length} selected`}
                >
                    <i className="bi bi-trash me-1" />
                    Delete
                    {!noneSelected && <span className="badge text-bg-danger ms-2">{selectedIds.length}</span>}
                </button>

                <div className="flex-grow-1" />
                <div className="text-muted small">Tip: <kbd>Shift</kbd> + click to select a range</div>
            </div>

            {/* the grid region fills remaining height; only it scrolls */}
            <div className="grid-wrap">
                <SmartTable
                    rows={rows}
                    columns={columns}
                    getRowId={(r) => r.id}
                    highlightedId={highlightedId}
                    selectionKey={SELECTION_KEY}
                    onSelectionChange={setSelectedIds}
                    selectAllAriaLabel="Select all contacts"
                    // no stickyOffset needed; header sticks at top of its own scroll container
                />
            </div>

            {loading && <div className="text-muted py-2">Loading…</div>}
        </div>
    );
}
