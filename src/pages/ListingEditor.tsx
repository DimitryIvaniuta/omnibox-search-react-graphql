// - Full-screen editor (no sidebar/header assumed by your routing shell)
// - Uses ContactPicker for selecting a related Contact with debounced Omnibox search
// - Navigates back to list and highlights the saved/created record

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Decimal from "decimal.js";
import {
    useListingByIdQuery,
    useListingCreateMutation,
    useListingUpdateMutation,
    ListingsDocument,
} from "@/generated/write-oltp/graphql";
import ContactPicker from "@/components/pickers/ContactPicker";
import PriceField from "@/fields/PriceField";

type MoneyShape = { amount: string; currency: string }; // what PriceField writes into the form

type ListingForm = {
    title: string;
    subtitle: string | null;
    mlsId: string | null;
    contactId: string; // required by schema
    price: MoneyShape | null; // filled by PriceField; must be non-null on create
    version: number | null;
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

    // Single source of truth for the form; PriceField writes to `price`
    const [form, setForm] = useState<ListingForm>({
        title: "",
        subtitle: null,
        mlsId: null,
        contactId: "",
        price: null,
        version: null,
    });

    // Prefill non-price fields; price is prefilled by PriceField via its `value` prop
    useEffect(() => {
        if (!isNew && data?.listing) {
            const l = data.listing;
            setForm((prev) => ({
                ...prev,
                title: l.title ?? "",
                subtitle: l.subtitle ?? null,
                mlsId: l.mlsId ?? null,
                contactId: l.contactId ?? "",
                version: l.version ?? null,
            }));
        }
    }, [isNew, data]);

    const [createListing, { loading: creating }] = useListingCreateMutation({
        refetchQueries: [{ query: ListingsDocument, variables: { offset: 0, limit: 50 } }],
        awaitRefetchQueries: true,
        onCompleted: (res) => {
            const created = res.createListing;
            nav("/listings", { state: { highlightId: created.id } });
        },
    });

    const [updateListing, { loading: updating }] = useListingUpdateMutation({
        refetchQueries: [{ query: ListingsDocument, variables: { offset: 0, limit: 50 } }],
        awaitRefetchQueries: true,
        onCompleted: (res) => {
            const updated = res.updateListing;
            nav("/listings", { state: { highlightId: updated.id } });
        },
    });

    const busy = creating || updating;

    // Create requires: title, mlsId, contactId, price (non-null)
    const validCommon =
        form.title.trim().length > 0 &&
        (form.mlsId?.trim().length ?? 0) > 0 &&
        !!form.contactId;

    const validCreate = validCommon && !!form.price;
    const validUpdate = validCommon && !!form.price && form.version != null;

    const priceForMutation = () => ({
        amount: new Decimal(form.price!.amount),   // convert string to Decimal
        currency: form.price!.currency,
    });

    const onSubmit: React.FormEventHandler = async (e) => {
        e.preventDefault();
        if (busy) return;

        if (isNew) {
            if (!validCreate) return;

            // const priceForMutation = form.price as unknown as {
            //     amount: unknown; // Decimal per codegen, but backend accepts serialized scalar
            //     currency: string;
            // };

            await createListing({
                variables: {
                    input: {
                        title: form.title,
                        subtitle: form.subtitle,
                        mlsId: form.mlsId,
                        contactId: form.contactId,
                        price: priceForMutation(),
                    },
                },
            });
        } else {
            if (!validUpdate) return;

            // const priceForMutation = form.price as unknown as {
            //     amount: unknown;
            //     currency: string;
            // };

            await updateListing({
                variables: {
                    id: id as string,
                    input: {
                        title: form.title,
                        subtitle: form.subtitle,
                        mlsId: form.mlsId,
                        contactId: form.contactId,
                        version: form.version as number,
                        price: priceForMutation(),
                    },
                },
            });
        }
    };

    return (
        <div className="container-fluid p-0 d-flex flex-column h-100">
            {/* Header */}
            <div className="bg-white border-bottom px-3 py-2 d-flex align-items-center gap-2">
                <button className="btn btn-link text-decoration-none" onClick={() => nav("/listings")}>
                    <i className="bi bi-arrow-left" /> Back
                </button>
                <h5 className="mb-0 fw-semibold">{isNew ? "Create Listing" : "Edit Listing"}</h5>
            </div>

            {/* Body */}
            <form className="flex-grow-1 min-h-0 overflow-auto px-3 py-3" onSubmit={onSubmit}>
                <div className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label">
                            Title {!form.title.trim() && <span className="text-danger small">required*</span>}
                        </label>
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
                            value={form.subtitle ?? ""}
                            onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value || null }))}
                        />
                    </div>

                    <div className="col-md-4">
                        <label className="form-label">
                            MLS ID {!form.mlsId?.trim() && <span className="text-danger small">required*</span>}
                        </label>
                        <input
                            className="form-control"
                            value={form.mlsId ?? ""}
                            onChange={(e) => setForm((f) => ({ ...f, mlsId: e.target.value || null }))}
                            required
                        />
                    </div>

                    <div className="col-md-8">
                        <label className="form-label">
                            Contact {!form.contactId && <span className="text-danger small">required*</span>}
                        </label>
                        <ContactPicker
                            value={form.contactId}
                            onChange={(id) => setForm((f) => ({ ...f, contactId: id ?? "" }))}
                        />
                    </div>

                    {/* Price – self-contained. It writes form.price directly and can prefill from server */}
                    <div className="col-md-4">
                        <PriceField<ListingForm>
                            form={form}
                            setForm={setForm}
                            name="price"
                            value={data?.listing?.price ?? null} // may be Decimal | string – handled inside
                            required={true}                      // price is REQUIRED by your CreateListingInput
                            className="mb-2"
                        />
                    </div>

                    <div className="col-12">
                        <button
                            className="btn btn-primary"
                            type="submit"
                            disabled={busy || (isNew ? !validCreate : !validUpdate)}
                        >
                            {busy ? "Saving…" : "Save"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
