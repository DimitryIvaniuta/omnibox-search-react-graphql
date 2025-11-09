// - Full-screen editor (no sidebar/header assumed by your routing shell)
// - Uses ContactPicker for selecting a related Contact with debounced Omnibox search
// - Navigates back to list and highlights the saved/created record

import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Decimal from "decimal.js";
import {
    useListingByIdQuery,
    useListingCreateMutation,
    useListingUpdateMutation,
} from "@/generated/write-oltp/graphql";
import ContactPicker from "@/components/pickers/ContactPicker";

type FormState = {
    title: string;
    subtitle: string;
    mlsId: string;
    contactId: string;
    priceAmount: string;
    priceCurrency: string;
    version: number;
};

export default function ListingEditor() {
    const nav = useNavigate();
    const { id } = useParams<{ id: string }>();
    const isNew = !id || id === "new";

    const { data } = useListingByIdQuery({
        skip: isNew,
        variables: { id: id as string },
        fetchPolicy: "cache-and-network",
    });

    const [form, setForm] = useState<FormState>({
        title: "",
        subtitle: "",
        mlsId: "",
        contactId: "",
        priceAmount: "0.00",
        priceCurrency: "USD",
        version: 0,
    });

    useEffect(() => {
        if (!isNew && data?.listing) {
            const l = data.listing;
            setForm({
                title: l.title ?? "",
                subtitle: l.subtitle ?? "",
                mlsId: l.mlsId ?? "",
                contactId: l.contactId ?? "",
                priceAmount: l.price ? new Decimal(l.price.amount).toFixed(2) : "0.00",
                priceCurrency: l.price?.currency ?? "USD",
                version: l.version,
            });
        }
    }, [isNew, data]);

    const [createListing, { loading: creating }] = useListingCreateMutation({
        onCompleted: (res) => {
            const created = res.createListing;
            nav("/listings", { state: { highlightId: created.id } });
        },
    });

    const [updateListing, { loading: updating }] = useListingUpdateMutation({
        onCompleted: (res) => {
            const updated = res.updateListing;
            nav("/listings", { state: { highlightId: updated.id } });
        },
    });

    const priceInput = useMemo(
        () => ({
            amount: new Decimal(form.priceAmount || "0"),
            currency: (form.priceCurrency || "USD").toUpperCase(),
        }),
        [form.priceAmount, form.priceCurrency]
    );

    const onSubmit: React.FormEventHandler = (e) => {
        e.preventDefault();

        // Guard minimal fields
        if (!form.title.trim()) return;

        if (isNew) {
            void createListing({
                variables: {
                    input: {
                        title: form.title,
                        subtitle: form.subtitle || null,
                        mlsId: form.mlsId || null,
                        contactId: form.contactId, // can be null if not chosen yet
                        price: priceInput,
                    },
                },
            });
        } else {
            void updateListing({
                variables: {
                    id: id as string,
                    input: {
                        title: form.title,
                        subtitle: form.subtitle || null,
                        mlsId: form.mlsId || null,
                        contactId: form.contactId, // nullable on update as well
                        version: form.version,
                        price: priceInput,
                    },
                },
            });
        }
    };

    return (
        <div className="container-fluid p-0 d-flex flex-column h-100">
            {/* editor header */}
            <div className="bg-white border-bottom px-3 py-2 d-flex align-items-center gap-2">
                <button className="btn btn-link text-decoration-none" onClick={() => nav("/listings")}>
                    <i className="bi bi-arrow-left" /> Back
                </button>
                <h5 className="mb-0 fw-semibold">
                    {isNew ? "Create Listing" : "Edit Listing"}
                </h5>
            </div>

            {/* editor body */}
            <form className="flex-grow-1 min-h-0 overflow-auto px-3 py-3" onSubmit={onSubmit}>
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

                    <div className="col-md-4">
                        <label className="form-label">MLS ID</label>
                        <input
                            className="form-control"
                            value={form.mlsId}
                            onChange={(e) => setForm((f) => ({ ...f, mlsId: e.target.value }))}
                        />
                    </div>

                    <div className="col-md-8">
                        <label className="form-label">Contact</label>
                        {/* Debounced omnibox-backed picker; stores ID only */}
                        <ContactPicker
                            value={form.contactId}
                            onChange={(id) =>
                                setForm((f) => ({ ...f, contactId: id ?? "" }))}
                        />
                    </div>

                    <div className="col-md-3">
                        <label className="form-label">Price</label>
                        <input
                            className="form-control"
                            inputMode="decimal"
                            value={form.priceAmount}
                            onChange={(e) => setForm((f) => ({ ...f, priceAmount: e.target.value }))}
                        />
                    </div>
                    <div className="col-md-2">
                        <label className="form-label">Currency</label>
                        <input
                            className="form-control"
                            value={form.priceCurrency}
                            onChange={(e) =>
                                setForm((f) => ({ ...f, priceCurrency: e.target.value.toUpperCase() }))
                            }
                        />
                    </div>

                    <div className="col-12">
                        <button className="btn btn-primary" type="submit" disabled={creating || updating}>
                            {creating || updating ? "Saving…" : "Save"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
