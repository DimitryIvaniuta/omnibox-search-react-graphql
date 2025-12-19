import React, {useCallback, useEffect, useRef, useState} from "react";
import useDidUpdateToastList from "@/components/test/toastonitemadded/itemspanel/useDidUpdateToastList";

const ItemsPanel = () => {
    const {items, addItem, toast} = useDidUpdateToastList();
    return (
        <section style={{maxWidth: 520}}>
            <h3 style={{margin: "0 0 12px"}}>Items</h3>

            <ul style={{margin: 0, paddingLeft: 18}}>
                {items.map((it) => (
                    <li key={it.id}>
                        <strong>#{it.id}</strong> — {it.title}
                    </li>
                ))}
            </ul>

            <button type="button" onClick={addItem} style={{marginTop: 12}}>
                + Add item
            </button>

            {toast && (
                <div
                    role="status"
                    aria-live="polite"
                    style={{
                        position: "fixed",
                        right: 16,
                        bottom: 16,
                        padding: "10px 12px",
                        border: "1px solid #e5e5e5",
                        borderRadius: 10,
                        background: "white",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                    }}
                >
                    {toast}
                </div>
            )}
        </section>
    );
}
export default ItemsPanel;