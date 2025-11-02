import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Decimal from "decimal.js";
import {
    useListingByIdQuery,
    useListingCreateMutation,
    useListingUpdateMutation,
} from "@/generated/write-oltp/graphql";

type FormState = {
    title: string;
    subtitle: string;
    mlsId: string;
    contactId: string;
    priceAmount: string;
    priceCurrency: string;
    version: number;
};

const ListingEditor = ()=> {
    const nav = useNavigate();
    const { id } = useParams();
    const isNew = !id || id === "new";

    const { data } = useListingByIdQuery({
        skip: isNew,
        variables: { id: id as string },
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
        onCompleted: () => nav("/listings"),
    });
    const [updateListing, { loading: updating }] = useListingUpdateMutation({
        onCompleted: () => nav("/listings"),
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const price = {
            amount: new Decimal(form.priceAmount || "0"),
            currency: (form.priceCurrency || "USD").toUpperCase(),
        };
        if (isNew) {
            createListing({
                variables: {
                    input: {
                        title: form.title,
                        subtitle: form.subtitle || null,
                        mlsId: form.mlsId || null,
                        contactId: form.contactId,
                        price,
                    },
                },
            });
        } else {
            updateListing({
                variables: {
                    id: id as string,
                    input: {
                        title: form.title,
                        subtitle: form.subtitle || null,
                        mlsId: form.mlsId || null,
                        contactId: form.contactId || null,
                        version: form.version,
                        price,
                    },
                },
            });
        }
    };

    return (
        <div className="container-fluid py-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <button className="btn btn-link" onClick={() => nav("/listings")}>&larr; Back</button>
                <h5 className="mb-0">{isNew ? "Create Listing" : "Edit Listing"}</h5>
                <div />
            </div>

            <form className="row g-3" onSubmit={submit}>
                <div className="col-md-6">
                    <label className="form-label">Title</label>
                    <input className="form-control" value={form.title}
                           onChange={(e) =>
                               setForm(f => ({ ...f, title: e.target.value }))} required />
                </div>
                <div className="col-md-6">
                    <label className="form-label">Subtitle</label>
                    <input className="form-control" value={form.subtitle}
                           onChange={(e) =>
                               setForm(f => ({ ...f, subtitle: e.target.value }))} />
                </div>
                <div className="col-md-4">
                    <label className="form-label">MLS ID</label>
                    <input className="form-control" value={form.mlsId}
                           onChange={(e) =>
                               setForm(f => ({ ...f, mlsId: e.target.value }))} />
                </div>
                <div className="col-md-4">
                    <label className="form-label">Contact ID</label>
                    <input className="form-control" value={form.contactId}
                           onChange={(e) =>
                               setForm(f => ({ ...f, contactId: e.target.value }))} />
                </div>
                <div className="col-md-2">
                    <label className="form-label">Price</label>
                    <input className="form-control" value={form.priceAmount}
                           onChange={(e) =>
                               setForm(f => ({ ...f, priceAmount: e.target.value }))} />
                </div>
                <div className="col-md-2">
                    <label className="form-label">Currency</label>
                    <input className="form-control" value={form.priceCurrency}
                           onChange={(e) =>
                               setForm(f => ({ ...f, priceCurrency: e.target.value }))} />
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

export default ListingEditor;