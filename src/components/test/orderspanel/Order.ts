
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
