import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, type Location } from "react-router-dom";
import { useContactsQuery, useDeleteContactsMutation } from "@/generated/write-oltp/graphql";
import SmartTable, { type Column } from "@/components/table/SmartTable";

const SELECTION_KEY = "contacts:selectedIds";

export default function ContactsPage() {
    const nav = useNavigate();
    const { state } = useLocation() as { state?: { highlightId?: string } };

    const { data, loading, refetch } = useContactsQuery({
        variables: { offset: 0, limit: 50 },
        fetchPolicy: "cache-and-network",
    });
    const [delContacts, { loading: deleting }] = useDeleteContactsMutation({
        onCompleted: () => refetch(),
    });

    const rows = data?.contacts ?? [];

    // pickup one-time highlight id from router state

    const [highlightId, setHighlightId] = useState<string | null>(null);

    useEffect(() => {
        if (state?.highlightId) {
            setHighlightId(state.highlightId);
            nav(".", { replace: true, state: {} });   // clear location.state
        }
    }, [state, nav]);

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
                    className="btn btn-link p-0 align-baseline text-decoration-none text-truncate"
                    style={{ maxWidth: 560 }}
                    onClick={() => nav(`/contacts/${r.id}`)}
                    aria-label={`Open ${r.fullName} details`}
                >
                    {r.fullName}
                </button>
            ),
        },
        {
            key: "email",
            header: "Email",
            minWidth: 220,
            className: "text-truncate",
            cell: (r) => r.email ?? <span className="text-muted">—</span>,
        },
        {
            key: "phone",
            header: "Phone",
            minWidth: 140,
            className: "text-truncate",
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
        // Make sure your outer shell gives this <main> full height: class "app-main" is styled in overrides.scss
        <div className="app-main d-flex flex-column">
            {/* pinned toolbar above the grid */}
            <div
                className="d-flex flex-wrap gap-2 align-items-center sticky-top bg-white py-2 border-bottom"
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
                <div className="text-muted small p-3">Tip: <kbd>Shift</kbd> + click to select a range</div>
            </div>

            {/* grid region takes remaining height and scrolls internally */}
            <div className="grid-wrap flex-grow-1">
                <SmartTable
                    rows={rows}
                    columns={columns}
                    getRowId={(r) => r.id}
                    highlightedId={highlightId}          // fades internally
                    selectionKey={SELECTION_KEY}           // persist selection
                    onSelectionChange={setSelectedIds}     // drives toolbar
                />
            </div>

            {loading && <div className="text-muted py-2">Loading…</div>}
        </div>
    );
}
