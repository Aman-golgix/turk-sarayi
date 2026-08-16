import { Order, OrderSubmission } from "./types";
import { v4 as uuidv4 } from "uuid";

const globalForOrders = globalThis as unknown as {
  orders: Order[];
  lastOrderId: string | null;
};

if (!globalForOrders.orders) {
  globalForOrders.orders = [];
}
if (globalForOrders.lastOrderId === undefined) {
  globalForOrders.lastOrderId = null;
}

export function getOrders(): Order[] {
  return [...globalForOrders.orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getPendingOrders(): Order[] {
  return getOrders().filter((o) => o.status === "pending" || o.status === "preparing");
}

export function getOrderById(id: string): Order | undefined {
  return globalForOrders.orders.find((o) => o.id === id);
}

export function createOrder(submission: OrderSubmission): Order {
  const items = submission.items.map((item) => ({
    name: item.name,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    variant: item.variant,
    instructions: item.instructions,
    lineTotal: item.unitPrice * item.quantity,
  }));

  const total = items.reduce((sum, item) => sum + item.lineTotal, 0);

  const order: Order = {
    id: uuidv4(),
    tableNumber: submission.tableNumber,
    customerName: submission.customerName,
    phone: submission.phone,
    items,
    orderInstructions: submission.orderInstructions,
    total,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  globalForOrders.orders.unshift(order);
  globalForOrders.lastOrderId = order.id;
  return order;
}

export function updateOrderStatus(
  id: string,
  status: Order["status"]
): Order | null {
  const order = globalForOrders.orders.find((o) => o.id === id);
  if (!order) return null;
  order.status = status;
  return order;
}

export function getLastOrderId(): string | null {
  return globalForOrders.lastOrderId;
}

export function clearLastOrderId(): void {
  globalForOrders.lastOrderId = null;
}
