import React, {DependencyList, EffectCallback, useCallback, useEffect, useMemo, useRef, useState} from "react";

/**
 * Runs the effect ONLY on updates (not on initial mount).
 * Uses a ref because ref changes don't cause re-renders. :contentReference[oaicite:1]{index=1}
 */
const useDidUpdateCustom = (
    effect: EffectCallback,
    deps: DependencyList,
) => {
    const didMountRef = useRef<boolean>(false);
    const effectRef = useRef(effect);

    // keep the latest effect without re-triggering the main effect
    useEffect(() => {
        effectRef.current = effect;
    }, [effectRef]);

    useEffect(() => {
        if (!didMountRef.current) {
            didMountRef.current = true;
            return;
        }
        return effectRef.current();
    }, deps);

};