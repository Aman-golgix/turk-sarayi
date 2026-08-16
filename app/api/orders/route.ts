import { NextRequest, NextResponse } from "next/server";
import {
  createOrder,
  getOrders,
  getLastOrderId,
  clearLastOrderId,
  updateOrderStatus,
} from "@/lib/order-store";
import { OrderSubmission } from "@/lib/types";

export async function GET(request: NextRequest) {
  const since = request.nextUrl.searchParams.get("since");
  const status = request.nextUrl.searchParams.get("status");

  let orders = getOrders();

  if (status === "active") {
    orders = orders.filter(
      (o) => o.status === "pending" || o.status === "preparing"
    );
  }

  const lastId = getLastOrderId();
  const hasNew = since ? orders.some((o) => o.id !== since && o.status === "pending") : false;

  return NextResponse.json({ orders, lastOrderId: lastId, hasNew });
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as OrderSubmission;

    if (!body.tableNumber || !body.customerName || !body.phone) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!body.items || body.items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 }
      );
    }

    const order = createOrder(body);
    return NextResponse.json({ order }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, status } = await request.json();
    const order = updateOrderStatus(id, status);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json({ order });
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE() {
  clearLastOrderId();
  return NextResponse.json({ ok: true });
}
