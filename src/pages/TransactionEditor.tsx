import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Decimal from "decimal.js";
import {
    useTransactionByIdQuery,
    useTransactionCreateMutation,
    useTransactionUpdateMutation,
} from "@/generated/write-oltp/graphql";

type FormState = {
    title: string;
    status: string;
    totalAmount: string;
    totalCurrency: string;
    contactId: string;
    listingId: string;
    version: number;
};

export default function TransactionEditor() {
    const nav = useNavigate();
    const { id } = useParams();
    const isNew = !id || id === "new";

    const { data } = useTransactionByIdQuery({
        skip: isNew,
        variables: { id: id as string },
    });

    const [form, setForm] = useState<FormState>({
        title: "",
        status: "OPEN",
        totalAmount: "0.00",
        totalCurrency: "USD",
        listingId: "",
        contactId: "",
        version: 0,
    });

    useEffect(() => {
        if (!isNew && data?.transaction) {
            const t = data.transaction;
            setForm({
                title: t.title ?? "",
                status: t.status ?? "OPEN",
                totalAmount: t.total ? new Decimal(t.total.amount).toFixed(2) : "0.00",
                totalCurrency: t.total?.currency ?? "USD",
                contactId: t.contactId,
                listingId: t.listingId,
                version: t.version,
            });
        }
    }, [isNew, data]);

    const [createTx, { loading: creating }] = useTransactionCreateMutation({
        onCompleted: () => nav("/transactions"),
    });
    const [updateTx, { loading: updating }] = useTransactionUpdateMutation({
        onCompleted: () => nav("/transactions"),
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const total = {
            amount: new Decimal(form.totalAmount || "0"),
            currency: (form.totalCurrency || "USD").toUpperCase(),
        };

        if (isNew) {
            createTx({
                variables: {
                    input: {
                        title: form.title,
                        status: form.status,
                        contactId: form.contactId,
                        listingId: form.listingId,
                        total,
                    },
                },
            });
        } else {
            updateTx({
                variables: {
                    id: id as string,
                    input: {
                        title: form.title,
                        status: form.status,
                        total,
                        version: form.version,
                    },
                },
            });
        }
    };

    return (
        <div className="container-fluid py-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <button className="btn btn-link" onClick={() => nav("/transactions")}>&larr; Back</button>
                <h5 className="mb-0">{isNew ? "Create Transaction" : "Edit Transaction"}</h5>
                <div />
            </div>

            <form className="row g-3" onSubmit={submit}>
                <div className="col-md-6">
                    <label className="form-label">Title</label>
                    <input className="form-control" value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} required />
                </div>
                <div className="col-md-3">
                    <label className="form-label">Status</label>
                    <input className="form-control" value={form.status} onChange={(e) => setForm(f => ({ ...f, status: e.target.value }))} />
                </div>
                <div className="col-md-2">
                    <label className="form-label">Total</label>
                    <input className="form-control" value={form.totalAmount} onChange={(e) => setForm(f => ({ ...f, totalAmount: e.target.value }))} />
                </div>
                <div className="col-md-1">
                    <label className="form-label">Cur</label>
                    <input className="form-control" value={form.totalCurrency} onChange={(e) => setForm(f => ({ ...f, totalCurrency: e.target.value }))} />
                </div>

                <div className="col-12">
                    <button className="btn btn-primary" type="submit" disabled={creating || updating}>
                        {creating || updating ? "Saving…" : "Save"}
                    </button>
                </div>
            </form>
        </div>
    );
}
