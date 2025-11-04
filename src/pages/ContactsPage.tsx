import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useLocation, useNavigate, type Location } from "react-router-dom";
import {
    useContactsQuery,
    useDeleteContactsMutation,
} from "@/generated/write-oltp/graphql";

/**
 * ContactsPage
 * - Professional grid with multi-select:
 *   • Click checkbox = toggle row
 *   • Shift+click checkbox = select range from last click to current
 *   • Header checkbox = select/deselect all (tri-state)
 * - Selected rows are highlighted; toolbar shows count and enables bulk delete
 * - Double-click row or click the Name button to open the full-screen editor
 *
 * NOTE: If your schema uses `name` rather than `fullName`, replace occurrences accordingly.
 */
export default function ContactsPage() {
    const nav = useNavigate();

    // Keep Location to preserve pathname/search (and custom state)
    const location = useLocation() as Location & {
        state?: { highlightId?: string };
    };

    // Data
    const { data, loading, refetch } = useContactsQuery({
        variables: { offset: 0, limit: 50 },
        fetchPolicy: "cache-and-network",
    });
    const [delContacts, { loading: deleting }] = useDeleteContactsMutation({
        onCompleted: () => refetch(),
    });

    const rows = data?.contacts ?? [];

    // Selection state
    const [selected, setSelected] = useState<Record<string, boolean>>({});
    const [lastClickedIndex, setLastClickedIndex] = useState<number | null>(null);
    const selectAllRef = useRef<HTMLInputElement>(null);

    // Row highlight (coming back from editor)
    const [highlightId, setHighlightId] = useState<string | null>(null);

    // Derived selection info
    const allIds = useMemo(() => rows.map((r) => r.id), [rows]);
    const selectedIds = useMemo(
        () => allIds.filter((id) => !!selected[id]),
        [allIds, selected]
    );
    const selectedCount = selectedIds.length;
    const allSelected = selectedCount > 0 && selectedCount === allIds.length;
    const noneSelected = selectedCount === 0;

    // Tri-state header checkbox
    useEffect(() => {
        if (selectAllRef.current) {
            selectAllRef.current.indeterminate = !noneSelected && !allSelected;
        }
    }, [noneSelected, allSelected]);

    // Pick up highlight id from router state once; then clear
    useEffect(() => {
        if (location.state?.highlightId) setHighlightId(location.state.highlightId);
        if (location.state) {
            window.history.replaceState(null, "", location.pathname + location.search);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Toggle a single id
    const toggleId = useCallback((id: string, checked: boolean) => {
        setSelected((prev) => ({ ...prev, [id]: checked }));
    }, []);

    // Apply a range toggle (inclusive) using a boolean setter
    const toggleRange = useCallback(
        (fromIdx: number, toIdx: number, checked: boolean) => {
            const [start, end] = fromIdx < toIdx ? [fromIdx, toIdx] : [toIdx, fromIdx];
            setSelected((prev) => {
                const next = { ...prev };
                for (let i = start; i <= end; i++) {
                    const id = rows[i].id;
                    next[id] = checked;
                }
                return next;
            });
        },
        [rows]
    );

    // Header “select all”
    const onSelectAll = useCallback(
        (checked: boolean) => {
            const next: Record<string, boolean> = {};
            if (checked) {
                for (const id of allIds) next[id] = true;
            }
            setSelected(next);
            setLastClickedIndex(null);
        },
        [allIds]
    );

    // Checkbox handler per row
    const onRowCheckboxClick = useCallback(
        (e: React.MouseEvent<HTMLInputElement>, rowIndex: number, rowId: string) => {
            const target = e.currentTarget;
            const willCheck = !target.checked; // React's onClick fires before onChange reflects new state

            if (e.shiftKey && lastClickedIndex != null) {
                // SHIFT: toggle a range to the desired state (willCheck)
                toggleRange(lastClickedIndex, rowIndex, willCheck);
            } else {
                // Normal toggle
                toggleId(rowId, willCheck);
            }
            setLastClickedIndex(rowIndex);
        },
        [lastClickedIndex, toggleId, toggleRange]
    );

    // Optional: row click highlights selection state (not toggling to avoid surprises)
    const isSelected = useCallback((id: string) => selected[id], [selected]);

    return (
        <div className="d-flex flex-column gap-3">
            {/* Toolbar (sticky below app header) */}
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
                    disabled={selectedCount === 0 || deleting}
                    onClick={() => delContacts({ variables: { ids: selectedIds } })}
                    title={selectedCount > 0 ? `Delete ${selectedCount} selected` : "Delete"}
                >
                    <i className="bi bi-trash me-1" />
                    Delete
                    {selectedCount > 0 && (
                        <span className="badge text-bg-danger ms-2">{selectedCount}</span>
                    )}
                </button>

                {/* Spacer */}
                <div className="flex-grow-1" />

                {/* Subtle help */}
                <div className="text-muted small">
                    Tip: <kbd>Shift</kbd> + click to select a range
                </div>
            </div>

            <div className="table-responsive">
                <table className="table table-sm table-hover table-striped align-middle mb-0">
                    <thead className="table-light position-sticky top-0" style={{ zIndex: 1 }}>
                    <tr>
                        <th style={{ width: 44 }}>
                            <input
                                ref={selectAllRef}
                                className="form-check-input"
                                type="checkbox"
                                checked={allSelected && !noneSelected}
                                onChange={(e) => onSelectAll(e.target.checked)}
                                aria-label="Select all contacts"
                                title="Select all"
                            />
                        </th>
                        <th style={{ minWidth: 240 }}>Name</th>
                        <th style={{ minWidth: 220 }}>Email</th>
                        <th style={{ minWidth: 140 }}>Phone</th>
                        <th style={{ width: 60 }} />
                    </tr>
                    </thead>

                    <tbody>
                    {rows.map((r, idx) => {
                        const selectedRow = isSelected(r.id);
                        const isHighlighted = r.id === highlightId;

                        return (
                            <tr
                                key={r.id}
                                className={
                                    selectedRow
                                        ? "table-primary"
                                        : isHighlighted
                                            ? "table-success"
                                            : undefined
                                }
                                style={{ cursor: "pointer" }}
                            >
                                <td>
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={selectedRow}
                                        onClick={(e) => onRowCheckboxClick(e, idx, r.id)}
                                        onChange={() => {
                                            /* no-op: handled by onClick to access shiftKey before state flips */
                                        }}
                                        aria-label={`Select ${r.fullName}`}
                                    />
                                </td>

                                <td>
                                    {/* If your schema is `name`, replace r.fullName with r.name below */}
                                    <button
                                        type="button"
                                        className="btn btn-link p-0 align-baseline text-decoration-none"
                                        aria-label={`Open ${r.fullName} details`}
                                        onClick={() => nav(`/contacts/${r.id}`)}
                                    >
                                        {r.fullName}
                                    </button>
                                </td>

                                <td className="text-truncate" style={{ maxWidth: 260 }}>
                                    {r.email ?? <span className="text-muted">—</span>}
                                </td>

                                <td className="text-truncate" style={{ maxWidth: 180 }}>
                                    {r.phone ?? <span className="text-muted">—</span>}
                                </td>

                                <td className="text-end">
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
                                </td>
                            </tr>
                        );
                    })}

                    {!loading && rows.length === 0 && (
                        <tr>
                            <td colSpan={5} className="text-center text-muted py-4">
                                No contacts yet. Click <strong>Add</strong> to create one.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            {loading && <div className="text-muted py-2">Loading…</div>}
        </div>
    );
}
