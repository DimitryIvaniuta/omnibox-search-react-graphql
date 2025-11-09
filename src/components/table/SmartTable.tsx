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
    highlightedId?: string | null;
    highlightDurationMs?: number;
    onRowDoubleClick?: (row: T) => void;
    selectionKey?: string;
    onSelectionChange?: (ids: string[]) => void;
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

    // >>> Unified sizing <<<
    const WRAP_VH = 75;  // grid viewport height
    const HEADER_H = 48; // sticky thead height (px)

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

    const ids = useMemo(() => rows.map(rowId), [rows]); // rowId assumed stable
    const selectedIds = useMemo(() => ids.filter((id) => selected[id]), [ids, selected]);
    const selCount = selectedIds.length;
    const allSelected = selCount > 0 && selCount === ids.length;
    const noneSelected = selCount === 0;

    useEffect(() => {
        if (selectAllRef.current) {
            selectAllRef.current.indeterminate = !noneSelected && !allSelected;
        }
    }, [noneSelected, allSelected]);

    const hydratedRef = useRef(false);
    useEffect(() => {
        if (!selectionKey || hydratedRef.current || ids.length === 0) return;
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
        } catch { /* ignore */ }
    }, [selectionKey, ids]);

    const onSelectionChangeRef = useRef(onSelectionChange);
    useEffect(() => { onSelectionChangeRef.current = onSelectionChange; }, [onSelectionChange]);

    const prevSelStrRef = useRef<string>("");
    useEffect(() => {
        const cur = JSON.stringify(selectedIds);
        if (cur === prevSelStrRef.current) return;
        prevSelStrRef.current = cur;
        onSelectionChangeRef.current?.(selectedIds);
        if (selectionKey) sessionStorage.setItem(selectionKey, cur);
    }, [selectedIds, selectionKey]);

    const toggleId = useCallback((id: string, checked: boolean) => {
        setSelected((p) => ({ ...p, [id]: checked }));
    }, []);
    const toggleRange = useCallback(
        (from: number, to: number, checked: boolean) => {
            const [start, end] = from < to ? [from, to] : [to, from];
            setSelected((p) => {
                const next = { ...p };
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
            if (!checked) { setSelected({}); setLastIndex(null); return; }
            const next: Record<string, boolean> = {};
            for (const id of ids) next[id] = true;
            setSelected(next);
            setLastIndex(null);
        },
        [ids]
    );

    return (
        // Wrapper: SAME height we subtract from below; wrapper itself does not scroll
        <div className="smart-table-wrap" style={{ height: `${WRAP_VH}vh`, overflow: "hidden" }}>
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
                        height: HEADER_H,
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

                    {/* flexible filler column */}
                    <th className="w-fill" style={{ width: "auto", minWidth: 0 }} aria-hidden="true" />
                </tr>
                </thead>

                {/* tbody is the ONLY scroller. Height matches wrapper - header */}
                <tbody
                    style={{
                        display: "block",
                        overflowY: "auto",
                        overflowX: "hidden",
                        height: `calc(${WRAP_VH}vh - ${HEADER_H}px)`,
                        scrollbarWidth: "thin",
                        scrollbarColor: "rgba(0,0,0,.35) transparent",
                    } as React.CSSProperties}
                >
                {rows.map((row, idx) => {
                    const id = rowId(row, idx);
                    const isSelected = !!selected[id];
                    const isHighlighted = liveHighlightId === id;

                    return (
                        <tr
                            key={id}
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
                                <td key={col.key} className={col.className} style={{ width: col.width, minWidth: col.minWidth }}>
                                    {col.cell
                                        ? col.cell(row, idx)
                                        : col.accessor
                                            ? String(col.accessor(row) ?? "")
                                            : col.accessorKey
                                                ? String((row as any)[col.accessorKey] ?? "")
                                                : null}
                                </td>
                            ))}

                            {/* flexible filler cell */}
                            <td className="w-fill" style={{ width: "auto", minWidth: 0 }} aria-hidden="true" />
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
