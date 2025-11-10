
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FormProvider, useForm, Controller } from "react-hook-form";
import Decimal from "decimal.js";
import {
    useListingByIdQuery,
    useListingCreateMutation,
    useListingUpdateMutation,
    ListingsDocument,
} from "@/generated/write-oltp/graphql";
import ContactPicker from "@/components/pickers/ContactPicker";
import { MoneyInput } from "@/fields";
import PriceField from "@/fields/PriceField";
// import PriceField, { MoneyInput } from "@/components/PriceField";

type FormValues = {
    title: string;
    subtitle: string | null;
    mlsId: string | null;
    contactId: string;
    price: MoneyInput | null;   // RHF stores normalized strings; convert at submit
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

    const methods = useForm<FormValues>({
        mode: "onChange",
        defaultValues: {
            title: "",
            subtitle: null,
            mlsId: null,
            contactId: "",
            price: null,
            version: null,
        },
    });

    const { handleSubmit, reset, watch, formState } = methods;
    const busy = formState.isSubmitting;

    // Prefill from server
    useEffect(() => {
        if (!isNew && data?.listing) {
            const l = data.listing;
            reset({
                title: l.title ?? "",
                subtitle: l.subtitle ?? null,
                mlsId: l.mlsId ?? null,
                contactId: l.contactId ?? "",
                // allow Decimal|string; PriceField will normalize on first render
                price: (l.price
                    ? { amount: String(l.price.amount as any), currency: l.price.currency }
                    : null) as any,
                version: l.version ?? null,
            });
        }
    }, [isNew, data, reset]);

    const [createListing] = useListingCreateMutation({
        refetchQueries: [{ query: ListingsDocument, variables: { offset: 0, limit: 50 } }],
        awaitRefetchQueries: true,
        onCompleted: (res) => nav("/listings", { state: { highlightId: res.createListing.id } }),
    });

    const [updateListing] = useListingUpdateMutation({
        refetchQueries: [{ query: ListingsDocument, variables: { offset: 0, limit: 50 } }],
        awaitRefetchQueries: true,
        onCompleted: (res) => nav("/listings", { state: { highlightId: res.updateListing.id } }),
    });

    const onSubmit = handleSubmit(async (vals) => {
        // required fields
        if (!vals.title.trim() || !vals.mlsId?.trim() || !vals.contactId) return;

        // Price is REQUIRED by your CreateListingInput
        if (!vals.price) return;

        const price = {
            amount: new Decimal(vals.price.amount),  // satisfy MoneyInput(BigDecimal)
            currency: vals.price.currency,
        };

        if (isNew) {
            await createListing({
                variables: {
                    input: {
                        title: vals.title,
                        subtitle: vals.subtitle,
                        mlsId: vals.mlsId,
                        contactId: vals.contactId,
                        price,
                    },
                },
            });
        } else {
            await updateListing({
                variables: {
                    id: id as string,
                    input: {
                        title: vals.title,
                        subtitle: vals.subtitle,
                        mlsId: vals.mlsId,
                        contactId: vals.contactId,
                        version: vals.version ?? 0,
                        price,
                    },
                },
            });
        }
    });

    const values = watch(); // for button disable logic

    const canSave =
        !busy &&
        values.title.trim().length > 0 &&
        (values.mlsId?.trim().length ?? 0) > 0 &&
        !!values.contactId &&
        !!values.price;

    return (
        <div className="container-fluid p-0 d-flex flex-column h-100">
            <div className="bg-white border-bottom px-3 py-2 d-flex align-items-center gap-2">
                <button className="btn btn-link text-decoration-none" onClick={() => nav("/listings")}>
                    <i className="bi bi-arrow-left" /> Back
                </button>
                <h5 className="mb-0 fw-semibold">{isNew ? "Create Listing" : "Edit Listing"}</h5>
            </div>

            <FormProvider {...methods}>
                <form className="flex-grow-1 min-h-0 overflow-auto px-3 py-3" onSubmit={onSubmit}>
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label">Title</label>
                            <input className="form-control" {...methods.register("title", { required: true })} />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">Subtitle</label>
                            <input
                                className="form-control"
                                {...methods.register("subtitle")}
                                onChange={(e) => methods.setValue("subtitle", e.target.value || null)}
                            />
                        </div>

                        <div className="col-md-4">
                            <label className="form-label">MLS ID</label>
                            <input className="form-control" {...methods.register("mlsId", { required: true })} />
                        </div>

                        <div className="col-md-8">
                            <label className="form-label">Contact</label>
                            <Controller
                                name="contactId"
                                control={methods.control}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <ContactPicker value={field.value} onChange={(id) => field.onChange(id ?? "")} />
                                )}
                            />
                        </div>

                        <div className="col-md-4">
                            {/* No form/setForm props needed */}
                            <PriceField name="price" required className="mb-2" />
                        </div>

                        <div className="col-12">
                            <button className="btn btn-primary" type="submit" disabled={!canSave}>
                                {busy ? "Saving…" : "Save"}
                            </button>
                        </div>
                    </div>
                </form>
            </FormProvider>
        </div>
    );
}
