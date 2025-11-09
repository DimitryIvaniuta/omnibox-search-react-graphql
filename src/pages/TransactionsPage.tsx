// Grid with pinned toolbar, tbody-only scrolling (SmartTable), persisted selection,
// clickable title to edit, and double-click to open editor.

import { useCallback, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SmartTable, { type Column } from "@/components/table/SmartTable";
import {
    useTransactionsQuery,
    useDeleteTransactionsMutation,
    type TransactionsQuery,
} from "@/generated/write-oltp/graphql";

type Row = NonNullable<TransactionsQuery["transactions"]>[number];
const SELECTION_KEY = "transactions:selectedIds";

const TransactionsPage = () => {
    const nav = useNavigate();
    const { state } = useLocation() as { state?: { highlightId?: string } };

    const { data, loading, refetch } = useTransactionsQuery({
        variables: { offset: 0, limit: 50 },
        fetchPolicy: "cache-and-network",
    });
    const [remove, { loading: deleting }] = useDeleteTransactionsMutation({
        onCompleted: () => refetch(),
    });

    const rows: Row[] = data?.transactions ?? [];
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const noneSelected = selectedIds.length === 0;

    const openEditor = useCallback((r: Row) => nav(`/transactions/${r.id}`), [nav]);

    const columns = useMemo<Column<Row>[]>(() => [
        {
            key: "title",
            header: "Title",
            minWidth: 220,
            cell: (r) => (
                <button
                    type="button"
                    className="btn btn-link p-0 text-decoration-none text-truncate"
                    onClick={() => openEditor(r)}
                    title="Open transaction"
                >
                    {r.title ?? "—"}
                </button>
            ),
        },
        {
            key: "status",
            header: "Status",
            width: 140,
            className: "text-nowrap",
            accessor: (r) => r.status ?? "—",
        },
        {
            key: "total",
            header: "Total",
            width: 160,
            className: "text-end",
            cell: (r) => (r.total ? `${r.total.amount} ${r.total.currency}` : "—"),
        },
    ], [openEditor]);

    return (
        <div className="page-with-grid d-flex flex-column h-100">
            {/* pinned actions */}
            <div className="sticky-top bg-white py-2 border-bottom d-flex align-items-center gap-2" style={{ top: 56, zIndex: 1 }}>
                <button className="btn btn-primary" onClick={() => nav("/transactions/new")}>
                    + Add
                </button>
                <button
                    className="btn btn-outline-danger"
                    disabled={noneSelected || deleting}
                    onClick={() => !noneSelected && remove({ variables: { ids: selectedIds } })}
                >
                    Delete {noneSelected ? "" : `(${selectedIds.length})`}
                </button>
            </div>

            {/* grid region */}
            <div className="grid-wrap flex-grow-1 min-h-0">
                <SmartTable<Row>
                    rows={rows}
                    columns={columns}
                    getRowId={(r) => r.id}
                    selectionKey={SELECTION_KEY}
                    onSelectionChange={setSelectedIds}
                    onRowDoubleClick={openEditor}
                    tableClassName="table table-sm table-hover table-striped align-middle mb-0 table-scroll-body"
                />
            </div>

            {loading && <div className="text-muted py-2">Loading…</div>}
        </div>
    );
}

export default TransactionsPage;