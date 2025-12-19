import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";


const useDidUpdateCustom2 = (effect: React.EffectCallback, deps: React.DependencyList) => {
    const didMountRef = useRef(false);

    useEffect(() => {
        if (!didMountRef.current) {
            didMountRef.current = true;
            return;
        }
        return effect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
};