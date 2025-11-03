import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    ContactsDocument,
    useContactByIdQuery,
    useContactCreateMutation,
    useContactUpdateMutation,
} from "@/generated/write-oltp/graphql";
import { useActionNotify } from "@/components/ActionsNotification";

/**
 * Full-screen Contact Editor, with:
 * - Own top bar (Back, Title, Save)
 * - Clean card layout, avatar initials, compact form
 * - Keyboard shortcuts: ESC (back), Ctrl/Cmd+S (save)
 * - Awaited mutations (no floating promises)
 * - No throws; error surfaced in UI
 *
 * NOTE: If your schema uses `fullName` instead of `name`,
 *   - change form.name → form.fullName and update GraphQL input accordingly.
 */

type FormState = {
    name: string;           // switch to "fullName" if that’s your schema
    email: string;
    phone: string;
    version: number | null; // required on update
};

export default function ContactEditor() {
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
        version: null,
    });

    useEffect(() => {
        if (!isNew && data?.contact) {
            const c = data.contact;
            setForm({
                name: c.fullName ?? "",          // change to c.fullName if needed
                email: c.email ?? "",
                phone: c.phone ?? "",
                version: (c as any).version ?? null,
            });
        }
    }, [isNew, data]);

    const [createContact] = useContactCreateMutation();
    const [updateContact] = useContactUpdateMutation();
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const notify = useActionNotify();
    const formRef = useRef<HTMLFormElement>(null);

    // Avatar initials (nice touch)
    const initials = useMemo(() => {
        const trimmed = form.name.trim();
        if (!trimmed) return "👤";
        const parts = trimmed.split(/\s+/);
        const a = parts[0]?.[0] ?? "";
        const b = parts[1]?.[0] ?? "";
        return (a + b).toUpperCase();
    }, [form.name]);

    // Keyboard shortcuts: ESC = back, Ctrl/Cmd+S = save
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                e.preventDefault();
                nav("/contacts");
            }
            const isSave = (e.ctrlKey || e.metaKey) && (e.key === "s" || e.key === "S");
            if (isSave) {
                e.preventDefault();
                formRef.current?.requestSubmit();
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [nav]);

    // Submit with safe guards and awaited mutations
    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isSaving) return;

        setIsSaving(true);
        setSaveError(null);

        if (!form.name.trim()) {
            setSaveError("Name is required.");
            setIsSaving(false);
            return;
        }

        if (isNew) {
            const res = await createContact({
                variables: {
                    input: {
                        fullName: form.name,                 // change to fullName if needed
                        email: form.email,
                        phone: form.phone || null,
                    },
                },
                refetchQueries: [{ query: ContactsDocument, variables: { offset: 0, limit: 50 } }],
                awaitRefetchQueries: true, // ensure list is fresh before we go back
            }).catch((err) => {
                setSaveError(err instanceof Error ? err.message : "Failed to create contact");
                return null;
            });

            setIsSaving(false);
            const createdId = res?.data?.createContact?.id;
            if (createdId) {
                notify.success("Contact saved");
                nav("/contacts", { state: { highlightId: createdId } });
            }
            return;
        }

        // update path
        if (form.version == null) {
            setSaveError("Record version is missing. Reload and try again.");
            setIsSaving(false);
            return;
        }

        const res = await updateContact({
            variables: {
                id: id as string,
                input: {
                    fullName: form.name,                   // change to fullName if needed
                    email: form.email,
                    phone: form.phone || null,
                    version: form.version,
                },
            },
        }).catch((err) => {
            setSaveError(err instanceof Error ? err.message : "Failed to update contact");
            return null;
        });

        setIsSaving(false);
        const updatedId = res?.data?.updateContact?.id ?? (id as string);
        notify.success("Contact updated");
        nav("/contacts", { state: { highlightId: updatedId } });
    };

    return (
        <div className="d-flex flex-column min-vh-100">
            {/* Editor Top Bar (sticky) */}
            <div className="position-sticky top-0 border-bottom bg-white" style={{ zIndex: 1020 }}>
                <div className="container-fluid py-2">
                    <div className="d-flex align-items-center gap-2">
                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => nav("/contacts")}
                            aria-label="Back to list"
                            title="Back (Esc)"
                        >
                            ← Back
                        </button>
                        <div className="d-flex align-items-center gap-3">
                            <i className="bi bi-person-lines-fill fs-3 text-primary-emphasis"></i>
                            <div className="d-flex align-items-baseline gap-2">
                                <h1
                                    className="h4 mb-0 fw-bold"
                                    style={{
                                        background: "linear-gradient(135deg,#0d6efd,#20c997)",
                                        WebkitBackgroundClip: "text",
                                        WebkitTextFillColor: "transparent",
                                    }}
                                    aria-live="polite"
                                >
                                    {isNew ? "Create Contact" : "Edit Contact"}
                                </h1>
                                <span className={`badge ${isNew ? "text-bg-success" : "text-bg-secondary"}`}>
                                    {isNew ? "New" : "Editing"}
                                </span>
                            </div>
                            <small className="text-muted ms-2">
                                {isNew ? "Fill the details and save" : "Update details and save"}
                            </small>
                        </div>


                        <div className="ms-auto d-flex gap-2">
                            <button
                                type="button"
                                className="btn btn-outline-primary"
                                onClick={() => formRef.current?.requestSubmit()}
                                disabled={isSaving}
                                title="Save (Ctrl/Cmd + S)"
                            >
                                {isSaving ? "Saving…" : "Save"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container-xl my-4">
                <div className="row justify-content-center">
                    <div className="col-12 col-lg-10 col-xxl-8">
                        <div className="card shadow-sm border-0">
                            {/* Hero header with avatar */}
                            <div
                                className="card-header border-0 text-white"
                                style={{
                                    background:
                                        "linear-gradient(135deg, rgba(33,150,243,1) 0%, rgba(76,175,80,1) 100%)",
                                }}
                            >
                                <div className="d-flex align-items-center gap-3">
                                    <div
                                        className="rounded-circle d-flex align-items-center justify-content-center"
                                        style={{
                                            width: 56,
                                            height: 56,
                                            background: "rgba(255,255,255,0.2)",
                                            fontWeight: 600,
                                            fontSize: 20,
                                        }}
                                        aria-hidden
                                    >
                                        {initials}
                                    </div>
                                    <div className="flex-grow-1">
                                        <div className="fw-semibold">{form.name || "Untitled contact"}</div>
                                        <small className="opacity-75">
                                            {isNew ? "New contact" : "Editing existing contact"}
                                        </small>
                                    </div>
                                </div>
                            </div>

                            <div className="card-body">
                                <form ref={formRef} className="row g-4" onSubmit={submit}>
                                    {/* Left column */}
                                    <div className="col-12 col-lg-7">
                                        <div className="mb-3">
                                            <label className="form-label">Name</label>
                                            {/* change label to "Full name" if using fullName */}
                                            <input
                                                className="form-control form-control-lg"
                                                value={form.name}
                                                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                                                placeholder="Enter full name"
                                                required
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">Email</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                value={form.email}
                                                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                                                placeholder="name@example.com"
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">Phone</label>
                                            <input
                                                className="form-control"
                                                value={form.phone}
                                                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                                                placeholder="+48 123 456 789"
                                            />
                                        </div>
                                    </div>

                                    {/* Right column (meta / actions) */}
                                    <div className="col-12 col-lg-5">
                                        <div className="border rounded-3 p-3 bg-light">
                                            <div className="d-flex align-items-center justify-content-between">
                                                <div className="small text-muted">Status</div>
                                                <span className="badge text-bg-secondary">Active</span>
                                            </div>
                                            <hr />
                                            <div className="small text-muted">Tips</div>
                                            <ul className="small mb-0">
                                                <li>Press <kbd>Esc</kbd> to go back</li>
                                                <li>Press <kbd>Ctrl</kbd>/<kbd>⌘</kbd> + <kbd>S</kbd> to save</li>
                                            </ul>
                                        </div>

                                        {!isNew && (
                                            <div className="mt-3">
                                                <label className="form-label">Version</label>
                                                <input className="form-control" value={form.version ?? ""} readOnly />
                                            </div>
                                        )}
                                    </div>

                                    {/* Error and sticky action row */}
                                    {saveError && (
                                        <div className="col-12">
                                            <div className="alert alert-danger mb-0">{saveError}</div>
                                        </div>
                                    )}

{/*                                    <div className="col-12">
                                        <div className="d-flex gap-2 justify-content-end">
                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary"
                                                onClick={() => nav("/contacts")}
                                            >
                                                Cancel
                                            </button>
                                            <button className="btn btn-primary" type="submit" disabled={isSaving}>
                                                {isSaving ? "Saving…" : "Save"}
                                            </button>
                                        </div>
                                    </div>*/}
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Optional sticky bottom bar for actions (kept minimal / commented) */}
            {
                <div className="position-sticky bottom-0 bg-white border-top py-2">
                    <div className="container-xl d-flex justify-content-end gap-2">
                        <button className="btn btn-outline-secondary" onClick={() => nav("/contacts")}>Cancel</button>
                        <button className="btn btn-primary" onClick={() => formRef.current?.requestSubmit()}
                                disabled={isSaving}>
                            {isSaving ? "Saving…" : "Save"}
                        </button>
                    </div>
                </div>
      }
        </div>
    );
}
