import React, {useCallback, useEffect, useRef, useState} from "react";

type Item = { id: number; title: string };

const useDidUpdateToastList = () => {
    const [items, setItems] = useState<Item[]>(() => [
        {id: 1, title: "First item"},
        {id: 2, title: "Second item"},
    ]);
    const [toast, setToast] = useState<string | null>(null);

    const nextIdRef = useRef(3);
    const lastAddedRef = useRef<Item | null>(null);

    const didMountRef = useRef(false);
    const prevLenRef = useRef(items.length);

    const timerRef = useRef<number | null>(null);

    const showToast = useCallback((msg: string) => {
        setToast(msg);
        if (timerRef.current != null) window.clearTimeout(timerRef.current);
        timerRef.current = window.setTimeout(() => setToast(null), 1500);
    }, []);

    useEffect(() => {
        return () => {
            if (timerRef.current != null) window.clearTimeout(timerRef.current);
        };
    }, []);

    const addItem = useCallback(() => {
        const id = nextIdRef.current++;
        const item: Item = {id, title: `Item #${id}`};
        lastAddedRef.current = item;
        setItems((prev) => [...prev, item]);
    }, []);

    // “didUpdate” behavior: run only after mount; show toast only on additions
    useEffect(() => {
        if (!didMountRef.current) {
            didMountRef.current = true;
            prevLenRef.current = items.length;
            return;
        }

        const prevLen = prevLenRef.current;
        prevLenRef.current = items.length;

        if (items.length > prevLen) {
            const added = lastAddedRef.current ?? items[items.length - 1];
            if (added) showToast(`Added ${added.title}`);
        }
    }, [items.length, showToast]);

    return {items, addItem, toast};
}

export default useDidUpdateToastList;