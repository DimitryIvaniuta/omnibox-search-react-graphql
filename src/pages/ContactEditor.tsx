import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    useContactByIdQuery,
    useContactCreateMutation,
    useContactUpdateMutation,
} from "@/generated/write-oltp/graphql";
import {useActionNotify} from "@/components/ActionsNotification";
// import { useActionNotify } from "@/components/ActionNotifications";

/**
 * Full-screen Contact editor:
 * - Create when :id === "new", else edit existing.
 * - Uses optimistic locking (version) for updates (required by your schema).
 * - On success: show a global toast + navigate back to list with highlightId.
 *
 * NOTE: If your schema uses "fullName" instead of "name", switch fields and variables accordingly (see comments).
 */

type FormState = {
    name: string;
    email: string;
    phone: string;
    version: number | null;   // required on update; null on create
};

export default function ContactEditor() {
    const nav = useNavigate();
    const { id } = useParams();
    const isNew = !id || id === "new";

    // Load record for edit
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

    // Load server values into the form (edit path)
    useEffect(() => {
        if (!isNew && data?.contact) {
            const c = data.contact;
            setForm({
                // change c.name → c.fullName if your schema uses that
                name: c.fullName ?? "",
                email: c.email ?? "",
                phone: c.phone ?? "",
                // version must be present for update
                version: c.version ?? null,
            });
        }
    }, [isNew, data]);

    const [createContact] = useContactCreateMutation();
    const [updateContact] = useContactUpdateMutation();
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const notify = useActionNotify();

/*    const extractErrorMessage = (err: unknown): string => {
        if (err && typeof err === "object" && "graphQLErrors" in (err as any)) {
            const apolloErr = err as { graphQLErrors?: Array<{ message: string }> };
            if (apolloErr.graphQLErrors && apolloErr.graphQLErrors.length > 0) {
                return apolloErr.graphQLErrors.map(e => e.message).join(" | ");
            }
        }
        return err instanceof Error ? err.message : "Unexpected error";
    }*/

    // Submit handler: no throw; catch & display errors; await promises (no ignored promises)
    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isSaving) return;

        setIsSaving(true);
        setSaveError(null);

        // Basic validation
        if (!form.name.trim()) {
            setSaveError("Name is required.");
            setIsSaving(false);
            return;
        }

        if (isNew) {
            // CREATE
            const res = await createContact({
                variables: {
                    input: {
                        fullName: form.name,
                        email: form.email,
                        phone: form.phone || null,
                    },
                },
            }).catch((err) => {
                const msg = err instanceof Error ? err.message : "Failed to create contact";
                setSaveError(msg);
                return null;
            });

            setIsSaving(false);

            const createdId = res?.data?.createContact?.id;
            if (createdId) {
                notify.success("Contact updated successfully");
                nav("/contacts", { state: { highlightId: createdId } });
            }
            return;
        }

        // UPDATE
        if (form.version == null) {
            setSaveError("Record version is missing. Reload and try again.");
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
            const msg = err instanceof Error ? err.message : "Failed to update contact";
            setSaveError(msg);
            return null;
        });

        setIsSaving(false);
        const updatedId = res?.data?.updateContact?.id ?? (id as string);
        notify.success("Contact updated successfully");
        nav("/contacts", { state: { highlightId: updatedId } });
    };

    return (
        <div className="container-fluid py-3">
            {/* Header bar with back button */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <button className="btn btn-link" onClick={() => nav("/contacts")}>
                    &larr; Back
                </button>
                <h5 className="mb-0">{isNew ? "Create Contact" : "Edit Contact"}</h5>
                <div />
            </div>

            <form className="row g-3" onSubmit={submit}>
                <div className="col-md-6">
                    <label className="form-label">Name</label>
                    <input
                        className="form-control"
                        value={form.name}
                        onChange={(e) => setForm(
                            (f) => ({ ...f, name: e.target.value })
                        )}
                        required
                    />
                </div>
                <div className="col-md-3">
                    <label className="form-label">Email</label>
                    <input
                        className="form-control"
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm(
                            (f) => ({ ...f, email: e.target.value })
                        )}
                    />
                </div>
                <div className="col-md-3">
                    <label className="form-label">Phone</label>
                    <input
                        className="form-control"
                        value={form.phone}
                        onChange={(e) => setForm((f) => (
                            { ...f, phone: e.target.value }
                        ))}
                    />
                </div>

                {/* Optional: show version in edit mode */}
                {!isNew && (
                    <div className="col-md-2">
                        <label className="form-label">Version</label>
                        <input className="form-control" value={form.version ?? ""} readOnly />
                    </div>
                )}

                {saveError && <div className="col-12 text-danger small">{saveError}</div>}

                <div className="col-12">
                    <button className="btn btn-primary" type="submit" disabled={isSaving}>
                        {isSaving ? "Saving…" : "Save"}
                    </button>
                </div>
            </form>
        </div>
    );
}
