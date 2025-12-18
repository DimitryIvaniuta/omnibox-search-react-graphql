import React, {useCallback, useEffect, useMemo, useState} from 'react';

export enum OrderStatus {
    New = "NEW",
    Complete = "COMPLETE",
    Paid = "PAID",
    Shipped = "SHIPPED",
    Cancelled = "CANCELLED",
}

export interface Order {
    id: number;
    customerName: string;
    totalClients: number;
    status: OrderStatus;
    createdAt: string;
}

export interface ApiError {
    message: string;
    status?: OrderStatus;
}

type AsyncState<T> =
    | { loading: true; data: null; error: null; }
    | { loading: false; data: T; error: null; }
    | { loading: false; data: null; error: ApiError; };

const useAsync = <T, >(
    fn: () => Promise<T>,
    deps: React.DependencyList
): AsyncState<T> & { reload: () => void } => {
    const [tick, setTick] = useState(0);
    const reload = useCallback(() => setTick((x) => x + 1), [])

    const [state, setState] = useState<AsyncState<T>>({
        loading: true,
        data: null,
        error: null,
    });

    useEffect(() => {
        let alive = true;

        setState({loading: true, data: null, error: null});

        fn()
            .then((data) => alive && setState({loading: false, data, error: null}))
            .catch((e: unknown) => {
                const err =
                    e instanceof Error ? {message: e.message} : {message: "Unknown error"};
                alive && setState({loading: false, data: null, error: err});
            });

        return () => {
            alive = false;
        };
    }, [...deps, tick]);

    return {...state, reload}
}

/** Decorators (no libs) - requires tsconfig: "experimentalDecorators": true */
function log() {
    return function <This, Args extends any[], R>(
        original: (this: This, ...args: Args) => Promise<R>,
        _context: ClassMethodDecoratorContext<
            This,
            (this: This, ...args: Args) => Promise<R>
        >
    ) {
        return async function (this: This, ...args: Args): Promise<R> {
            const t0 = performance.now();
            try {
                return await original.apply(this, args);
            } finally {
                const ms = Math.round(performance.now() - t0);
                console.debug(`[log] ${ms}ms`, {args});
            }
        };
    };
}

/** Real-world: small API service used by the component */
class OrdersApi {
    constructor(private readonly baseUrl: string) {
    }

    @log()
    async list(): Promise<Order[]> {
        const r = await fetch(`${this.baseUrl}/api/orders`);
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return (await r.json()) as Order[];
    }

    @log()
    async updateStatus(orderId: number, status: OrderStatus): Promise<void> {
        const r = await fetch(`${this.baseUrl}/api/orders/${orderId}/status`, {
            method: "PATCH",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({status}),
        });
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
    }
}

type OrdersPanelProps = {
    apiBaseUrl: string;
}

const OrderPanel = ({apiBaseUrl}: OrdersPanelProps) => {
    const api = useMemo(() => new OrdersApi(apiBaseUrl), [apiBaseUrl]);
    const {loading, data: orders, error, reload} = useAsync<Order[]>(
        () => api.list(),
        [api]
    );

    const onChangeStatus = useCallback(() => {
        async (orderId: number, status: OrderStatus) => {
            await api.updateStatus(orderId, status);
            reload();
        }
    }, [api, reload]);

    if (loading) {
        return <div>Loading orders...</div>
    }
    if (error) {
        return <div style={{color: 'crimson'}}>Error: {error.message}</div>;
    }
    if (!orders || orders.length === 0) {
        return <div style={{color: 'red'}}>No orders found.</div>;
    }
    return (
        <div style={{maxWidth: 720}}></div>
    );
};


