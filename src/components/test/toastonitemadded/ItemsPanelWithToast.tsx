import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useDidUpdateCustom from "@/components/test/toastonitemadded/useDidUpdateCustom";

type Item = {
    id: number;
    title: string;
}
const ItemsPanelWithToast = () => {
    const [items, setItems] = useState<Item[]>(
        () => [
            {id: 1, title: 'Item 1'},
            {id: 2, title: 'Item 2'},
        ]
    );

    // "What changed" signal (so we don't rely on comparing arrays)
    const [lastAddedId, setLastAddedId] = useState<number | null>(null);
    // Simple numeric ID generator
    const nextIdRef = useRef(3);

    // Toast state + timer (cleared on unmount)
    const [toast, setToast] = useState<string | null>(null);
    const toastTimerRef = useRef<number | null>(null);

    const showToast = useCallback((msg:string)=>{
        setToast(msg);
        if(toastTimerRef.current != null) {
            window.clearTimeout(toastTimerRef.current);
        }
        toastTimerRef.current = window.setTimeout(()=>setToast(msg), 1500);
    }, []);

    useEffect(() => {
        return () => {
            if(toastTimerRef.current != null) {
                window.clearTimeout(toastTimerRef.current);
            }
        }
    }, []);
    const addItem = useCallback(()=>{
        const id = nextIdRef.current;
        setItems((prev) => [...prev, {id, title: `Item #${id}`}] as Item[])
        setLastAddedId(id);
    }, []);
    useDidUpdateCustom(()=>{
        if(lastAddedId != null){
            showToast(`Added Item #${lastAddedId}`);
        }
    }, [lastAddedId, showToast]);
    const ui = useMemo(
        () =>(
            <div style={{maxWidth:520}}>
                <h3 style={{margin: "0 0 12px"}}>Items</h3>
                <ul style={{margin:0, paddingLeft:18}}>
                    {
                        items.map((item)=>(
                            <li key={item.id} >
                                <strong>#{item.id}</strong> - {item.title}
                            </li>
                        ))
                    }
                </ul>
                <button style={{marginTop: 12}} type="button" onClick={() => addItem()}>+Add Item</button>
                {/* Pop-up hint (toast) */}
                {toast && (
                    <div
                        role="status"
                        aria-live={"polite"}
                        style={{
                            position: "fixed",
                            right: "16px",
                            bottom: "10px",
                            padding: "10px 12px",
                            border: "1px solid #e5e5e5",
                            borderRadius: 10,
                            background: "white",
                            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                            maxWidth: 320,
                        }}
                    >{toast}</div>

                )

                }
            </div>
        ),
        [items, toast, addItem]
    );
    return ui;
}