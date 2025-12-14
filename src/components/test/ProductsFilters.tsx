import * as React from "react";
import { useSearchParams } from "react-router-dom";

const ProductsFilters = () => {
    const [sp, setSp] = useSearchParams();

    const q = sp.get("q") ?? "";
    const sort = sp.get("sort") ?? "relevance";
    const inStock = sp.get("inStock") === "1";

    function update(key: string, value: string | null) {
        setSp(prev => {
            const next = new URLSearchParams(prev);
            if (value === null || value === "") next.delete(key);
            else next.set(key, value);
            return next;
        });
    }

    return (
        <div style={{ display: "grid", gap: 8, maxWidth: 420 }}>
            <input
                placeholder="Search…"
                value={q}
                onChange={(e) => update("q", e.target.value)}
            />

            <select value={sort} onChange={(e) => update("sort", e.target.value)}>
                <option value="relevance">Relevance</option>
                <option value="priceAsc">Price ↑</option>
                <option value="priceDesc">Price ↓</option>
                <option value="newest">Newest</option>
            </select>

            <label style={{display: "flex", gap: 8, alignItems: "center"}}>
                <input
                    type="checkbox"
                    checked={inStock}
                    onChange={(e) => update("inStock", e.target.checked ? "1" : null)}
                />
                In stock only
            </label>

            <button type="button" onClick={() => setSp(new URLSearchParams())}>
                Reset
            </button>

            {/* Debug: current KV query string */}
            <small>Query: ?{sp.toString()}</small>
        </div>
    );
}

export default ProductsFilters;