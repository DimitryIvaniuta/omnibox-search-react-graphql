import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FormProvider, useForm, Controller } from "react-hook-form";
import Decimal from "decimal.js";

// generated GraphQL hooks (names follow your existing pattern)
import {
    useTransactionByIdQuery,
    useTransactionCreateMutation,
    useTransactionUpdateMutation,
    TransactionsDocument,
} from "@/generated/write-oltp/graphql";

import ContactPicker from "@/components/pickers/ContactPicker";
import ListingPicker from "@/components/pickers/ListingPicker";
import {MoneyInput} from "@/fields";
import PriceField from "@/fields/PriceField";

type FormValues = {
    title: string;
    status?: string | null;
    contactId: string;
    listingId: string;
    total: MoneyInput | null;          // handled by PriceField; amount as normalized string
    version: number | null;
};

export default function TransactionEditor() {
    const nav = useNavigate();
    const { id } = useParams<{ id: string }>();
    const isNew = !id || id === "new";

    // Query only when editing
    const { data } = useTransactionByIdQuery({
        skip: isNew,
        variables: { id: id as string },
        fetchPolicy: "cache-and-network",
    });

    const methods = useForm<FormValues>({
        mode: "onChange",
        defaultValues: {
            title: "",
            status: "OPEN",
            contactId: "",
            listingId: "",
            total: null,
            version: null,
        },
    });

    const { handleSubmit, reset, watch, formState, control } = methods;
    const busy = formState.isSubmitting;

    // Prefill when editing
    useEffect(() => {
        if (!isNew && data?.transaction) {
            const t = data.transaction;
            reset({
                title: t.title ?? "",
                status: t.status ?? "OPEN",
                contactId: t.contactId ?? "",
                listingId: t.listingId ?? "",
                version: t.version ?? null,
                // allow Decimal|string; PriceField will normalize on first render
                total: t.total
                    ? { amount: String((t.total.amount as any)), currency: t.total.currency }
                    : null,
            });
        }
    }, [isNew, data, reset]);

    const [createTx] = useTransactionCreateMutation({
        refetchQueries: [{ query: TransactionsDocument, variables: { offset: 0, limit: 50 } }],
        awaitRefetchQueries: true,
        onCompleted: (res) =>
            nav("/transactions", { state: { highlightId: res.createTransaction.id } }),
    });

    const [updateTx] = useTransactionUpdateMutation({
        refetchQueries: [{ query: TransactionsDocument, variables: { offset: 0, limit: 50 } }],
        awaitRefetchQueries: true,
        onCompleted: (res) =>
            nav("/transactions", { state: { highlightId: res.updateTransaction.id } }),
    });

    const onSubmit = handleSubmit(async (vals) => {
        // Guard required fields
        if (!vals.title.trim() || !vals.contactId || !vals.listingId || !vals.total) return;

        const totalForMutation = {
            amount: new Decimal(vals.total.amount), // GraphQL Money(BigDecimal)
            currency: vals.total.currency,
        };

        if (isNew) {
            await createTx({
                variables: {
                    input: {
                        title: vals.title,
                        status: vals.status,
                        contactId: vals.contactId,
                        listingId: vals.listingId,
                        total: totalForMutation,
                    },
                },
            });
        } else {
            await updateTx({
                variables: {
                    id: id as string,
                    input: {
                        title: vals.title,
                        status: vals.status,
                        contactId: vals.contactId,
                        listingId: vals.listingId,
                        version: vals.version ?? 0,
                        total: totalForMutation,
                    },
                },
            });
        }
    });

    const v = watch();
    const canSave =
        !busy &&
        v.title.trim().length > 0 &&
        !!v.contactId &&
        !!v.listingId &&
        !!v.total;

    return (
        <div className="container-fluid p-0 d-flex flex-column h-100">
            {/* Pinned header */}
            <div className="bg-white border-bottom px-3 py-2 d-flex align-items-center gap-2">
                <button className="btn btn-link text-decoration-none" onClick={() => nav("/transactions")}>
                    <i className="bi bi-arrow-left" /> Back
                </button>
                <h5 className="mb-0 fw-semibold">{isNew ? "Create Transaction" : "Edit Transaction"}</h5>
            </div>

            <FormProvider {...methods}>
                <form className="flex-grow-1 min-h-0 overflow-auto px-3 py-3" onSubmit={onSubmit}>
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label">Title</label>
                            <input className="form-control" {...methods.register("title", { required: true })} />
                        </div>

                        <div className="col-md-3">
                            <label className="form-label">Status</label>
                            <select className="form-select" {...methods.register("status", { required: true })}>
                                <option value="OPEN">OPEN</option>
                                <option value="CLOSED">CLOSED</option>
                                {/* add more if your schema contains them */}
                            </select>
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">Contact</label>
                            <Controller
                                name="contactId"
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <ContactPicker value={field.value} onChange={(id) => field.onChange(id ?? "")} />
                                )}
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">Listing</label>
                            <Controller
                                name="listingId"
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <ListingPicker value={field.value} onChange={(id) => field.onChange(id ?? "")} />
                                )}
                            />
                        </div>

                        <div className="col-md-4">
                            {/* Money input with live formatting; writes {amount:string,currency} to RHF */}
                            <PriceField name="total" required label="Total amount" />
                        </div>
                        <div className="col-12">
                            <button className="btn btn-primary" type="submit" disabled={!canSave}>
                                {busy ? "Saving…" : "Save"}
                            </button>
                            <button
                                type="button"
                                className="btn btn-outline-secondary ms-2"
                                onClick={() => nav("/transactions")}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </form>
            </FormProvider>
        </div>
    );
}
