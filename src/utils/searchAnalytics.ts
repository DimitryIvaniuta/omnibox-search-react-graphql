// src/utils/searchAnalytics.ts
/**
 * Thin client for the Node BFF analytics endpoints.
 * - Keeps fetch logic in one place => easy to mock in tests.
 */
export type EntityKind =
    | "contact"
    | "listing"
    | "transaction"
    | "product"
    | "mailing"
    | "referral";

export interface SearchPickEventInput {
    kind: EntityKind;
    entityId: string;
    label?: string;
}

/**
 * Base URL is configurable so we can point dev/stage/prod
 * to different BFF instances.
 */
const ANALYTICS_BASE_URL =
    import.meta.env.VITE_ANALYTICS_URL ?? "http://localhost:4000/api/analytics";

/**
 * Fire-and-forget log.
 * - We *intentionally* ignore the response body.
 * - If logging fails, we don't want to break the user flow.
 */
export async function logSearchPick(
    event: SearchPickEventInput,
    signal?: AbortSignal,
): Promise<void> {
    try {
        await fetch(`${ANALYTICS_BASE_URL}/search`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ...event,
                pickedAt: new Date().toISOString(),
            }),
            signal,
        });
    } catch (error) {
        // In real app, send to Sentry or console.debug
        console.debug("Failed to log search pick", error);
    }
}

/**
 * Response shape from GET /search/top.
 */
export interface SearchAnalyticsSummary {
    top: Array<{ label: string; count: number }>;
    byKind: Array<{ kind: EntityKind; count: number }>;
}

export async function fetchSearchAnalyticsSummary(
    signal?: AbortSignal,
): Promise<SearchAnalyticsSummary> {
    const res = await fetch(`${ANALYTICS_BASE_URL}/search/top?limit=20`, { signal });
    if (!res.ok) {
        throw new Error(`Failed to fetch analytics: ${res.status}`);
    }
    return res.json();
}
