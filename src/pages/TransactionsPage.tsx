import { useNavigate } from "react-router-dom";
import { useTransactionsQuery } from "@/generated/write-oltp/graphql";

const TransactionsPage = ()=> {
    const nav = useNavigate();
    const { data, loading } = useTransactionsQuery({ variables: { offset: 0, limit: 50 } });

    const rows = data?.transactions ?? [];

    return (
        <div className="d-flex flex-column gap-3">
            <div className="d-flex gap-2 align-items-center sticky-top bg-white py-2" style={{ top: 56 }}>
                {/* Enable when you add mutation: useCreateTransactionMutation */}
                <button className="btn btn-primary" onClick={() => nav("/transactions/new")}>+ Add</button>
                {/* Optional bulk delete if you expose deleteTransactions mutation */}
                <button className="btn btn-outline-danger" disabled>Delete</button>
            </div>

            <div className="table-responsive">
                <table className="table table-sm align-middle">
                    <thead>
                    <tr>
                        <th>Title</th>
                        <th>Status</th>
                        <th className="text-end">Total</th>
                    </tr>
                    </thead>
                    <tbody>
                    {rows.map(r => (
                        <tr key={r.id} onDoubleClick={() => nav(`/transactions/${r.id}`)} style={{ cursor: "pointer" }}>
                            <td>{r.title}</td>
                            <td>{r.status}</td>
                            <td className="text-end">
                                {r.total ? `${r.total.amount} ${r.total.currency}` : "—"}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {loading && <div className="text-muted">Loading…</div>}
        </div>
    );
}

export default TransactionsPage;