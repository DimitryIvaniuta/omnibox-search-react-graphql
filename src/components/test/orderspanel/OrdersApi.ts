import { log } from "@/components/test/orderspanel/logDecorator";
import { Order, OrderStatus } from "@/components/test/orderspanel/Order";

/** API service used by the component */
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

export default OrdersApi;