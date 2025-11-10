// ListingsPage.tsx
// - Sticky header, tbody-only scroll using the same SmartTable pattern you use for Contacts
// - Bulk delete with preserved selection (sessionStorage key)
// - Double-click row -> full-screen ListingEditor

import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SmartTable, { Column } from "@/components/table/SmartTable";
import {
    useListingsQuery,
    useDeleteListingsMutation,
    ListingsQuery,
} from "@/generated/write-oltp/graphql";
import { formatMoney } from "@/utils/money";

type Row = NonNullable<ListingsQuery["listings"]>[number];

const SELECTION_KEY = "listings:selectedIds";

export default function ListingsPage() {
    const nav = useNavigate();
    const { state } = useLocation() as { state?: { highlightId?: string } };

    const { data, loading, refetch } = useListingsQuery({
        variables: { offset: 0, limit: 50 },
        fetchPolicy: "cache-and-network",
    });

    const [deleteListings, { loading: deleting }] = useDeleteListingsMutation({
        onCompleted: () => refetch(),
    });

    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const rows: Row[] = data?.listings ?? [];

    const columns: Column<Row>[] = useMemo(
        () => [
            {
                key: "title",
                header: "Title",
                accessor: (r) => r.title ?? "—",
                // expand column to fill remaining width
                minWidth: 280,
                cell: (r) => (
                    <button
                        type="button"
                        className="btn btn-link p-0 align-baseline text-decoration-none text-truncate"
                        style={{ maxWidth: 300 }}
                        onClick={() => nav(`/listings/${r.id}`)}
                        aria-label={`Open ${r.title} details`}
                    >
                        {r.title}
                    </button>
                ),
            },
            {
                key: "mls",
                header: "MLS ID",
                accessor: (r) => r.mlsId ?? "—",
                maxWidth: 120,
            },
            {
                key: "price",
                header: "Price",
                className: "text-end",
                cell: (r) => formatMoney(r.price, { style: "currency" }),
                minWidth: 180,
            },
        ],
        []
    );

    const onDelete = () => {
        if (!selectedIds.length) return;
        deleteListings({ variables: { ids: selectedIds } });
    };

    return (
        <div className="page-with-grid d-flex flex-column h-100">
            {/* pinned actions row (same spacing as Contacts) */}
            <div
                className="sticky-top bg-white py-2 border-bottom d-flex align-items-center gap-2"
                style={{ top: 56, zIndex: 1 }}
            >
                <button className="btn btn-primary" onClick={() => nav("/listings/new")}>
                    + Add
                </button>

                <button
                    className="btn btn-outline-danger"
                    disabled={!selectedIds.length || deleting}
                    onClick={onDelete}
                    title={selectedIds.length ? `Delete ${selectedIds.length} selected` : "Select items to delete"}
                >
                    Delete {selectedIds.length ? `(${selectedIds.length})` : ""}
                </button>
            </div>

            {/* grid owns the scrollable area */}
            <div className="grid-wrap flex-grow-1 min-h-0">
                <SmartTable<Row>
                    rows={rows}
                    columns={columns}
                    getRowId={(r) => r.id}
                    highlightedId={state?.highlightId ?? null}
                    selectionKey={SELECTION_KEY}
                    onSelectionChange={setSelectedIds}
                    // header/body sizing handled inside SmartTable (tbody-only scroll)
                    tableClassName="table table-sm table-hover table-striped align-middle mb-0 table-scroll-body"
                    onRowDoubleClick={(r) => nav(`/listings/${r.id}`)}
                />
            </div>

            {loading && <div className="text-muted py-2">Loading…</div>}
        </div>
    );
}
