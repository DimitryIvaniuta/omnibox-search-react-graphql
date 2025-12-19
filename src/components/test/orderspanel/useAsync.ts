import {useCallback, useEffect, useState} from "react";

export interface ApiError {
    message: string;
    status?: number;
}

type AsyncState<T> =
    | { loading: true; data: null; error: null }
    | { loading: false; data: T; error: null }
    | { loading: false; data: null; error: ApiError };

export const useAsync = <T,>(fn: () => Promise<T>,
                                deps: React.DependencyList
                             ): AsyncState<T> & {reload:()=>void} => {
    const [tick, setTick] = useState(0);
    const reload = useCallback(()=> setTick((x)=> x+1), []);
    const [state, setState] = useState<AsyncState<T>>({ loading: true, data: null, error: null });

    useEffect(() => {
        let alive= true;
        setState({ loading: true, data: null, error: null });
        fn()
            .then((data) => alive && setState({ loading: false, data, error: null }))
            .catch((e: unknown)=> {
                const err = e instanceof Error ? { message: e.message } : { message: "Unknown error" };
                alive && setState({ loading: false, data: null, error: err });
            });
        return () => {
            alive = false;
        }
    }, [...deps, tick])
    return {...state, reload};
}