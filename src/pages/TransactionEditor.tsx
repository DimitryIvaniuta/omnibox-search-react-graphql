// TransactionEditor.tsx
// Full-screen editor. Requires Title + Contact + Listing. Uses ContactPicker & ListingPicker.
// After save, navigates to /transactions and highlights the row.

import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Decimal from "decimal.js";
import ContactPicker from "@/components/pickers/ContactPicker";
import ListingPicker from "@/components/pickers/ListingPicker";
import {
    useTransactionByIdQuery,
    useTransactionCreateMutation,
    useTransactionUpdateMutation,
    TransactionsDocument,
} from "@/generated/write-oltp/graphql";

type FormState = {
    title: string;
    subtitle: string;
    contactId: string;    // required
    listingId: string;    // required
    totalAmount: string;
    totalCurrency: string;
    version: number;
};

const TransactionEditor = ()=> {
    const nav = useNavigate();
    const { id } = useParams<{ id: string }>();
    const isNew = !id || id === "new";

    const { data } = useTransactionByIdQuery({
        skip: isNew,
        variables: { id: id as string },
        fetchPolicy: "cache-and-network",
    });

    const [form, setForm] = useState<FormState>({
        title: "",
        subtitle: "",
        contactId: "",
        listingId: "",
        totalAmount: "0.00",
        totalCurrency: "USD",
        version: 0,
    });

    useEffect(() => {
        if (!isNew && data?.transaction) {
            const t = data.transaction;
            setForm({
                title: t.title ?? "",
                subtitle: t.subtitle ?? "",
                contactId: t.contactId ?? "",
                listingId: t.listingId ?? "",
                totalAmount: t.total ? new Decimal(t.total.amount).toFixed(2) : "0.00",
                totalCurrency: t.total?.currency ?? "USD",
                version: t.version,
            });
        }
    }, [isNew, data]);

    const [createTx, { loading: creating }] = useTransactionCreateMutation({
        refetchQueries: [{ query: TransactionsDocument, variables: { offset: 0, limit: 50 } }],
        awaitRefetchQueries: true,
        onCompleted: (res) => {
            const created = res.createTransaction;
            nav("/transactions", { state: { highlightId: created.id } });
        },
    });
    const [updateTx, { loading: updating }] = useTransactionUpdateMutation({
        onCompleted: (res) => {
            const updated = res.updateTransaction;
            nav("/transactions", { state: { highlightId: updated.id } });
        },
    });

    const totalInput = useMemo(
        () => ({
            amount: new Decimal(form.totalAmount || "0"),
            currency: (form.totalCurrency || "USD").toUpperCase(),
        }),
        [form.totalAmount, form.totalCurrency]
    );

    const isSaving = creating || updating;
    const isValid = form.title.trim().length > 0 && !!form.contactId && !!form.listingId;

    const formRef = useRef<HTMLFormElement>(null);

    const onSubmit: React.FormEventHandler = (e) => {
        e.preventDefault();
        if (!isValid) return;

        if (isNew) {
            void createTx({
                variables: {
                    input: {
                        title: form.title,
                        subtitle: form.subtitle || null,
                        contactId: form.contactId,
                        listingId: form.listingId,
                        total: totalInput,
                    },
                },
            });
        } else {
            void updateTx({
                variables: {
                    id: id as string,
                    input: {
                        title: form.title,
                        subtitle: form.subtitle || null,
                        contactId: form.contactId,
                        listingId: form.listingId,
                        version: form.version,
                        total: totalInput,
                    },
                },
            });
        }
    };

    return (
        <div className="container-fluid p-0 d-flex flex-column h-100">
            {/* top bar */}
            <div className="bg-white border-bottom px-3 py-2 d-flex align-items-center gap-2">
                <button className="btn btn-link text-decoration-none" onClick={() => nav("/transactions")}>
                    <i className="bi bi-arrow-left" /> Back
                </button>
                <h5 className="mb-0 fw-semibold">{isNew ? "Create Transaction" : "Edit Transaction"}</h5>
            </div>

            {/* body */}
            <form ref={formRef} className="flex-grow-1 min-h-0 overflow-auto px-3 py-3" onSubmit={onSubmit}>
                <div className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label">Title</label>
                        <input
                            className="form-control"
                            value={form.title}
                            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                            required
                        />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Subtitle</label>
                        <input
                            className="form-control"
                            value={form.subtitle}
                            onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
                        />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Contact <span className="text-danger">*</span></label>
                        <ContactPicker
                            value={form.contactId || null}
                            onChange={(id) => setForm((f) => ({ ...f, contactId: id ?? "" }))}
                        />
                        {!form.contactId && <small className="text-danger">Contact is required</small>}
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Listing <span className="text-danger">*</span></label>
                        <ListingPicker
                            value={form.listingId || null}
                            onChange={(id) => setForm((f) => ({ ...f, listingId: id ?? "" }))}
                        />
                        {!form.listingId && <small className="text-danger">Listing is required</small>}
                    </div>

                    <div className="col-md-3">
                        <label className="form-label">Total</label>
                        <input
                            className="form-control"
                            inputMode="decimal"
                            value={form.totalAmount}
                            onChange={(e) => setForm((f) => ({ ...f, totalAmount: e.target.value }))}
                        />
                    </div>
                    <div className="col-md-2">
                        <label className="form-label">Currency</label>
                        <input
                            className="form-control"
                            value={form.totalCurrency}
                            onChange={(e) => setForm((f) => ({ ...f, totalCurrency: e.target.value.toUpperCase() }))}
                        />
                    </div>

                    {!isNew && (
                        <div className="col-md-3">
                            <label className="form-label">Version</label>
                            <input className="form-control" value={form.version} readOnly />
                        </div>
                    )}
                    <div className="ms-auto d-flex gap-2">
                        <button
                            className="btn btn-primary"
                            type="button"
                            disabled={isSaving || !isValid}
                            onClick={() => formRef.current?.requestSubmit()}
                        >
                            {isSaving ? "Saving…" : "Save"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default TransactionEditor;