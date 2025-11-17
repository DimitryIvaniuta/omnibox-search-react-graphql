import type { SearchPickEvent } from "./types";

/**
 * Very small, in-memory "repository" for analytics.
 *
 * Interview talking point:
 *  - This is intentionally *stateless per process* and ephemeral.
 *  - In real systems, you'd plug in Redis/Postgres but keep this API.
 */
export class SearchAnalyticsStore {
    /**
     * Map<queryLabel, count>. We aggregate by label for dashboard display.
     */
    private readonly countsByLabel = new Map<string, number>();

    /**
     * Map<kind, totalCount>. Useful for understanding which entities
     * users interact with most.
     */
    private readonly countsByKind = new Map<string, number>();

    add(event: SearchPickEvent): void {
        const labelKey = event.label ?? `${event.kind}#${event.entityId}`;

        // Aggregate per label
        const current = this.countsByLabel.get(labelKey) ?? 0;
        this.countsByLabel.set(labelKey, current + 1);

        // Aggregate per kind
        const kindCurrent = this.countsByKind.get(event.kind) ?? 0;
        this.countsByKind.set(event.kind, kindCurrent + 1);
    }

    /**
     * Returns top `limit` labels with usage counts, sorted desc.
     */
    getTopLabels(limit: number) {
        return [...this.countsByLabel.entries()]
            .sort((a, b) => b[1] - a[1])
            .slice(0, limit)
            .map(([label, count]) => ({ label, count }));
    }

    /**
     * Returns total picks per entity kind.
     */
    getCountsByKind() {
        return [...this.countsByKind.entries()].map(([kind, count]) => ({
            kind,
            count,
        }));
    }

    clear() {
        this.countsByLabel.clear();
        this.countsByKind.clear();
    }
}

/** Single instance – in-memory per Node process. */
export const searchAnalyticsStore = new SearchAnalyticsStore();
