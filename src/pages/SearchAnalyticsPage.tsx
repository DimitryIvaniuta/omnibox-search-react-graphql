// src/pages/SearchAnalyticsPage.tsx
import { useEffect, useState } from "react";
import {
    fetchSearchAnalyticsSummary,
    type SearchAnalyticsSummary,
} from "@/utils/searchAnalytics";

/**
 * Simple admin/ops page to visualise omnibox usage.
 * Interview talking points:
 *  - Clean separation: data-fetching inside useEffect + AbortController
 *  - Distinct loading / error / empty states
 */
export default function SearchAnalyticsPage() {
    const [data, setData] = useState<SearchAnalyticsSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();

        (async () => {
            try {
                setLoading(true);
                setError(null);
                const summary = await fetchSearchAnalyticsSummary(controller.signal);
                setData(summary);
            } catch (err) {
                // Ignore aborts – they are expected during navigation.
                if (err instanceof DOMException && err.name === "AbortError") {
                    return;
                }
                setError(
                    err instanceof Error ? err.message : "Unknown error while loading analytics",
                );
            } finally {
                setLoading(false);
            }
        })();

        // Cleanup: cancel fetch when component unmounts / route changes.
        return () => controller.abort();
    }, []);

    return (
        <div className="container-fluid">
            <h1 className="h4 mb-4">Search analytics</h1>

            {loading && <p>Loading analytics…</p>}
            {error && (
                <div className="alert alert-danger" role="alert">
                    Failed to load analytics: {error}
                </div>
            )}

            {!loading && !error && data && (
                <div className="row g-4">
                    <section className="col-md-6">
                        <h2 className="h5 mb-3">Top picks</h2>
                        {data.top.length === 0 ? (
                            <p className="text-muted">No data yet. Try using the omnibox.</p>
                        ) : (
                            <table className="table table-sm align-middle">
                                <thead>
                                <tr>
                                    <th style={{ width: "70%" }}>Label</th>
                                    <th className="text-end">Count</th>
                                </tr>
                                </thead>
                                <tbody>
                                {data.top.map((row) => (
                                    <tr key={row.label}>
                                        <td>{row.label}</td>
                                        <td className="text-end">{row.count}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        )}
                    </section>

                    <section className="col-md-6">
                        <h2 className="h5 mb-3">By entity type</h2>
                        {data.byKind.length === 0 ? (
                            <p className="text-muted">No data yet.</p>
                        ) : (
                            <table className="table table-sm align-middle">
                                <thead>
                                <tr>
                                    <th>Kind</th>
                                    <th className="text-end">Total picks</th>
                                </tr>
                                </thead>
                                <tbody>
                                {data.byKind.map((row) => (
                                    <tr key={row.kind}>
                                        <td>{row.kind}</td>
                                        <td className="text-end">{row.count}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        )}
                    </section>
                </div>
            )}
        </div>
    );
}
