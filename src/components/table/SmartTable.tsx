import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type RowIdGetter<T> = (row: T, index: number) => string;

export type Column<T> = {
    key: string;
    header: React.ReactNode;
    cell?: (row: T, index: number) => React.ReactNode;
    accessor?: (row: T) => unknown;
    accessorKey?: keyof T;
    className?: string;
    width?: number | string;
    minWidth?: number | string;
};

export type SmartTableProps<T> = {
    rows: T[];
    columns: Column<T>[];
    getRowId?: RowIdGetter<T>;

    /** An id to highlight (e.g., newly created/updated). Table fades it automatically. */
    highlightedId?: string | null;
    /** Fade duration (ms) for the highlight. Default: 3000 */
    highlightDurationMs?: number;

    /** Double-click row */
    onRowDoubleClick?: (row: T) => void;
    /** Optional callback: name/primary click (if you model a primary cell) */
    onRowPrimaryClick?: (row: T) => void;

    /** Persist selected ids in sessionStorage under this key; restore on mount/rows change. */
    selectionKey?: string;
    /** Bubble selected ids (for toolbars) */
    onSelectionChange?: (ids: string[]) => void;

    selectAllAriaLabel?: string;
    stickyOffset?: number;
    tableClassName?: string;
};

export default function SmartTable<T>(
    {
        rows,
        columns,
        getRowId,
        highlightedId,
        highlightDurationMs = 3000,
        onRowDoubleClick,
        onRowPrimaryClick,
        selectionKey,
        onSelectionChange,
        selectAllAriaLabel = "Select all rows",
        stickyOffset = 0,
        tableClassName = "table table-sm table-hover table-striped align-middle mb-0",
    }: SmartTableProps<T>) {
    const rowId: RowIdGetter<T> = getRowId ?? ((row) => (row as any).id as string);

    // ---------- highlight (internal fade) ----------
    const [liveHighlightId, setLiveHighlightId] = useState<string | null>(null);
    useEffect(() => {
        if (!highlightedId) return;
        setLiveHighlightId(highlightedId);
        const t = window.setTimeout(() => setLiveHighlightId(null), highlightDurationMs);
        return () => window.clearTimeout(t);
    }, [highlightedId, highlightDurationMs]);

    // ---------- selection ----------
    const [selected, setSelected] = useState<Record<string, boolean>>({});
    const [lastIndex, setLastIndex] = useState<number | null>(null);
    const selectAllRef = useRef<HTMLInputElement>(null);
    const didHydrateRef = useRef<boolean>(!selectionKey);

    const ids = useMemo(() => rows.map(rowId), [rows, rowId]);
    const selectedIds = useMemo(() => ids.filter((id) => selected[id]), [ids, selected]);
    const selCount = selectedIds.length;
    const allSelected = selCount > 0 && selCount === ids.length;
    const noneSelected = selCount === 0;

    useEffect(() => {
        if (selectAllRef.current) {
            selectAllRef.current.indeterminate = !noneSelected && !allSelected;
        }
    }, [noneSelected, allSelected]);

    // hydrate from storage (if selectionKey provided)
    useEffect(() => {
        if (!selectionKey) return;
        if (!rows.length) return;
        const raw = sessionStorage.getItem(selectionKey);
        if (!raw) {
            didHydrateRef.current = true;
            return;
        }
        let stored: string[] = [];
        try { stored = JSON.parse(raw) as string[]; } catch { didHydrateRef.current = true; return; }
        setSelected((prev) => {
            if (!stored.length) return prev;
            let changed = false;
            const next = { ...prev };
            for (let i = 0; i < rows.length; i++) {
                const id = rowId(rows[i], i);
                if (next[id] === undefined && stored.includes(id)) {
                    next[id] = true;
                    changed = true;
                }
            }
            return changed ? next : prev;
        });
        didHydrateRef.current = true;
    }, [rows, rowId, selectionKey]);

    // persist after hydration
    useEffect(() => {
        if (!selectionKey) return;
        if (!didHydrateRef.current) return;
        sessionStorage.setItem(selectionKey, JSON.stringify(selectedIds));
    }, [selectionKey, selectedIds]);

    // bubble selection
    useEffect(() => {
        onSelectionChange?.(selectedIds);
    }, [selectedIds, onSelectionChange]);

    const toggleId = useCallback((id: string, checked: boolean) => {
        setSelected((prev) => ({ ...prev, [id]: checked }));
    }, []);

    const toggleRange = useCallback(
        (fromIdx: number, toIdx: number, checked: boolean) => {
            const [start, end] = fromIdx < toIdx ? [fromIdx, toIdx] : [toIdx, fromIdx];
            setSelected((prev) => {
                const next = { ...prev };
                for (let i = start; i <= end; i++) next[ids[i]] = checked;
                return next;
            });
        },
        [ids]
    );

    const onRowCheckboxChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>, index: number, id: string) => {
            const checked = e.currentTarget.checked;
            const shift = (e.nativeEvent as MouseEvent).shiftKey;
            if (shift && lastIndex != null) toggleRange(lastIndex, index, checked);
            else toggleId(id, checked);
            setLastIndex(index);
        },
        [lastIndex, toggleRange, toggleId]
    );

    const onSelectAll = useCallback(
        (checked: boolean) => {
            if (!checked) {
                setSelected({});
                setLastIndex(null);
                return;
            }
            const next: Record<string, boolean> = {};
            for (const id of ids) next[id] = true;
            setSelected(next);
            setLastIndex(null);
        },
        [ids]
    );

    // ---------- render helpers ----------
    const headerCells = useMemo(
        () =>
            columns.map((col) => (
                <th
                    style={{
                        position: "sticky",
                        top: 0,
                        zIndex: 2,
                        background: "var(--bs-light)", // solid background so rows never “shine through”
                        width: col.width,
                        minWidth: col.minWidth
                    }}
                    key={col.key}
                    className={col.className}
                >
                    {col.header}
                </th>
            )),
        [columns]
    );

    const renderCell = useCallback((col: Column<T>, row: T, index: number) => {
        if (col.cell) return col.cell(row, index);
        if (col.accessor) return String(col.accessor(row) ?? "");
        if (col.accessorKey) return String(row[col.accessorKey] ?? "");
        return null;
    }, []);

    return (
        <div
            className="smart-table-wrap"         // (no need for .table-responsive here)
            style={{ maxHeight: "60vh", overflow: "hidden" }}
        >
            <table className={tableClassName} style={{ width: "100%", tableLayout: "fixed", borderCollapse: "separate" }}>
                {/* 2) Header never scrolls because the body below is the only scroller */}
                <thead
                    className="table-light"
                    style={{
                        display: "table",              // keep column widths aligned with tbody rows
                        width: "100%",
                        tableLayout: "fixed",
                        position: "sticky",            // stays pinned if the page itself scrolls a bit
                        top: stickyOffset || 0,
                        zIndex: 2,
                        background: "var(--bs-light)",
                        // borderBottom: "1px solid var(--bs-border-color)",
                        height: 48,              // used just for consistent layout
                    }}
                >
                <tr>
                    <th style={{ width: 44 }}>
                        <input
                            ref={selectAllRef}
                            className="form-check-input"
                            type="checkbox"
                            checked={allSelected && !noneSelected}
                            onChange={(e) => onSelectAll(e.target.checked)}
                            aria-label={selectAllAriaLabel}
                            title="Select all"
                        />
                    </th>

                    {columns.map(col => (
                        <th
                            key={col.key}
                            className={col.className}
                            style={{
                                width: col.width,
                                minWidth: col.minWidth,
                                background: "var(--bs-light)",
                            }}
                        >
                            {col.header}
                        </th>
                    ))}

                    <th style={{ width: 60 }} />
                </tr>
                </thead>

                {/* 3) Only tbody scrolls; scrollbar never overlaps the header */}
                <tbody
                    style={{
                        display: "block",
                        overflowY: "auto",
                        overflowX: "hidden",
                        // available space under the header within the wrapper
                        maxHeight: `calc(60vh - 48px)`,
                        // optional: slim, nice scrollbar (WebKit + Firefox)
                        scrollbarWidth: "thin",
                        scrollbarColor: "rgba(0,0,0,.35) transparent",
                    } as React.CSSProperties}
                >
                {rows.map((row, idx) => {
                    const id = rowId(row, idx);
                    const isSelected = selected[id];
                    const isHighlighted = liveHighlightId === id;

                    return (
                        <tr
                            key={id}
                            // each row renders as a table to align with thead widths
                            style={{ display: "table", width: "100%", tableLayout: "fixed", cursor: "pointer" }}
                            className={isHighlighted ? "row-highlight" : isSelected ? "table-primary" : undefined}
                            onDoubleClick={onRowDoubleClick ? () => onRowDoubleClick(row) : undefined}
                        >
                            <td style={{ width: 44 }}>
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={(e) => onRowCheckboxChange(e, idx, id)}
                                    aria-label={`Select ${id}`}
                                />
                            </td>

                            {columns.map(col => (
                                <td
                                    key={col.key}
                                    className={col.className}
                                    style={{ width: col.width, minWidth: col.minWidth }}
                                >
                                    {renderCell(col, row, idx)}
                                </td>
                            ))}

                            <td className="text-end" style={{ width: 60 }} />
                        </tr>
                    );
                })}

                {rows.length === 0 && (
                    <tr style={{ display: "table", width: "100%", tableLayout: "fixed" }}>
                        <td colSpan={columns.length + 2} className="text-center text-muted py-4">
                            No records.
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
}
