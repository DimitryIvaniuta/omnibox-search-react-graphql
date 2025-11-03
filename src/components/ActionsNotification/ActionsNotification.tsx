import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";

/**
 * Universal, app-wide notifications (toasts) shown in the top-right corner.
 * - Place the <ActionNotificationsProvider> high in your app (App.tsx).
 * - Use the `useActionNotify()` hook anywhere to show a message.
 * - Dedupe logic prevents spam of identical messages in a short window.
 */

export type ActionNoticeType = "success" | "error" | "info" | "warning";

export type NoticeOptions = {
    /** Auto hide after ms; pass 0 to require manual close. Default: 3000 */
    autoHideMs?: number;
    /** If true, identical message+kind won't be added again within dedupeMs window. Default: true */
    dedupe?: boolean;
    /** Dedupe window in ms. Default: 1500 */
    dedupeMs?: number;
};

export type Notice = {
    id: string;
    kind: ActionNoticeType;
    message: string;
    autoHideMs: number;
    createdAt: number;
};

type Ctx = {
    show: (kind: ActionNoticeType, message: string, opts?: NoticeOptions) => string;
    success: (message: string, opts?: NoticeOptions) => string;
    error: (message: string, opts?: NoticeOptions) => string;
    info: (message: string, opts?: NoticeOptions) => string;
    warning: (message: string, opts?: NoticeOptions) => string;
    close: (id: string) => void;
};

const ActionNotificationsContext = createContext<Ctx | null>(null);

export function ActionNotificationsProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<Notice[]>([]);
    const timers = useRef<Record<string, number>>({});

    // Close & cleanup per-notice timer
    const close = useCallback((id: string) => {
        setItems((it) => it.filter((n) => n.id !== id));
        const t = timers.current[id];
        if (t) {
            window.clearTimeout(t);
            delete timers.current[id];
        }
    }, []);

    // Attach auto-hide timer when a notice is added
    const scheduleAutoHide = useCallback(
        (n: Notice) => {
            if (n.autoHideMs > 0) {
                const t = window.setTimeout(() => close(n.id), n.autoHideMs);
                timers.current[n.id] = t;
            }
        },
        [close]
    );

    // Show a new notice (with optional dedupe)
    const show = useCallback(
        (kind: ActionNoticeType, message: string, opts?: NoticeOptions) => {
            const autoHideMs = opts?.autoHideMs ?? 3000;
            const dedupe = opts?.dedupe ?? true;
            const dedupeMs = opts?.dedupeMs ?? 1500;
            const createdAt = Date.now();

            if (dedupe) {
                // Prevent flooding of the same {kind, message} within dedupe window
                let hit: Notice | undefined;
                for (let i = items.length - 1; i >= 0; i--) {
                    const n = items[i];
                    if (n.kind === kind && n.message === message) {
                        hit = n;
                        break;
                    }
                }
                if (hit && createdAt - hit.createdAt < dedupeMs) {
                    return hit.id;
                }
            }

            const id = `${createdAt}-${Math.random().toString(36).slice(2, 7)}`;
            const entry: Notice = { id, kind, message, autoHideMs, createdAt };
            setItems((it) => [...it, entry]);
            scheduleAutoHide(entry);
            return id;
        },
        [items, scheduleAutoHide]
    );

    // Clean any orphan timers (safety net)
    useEffect(() => {
        const ids = new Set(items.map((n) => n.id));
        for (const k of Object.keys(timers.current)) {
            if (!ids.has(k)) {
                window.clearTimeout(timers.current[k]);
                delete timers.current[k];
            }
        }
    }, [items]);

    const ctx = useMemo<Ctx>(
        () => ({
            show,
            success: (m, o) => show("success", m, o),
            error: (m, o) => show("error", m, o),
            info: (m, o) => show("info", m, o),
            warning: (m, o) => show("warning", m, o),
            close,
        }),
        [show, close]
    );

    return (
        <ActionNotificationsContext.Provider value={ctx}>
            {children}
            {createPortal(
                <div
                    className="position-fixed top-0 end-0 p-3"
                    style={{ zIndex: 1080, pointerEvents: "none" }}
                    aria-live="polite"
                    aria-atomic="true"
                >
                    <div className="d-flex flex-column align-items-end gap-2">
                        {items.map((n) => (
                            <ToastCard key={n.id} notice={n} onClose={() => ctx.close(n.id)} />
                        ))}
                    </div>
                </div>,
                document.body
            )}
        </ActionNotificationsContext.Provider>
    );
}

export function useActionNotify() {
    const ctx = useContext(ActionNotificationsContext);
    if (!ctx) throw new Error("useActionNotify must be used within ActionNotificationsProvider");
    return ctx;
}

// A small, Bootstrap-styled toast card
function ToastCard({ notice, onClose }: { notice: Notice; onClose: () => void }) {
    const { kind, message } = notice;
    const tone =
        kind === "success"
            ? "bg-success text-white"
            : kind === "error"
                ? "bg-danger text-white"
                : kind === "warning"
                    ? "bg-warning"
                    : "bg-info";
    const closeTone = kind === "success" || kind === "error" ? "btn-close-white" : undefined;

    return (
        <div
            className={clsx("shadow rounded-2 p-3", tone)}
            style={{ minWidth: 260, maxWidth: 480, pointerEvents: "auto" }}
            role="status"
        >
            <div className="d-flex align-items-start">
                <div className="me-3">{message}</div>
                <button type="button" className={clsx("btn-close", closeTone)} aria-label="Close" onClick={onClose} />
            </div>
        </div>
    );
}
