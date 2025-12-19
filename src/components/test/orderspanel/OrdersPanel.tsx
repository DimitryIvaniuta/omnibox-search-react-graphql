import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Order, OrderStatus} from "@/components/test/orderspanel/Order";
import {useAsync} from "@/components/test/orderspanel/useAsync";
import OrdersApi from "@/components/test/orderspanel/OrdersApi";

export interface ApiError {
    message: string;
    status?: OrderStatus;
}


type OrdersPanelProps = {
    apiBaseUrl: string;
    mode: "table" | "list";
}

const OrderPanel = ({apiBaseUrl, mode}: OrdersPanelProps) => {
    const api = useMemo(() => new OrdersApi(apiBaseUrl), [apiBaseUrl]);
    const {loading, data: orders, error, reload} = useAsync<Order[]>(
        () => api.list(),
        [api]
    );

    const onChangeStatus = useCallback(
        async (orderId: number, status: OrderStatus) => {
            await api.updateStatus(orderId, status);
            reload();
        },
        [api, reload]
    );

    if (loading) {
        return <div>Loading orders...</div>
    }
    if (error) {
        return <div style={{color: 'crimson'}}>Error: {error.message}</div>;
    }
    if (!orders || orders.length === 0) {
        return <div style={{color: 'red'}}>No orders found.</div>;
    }
    if (mode === 'table') {
        return (
            <div style={{maxWidth: 720}}>
                <h3>Orders</h3>
                <table
                    width="100%"
                    cellPadding={8}
                    style={{borderCollapse: 'collapse'}}
                >
                    <thead>
                        <tr>
                            <th align="left">#</th>
                            <th align="left">Customer</th>
                            <th align="left">Total</th>
                            <th align="left">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        orders.map((order)=> {
                            return (
                                <tr key={order.id} style={{borderTop: '1px solid #ddd'}}>
                                    <td>{order.id}</td>
                                    <td>{order.customerName}</td>
                                    <td align="right">
                                        {(order.totalClients / 100).toFixed(2)}
                                    </td>
                                    <td>
                                        <select
                                            value={order.status}
                                            onChange={(e)=>
                                                onChangeStatus(order.id, e.target.value as OrderStatus)}
                                        >
                                            {
                                                Object.values(OrderStatus).map(
                                                    (status)=> {
                                                        return (
                                                            <option value={status} key={status}>
                                                                {status}
                                                            </option>
                                                        );
                                                    }
                                                )
                                            }
                                        </select>
                                    </td>
                                </tr>
                            );
                        })
                    }
                    </tbody>
                </table>
            </div>
        );

    } else {
        return (
            <section aria-label="Orders panel" style={{maxWidth: 900}}>
                <header style={{display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '12px'}}>
                    <h3 style={{margin: 0}}>Orders</h3>
                    <button onClick={() => reload()}>Reload</button>
                </header>
                <ul style={{listStyle: 'none', padding: 0, margin: '12px 0', display: 'grid', gap: '12px'}}>
                    {orders.map(
                        (order) => (
                            <li
                                key={order.id}
                                style={{
                                    border: '1px solid #e5e5e5',
                                    borderRadius: 10,
                                    padding: 12,
                                    display: 'grid',
                                    gap: 10,
                                }}
                            >
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    gap: 12,
                                    flexWrap: 'wrap',
                                }}>
                                    <div>
                                        <div style={{fontWeight: 700}}>#{order.id}</div>
                                        <div>{order.customerName}</div>
                                    </div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 10,
                                        }}
                                    >
                                        <div aria-label="Order total" style={{fontWeight: 600}}>
                                            {(order.totalClients / 100).toFixed(2)}
                                        </div>
                                        <label style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 8,
                                        }}>
                                            <span style={{fontSize: 600}}>Status</span>
                                            <select
                                                value={order.status}
                                                onChange={(e) =>
                                                    onChangeStatus(order.id, e.target.value as OrderStatus)}
                                                aria-label={`Change status for order ${order.id}`}
                                            >
                                                {
                                                    Object.values(OrderStatus).map((status) => {
                                                        return (
                                                            <option key={status} value={status}>
                                                                {status}
                                                            </option>
                                                        );
                                                    })
                                                }
                                            </select>
                                        </label>
                                    </div>
                                </div>
                                <dl
                                    style={{
                                        margin: 0,
                                        display: 'grid',
                                        gridTemplateColumns: "max-content 1fr",
                                        columnGap: 12,
                                        rowGap: 6,
                                    }}
                                >
                                    <dt style={{color: '#555'}}>Created</dt>
                                    <dd style={{margin: 0}}>{new Date(order.createdAt).toLocaleString()}</dd>

                                    <dt style={{color: '#555'}}>Status</dt>
                                    <dd style={{color: '#555'}}>{order.status}</dd>
                                </dl>
                            </li>
                        )
                    )}
                </ul>
            </section>
        );
    }
};


