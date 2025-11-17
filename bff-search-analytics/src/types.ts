import type { Request } from "express";

/**
 * Supported omnibox entity kinds.
 * Keep this in sync with your React OmniboxPick union.
 */
export type EntityKind =
    | "contact"
    | "listing"
    | "transaction"
    | "product"
    | "mailing"
    | "referral";

/**
 * Shape of the "search pick" event the frontend sends us.
 * - `label` is what user actually saw in omnibox (for analytics UI).
 */
export interface SearchPickEvent {
    kind: EntityKind;
    entityId: string;
    label?: string;
    pickedAt: string; // ISO-8601 timestamp
}

/** Convenience type: Express request with already-parsed body. */
export type TypedRequest<TBody> = Request<unknown, unknown, TBody>;
