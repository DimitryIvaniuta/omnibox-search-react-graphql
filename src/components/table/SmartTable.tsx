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

    /** Row id to highlight (e.g., after create/update). */
    highlightedId?: string | null;
    /** Fade duration (ms) for the highlight. Default: 3000 */
    highlightDurationMs?: number;

    /** Row interactions */
    onRowDoubleClick?: (row: T) => void;

    /** Selection persistence & bubbling */
    selectionKey?: string;
    /** Bubble selected ids (for toolbars) */
    onSelectionChange?: (ids: string[]) => void;

    /** UI */
    selectAllAriaLabel?: string;
    stickyOffset?: number;
    tableClassName?: string;
};

export default function SmartTable<T>({
                                          rows,
                                          columns,
                                          getRowId,
                                          highlightedId,
                                          highlightDurationMs = 3000,
                                          onRowDoubleClick,
                                          selectionKey,
                                          onSelectionChange,
                                          selectAllAriaLabel = "Select all rows",
                                          stickyOffset = 0,
                                          tableClassName = "table table-sm table-hover table-striped align-middle mb-0",
                                      }: SmartTableProps<T>) {
    const rowId: RowIdGetter<T> = getRowId ?? ((row) => (row as any).id as string);

    /* ---------- highlight (auto-fade) ---------- */
    const [liveHighlightId, setLiveHighlightId] = useState<string | null>(null);
    useEffect(() => {
        if (!highlightedId) return;
        setLiveHighlightId(highlightedId);
        const t = window.setTimeout(() => setLiveHighlightId(null), highlightDurationMs);
        return () => window.clearTimeout(t);
    }, [highlightedId, highlightDurationMs]);

    /* ---------- selection ---------- */
    const [selected, setSelected] = useState<Record<string, boolean>>({});
    const [lastIndex, setLastIndex] = useState<number | null>(null);
    const selectAllRef = useRef<HTMLInputElement>(null);

    // stable ids for current rows
    const ids = useMemo(() => rows.map(rowId), [rows, rowId]);
    const selectedIds = useMemo(() => ids.filter((id) => selected[id]), [ids, selected]);
    const selCount = selectedIds.length;
    const allSelected = selCount > 0 && selCount === ids.length;
    const noneSelected = selCount === 0;

    // tri-state checkbox (pure DOM prop; does NOT cause renders)
    useEffect(() => {
        if (selectAllRef.current) {
            selectAllRef.current.indeterminate = !noneSelected && !allSelected;
        }
    }, [noneSelected, allSelected]);

    // hydrate selection from sessionStorage EXACTLY ONCE (per key), when rows are present
    const hydratedRef = useRef(false);
    useEffect(() => {
        if (!selectionKey) return;
        if (hydratedRef.current) return;
        if (ids.length === 0) return; // wait until first data batch

        hydratedRef.current = true;
        try {
            const raw = sessionStorage.getItem(selectionKey);
            if (!raw) return;
            const stored = JSON.parse(raw) as string[];
            if (!Array.isArray(stored) || stored.length === 0) return;

            setSelected((prev) => {
                const next = { ...prev };
                let changed = false;
                for (const id of ids) {
                    if (stored.includes(id) && !next[id]) {
                        next[id] = true;
                        changed = true;
                    }
                }
                return changed ? next : prev;
            });
        } catch {
            // ignore malformed storage
        }
    }, [selectionKey, ids.length, ids]);

    const prevSelStrRef = useRef<string>("");

    // persist to storage & notify parent ONLY when the set of ids changes
    const onSelectionChangeRef = useRef(onSelectionChange);
    useEffect(() => {
        onSelectionChangeRef.current = onSelectionChange;
    }, [onSelectionChange]);

    // bubble selection
    useEffect(() => {
        const curSelStr = JSON.stringify(selectedIds); // value snapshot (order preserved)

        // if nothing changed by value, do nothing
        if (curSelStr === prevSelStrRef.current) return;

        prevSelStrRef.current = curSelStr;

        // now notify & persist once per actual change
        onSelectionChangeRef.current?.(selectedIds);
        if (selectionKey) sessionStorage.setItem(selectionKey, curSelStr);
    }, [selectedIds, selectionKey]);

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

    return (
        <div className="smart-table-wrap" style={{ maxHeight: "60vh", overflow: "hidden" }}>
            <table
                className={tableClassName}
                style={{ width: "100%", tableLayout: "fixed", borderCollapse: "separate" }}
            >
                <thead
                    className="table-light"
                    style={{
                        display: "table",
                        width: "100%",
                        tableLayout: "fixed",
                        position: "sticky",
                        top: stickyOffset || 0,
                        zIndex: 2,
                        background: "var(--bs-light)",
                        height: 48,
                    }}
                >
                <tr>
                    <th style={{ width: 44, maxWidth: 44 }}>
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

                    {columns.map((col) => (
                        <th
                            key={col.key}
                            className={col.className}
                            style={{ width: col.width, minWidth: col.minWidth, background: "var(--bs-light)" }}
                        >
                            {col.header}
                        </th>
                    ))}

                    <th
                        className="w-fill"
                        style={{ width: "auto", minWidth: 0 }}
                        aria-hidden="true"
                    />
                </tr>
                </thead>

                <tbody
                    style={{
                        display: "block",
                        overflowY: "auto",
                        overflowX: "hidden",
                        maxHeight: `calc(75vh - 48px)`,
                        scrollbarWidth: "thin",
                        scrollbarColor: "rgba(0,0,0,.35) transparent",
                    } as React.CSSProperties}
                >
                {rows.map((row, idx) => {
                    const id = rowId(row, idx);
                    const isSelected = selected[id];
                    const isHighlighted = liveHighlightId === id;
                    if(isHighlighted){
                        console.log(`Highlighted: ${id} is selected: ${isHighlighted}`);
                    }
                    return (
                        <tr
                            key={id}
                            // each row renders as a table to align with thead widths
                            style={{ display: "table", width: "100%", tableLayout: "fixed", cursor: "pointer" }}
                            className={isHighlighted ? "table-success" : isSelected ? "table-primary" : undefined}
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

                            {columns.map((col) => (
                                <td
                                    key={col.key}
                                    className={col.className}
                                    style={{ width: col.width, minWidth: col.minWidth }}>
                                    {col.cell
                                        ? col.cell(row, idx)
                                        : col.accessor
                                            ? String(col.accessor(row) ?? "")
                                            : col.accessorKey
                                                ? String((row as any)[col.accessorKey] ?? "")
                                                : null}
                                </td>
                            ))}

                            <td
                                className="w-fill"
                                style={{ width: "auto", minWidth: 0 }}
                                aria-hidden="true"
                            />
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
