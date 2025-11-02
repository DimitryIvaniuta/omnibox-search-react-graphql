import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    useContactByIdQuery,
    useContactCreateMutation,
    useContactUpdateMutation
} from "@/generated/write-oltp/graphql";

type FormState = {
    name: string;
    email: string;
    phone: string;
    version: number;
};

export default function ContactEditor() {
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);

    const nav = useNavigate();
    const { id } = useParams();
    const isNew = !id || id === "new";

    const { data } = useContactByIdQuery({
        skip: isNew,
        variables: { id: id as string },
    });

    const [form, setForm] = useState<FormState>({
        name: "",
        email: "",
        phone: "",
        version: 0,
    });

    useEffect(() => {
        if (!isNew && data?.contact) {
            const c = data.contact;
            setForm({
                name: c.fullName ?? "",
                email: c.email ?? "",
                phone: c.phone ?? "",
                version: c.version ?? null,
            });
        }
    }, [isNew, data]);

    const [createContact, { loading: creating }] = useContactCreateMutation({
        onCompleted: () => nav("/contacts"),
    });
    const [updateContact, { loading: updating }] = useContactUpdateMutation({
        onCompleted: () => nav("/contacts"),
    });
// optional: unify Apollo/GraphQL error messages
    const extractErrorMessage = (err: unknown): string => {
        if (err && typeof err === "object" && "graphQLErrors" in (err as any)) {
            const apolloErr = err as { graphQLErrors?: Array<{ message: string }> };
            if (apolloErr.graphQLErrors && apolloErr.graphQLErrors.length > 0) {
                return apolloErr.graphQLErrors.map(e => e.message).join(" | ");
            }
        }
        return err instanceof Error ? err.message : "Unexpected error";
    }

    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isSaving) return;

        setIsSaving(true);
        setSaveError(null);

        // basic client-side validation without throwing
        if (!form.name.trim()) {
            setSaveError("Name is required.");
            setIsSaving(false);
            return;
        }

        if (isNew) {
            const res = await createContact({
                variables: {
                    input: {
                        fullName: form.name,
                        email: form.email,
                        phone: form.phone || null,
                    },
                },
            }).catch((err) => {
                const msg = extractErrorMessage(err);
                console.error("[createContact]", err);
                setSaveError(msg);
                return null;
            });

            if (!res?.data?.createContact) {
                // mutation failed or returned no payload; error already set
                setIsSaving(false);
                return;
            }

            setIsSaving(false);
            nav("/contacts");
            return;
        }

        // edit path: version must be present
        if (form.version == null) {
            setSaveError("Record version is missing. Reload the record and try again.");
            setIsSaving(false);
            return;
        }

        const res = await updateContact({
            variables: {
                id: id as string,
                input: {
                    fullName: form.name,
                    email: form.email,
                    phone: form.phone || null,
                    version: form.version,
                },
            },
        }).catch((err) => {
            const msg = extractErrorMessage(err);
            console.error("[updateContact]", err);
            setSaveError(msg);
            return null;
        });

        if (!res?.data?.updateContact) {
            setIsSaving(false);
            return;
        }

        setIsSaving(false);
        nav("/contacts");
    };

    return (
        <div className="container-fluid py-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <button className="btn btn-link" onClick={() => nav("/contacts")}>&larr; Back</button>
                <h5 className="mb-0">{isNew ? "Create Contact" : "Edit Contact"}</h5>
                <div />
            </div>

            <form className="row g-3" onSubmit={submit}>
                <div className="col-md-6">
                    <label className="form-label">Name</label>
                    <input
                        className="form-control"
                        value={form.name}
                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                        required
                    />
                </div>
                <div className="col-md-3">
                    <label className="form-label">Email</label>
                    <input
                        className="form-control"
                        type="email"
                        value={form.email}
                        onChange={(e) =>
                            setForm((f) =>
                                ({ ...f, email: e.target.value }))}
                    />
                </div>
                <div className="col-md-3">
                    <label className="form-label">Phone</label>
                    <input
                        className="form-control"
                        value={form.phone}
                        onChange={(e) =>
                            setForm((f) =>
                                ({ ...f, phone: e.target.value }))}
                    />
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
