import React, {useMemo, useState} from 'react';

type Product = {
    id: number;
    title: string;
    price: number;
}

type QtyById = {
    [productId: number]: number;
}

type Products = {
    products: Product[];
}

const Cart = ({products}: Products) => {

    const [qtyById, setQtyById] = useState<QtyById>({});

    const setQty = (id: number, qty: number) => {
        setQtyById(
            (prev) => {
                const next = {...prev};
                if (qty <= 0) {
                    delete next[id];
                } else {
                    next[id] = qty;
                }
                return next;
            }
        );
    };

    const inc = (id: number) => {
        setQty(id, (qtyById[id] ?? 0) + 1);
    };

    const dec = (id: number) => {
        setQty(id, (qtyById[id] ?? 0) + 1);
    };

    const totalItems = useMemo(
        () => Object.values(qtyById).reduce((acc, q) => acc + q, 0),
        [qtyById]
    );

    const totalPrice = useMemo(
        () => {
            const priceById = new Map(
                products.map(
                    (p) => {
                        return [p.id, p.price] as const;
                    }
                )
            );
            return Object.entries(qtyById).reduce(
                (sum, [id, q]) => {
                    return sum + (priceById.get(Number(id)) ?? 0) * q;
                }, 0);
        },
        [qtyById, products]
    );

    return (
        <div style={{maxWidth: 520}}>
            <h3>Cart</h3>
            <ul style={{paddingLeft: 16}}>
                {
                    products.map((p: Product) => {
                            const qty = qtyById[p.id] ?? 0;
                            return (
                                <li key={p.id} style={{paddingBottom: 8}}>
                                    <strong>{p.title}</strong> - {p.price.toFixed(2)}
                                    <div style={{
                                        display: 'flex', justifyContent: 'space-between',
                                        alignItems: 'center', gap: '10px'
                                    }}>
                                        <button onClick={() => dec(p.id)}
                                                disabled={qty === 0}>-
                                        </button>
                                        <span>Qty: {qty}</span>
                                        <button onClick={() => inc(p.id)}>+</button>
                                        {qty > 0 && (
                                            <button onClick={() => setQty(p.id, 0)}>Remove</button>
                                        )}
                                    </div>
                                </li>
                            );
                        }
                    )
                }
            </ul>
            <hr/>
            <div>Items: {totalItems}</div>
            <div>Total: {totalPrice.toFixed(2)}</div>
            <pre style={{marginTop: 12}}>{JSON.stringify(qtyById, null, 2)}</pre>
        </div>
    );
}

export default Cart;