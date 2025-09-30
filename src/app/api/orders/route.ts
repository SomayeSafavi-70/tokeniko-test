import { NextResponse } from "next/server";
import { readOrders, writeOrders, type Order } from "@/lib/orders-file";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const orders = await readOrders();
  return NextResponse.json(orders);
}

export async function POST(req: Request) {
  const body = (await req.json()) as Partial<Order>;
  const required = ["type", "customer", "grams", "pricePerGram"];
  for (const k of required) {
    // @ts-ignore
    if (!body[k])
      return NextResponse.json({ error: `${k} required` }, { status: 400 });
  }

  const orders = await readOrders();
  const newOrder: Order = {
    id: orders.length ? Math.max(...orders.map((o) => o.id)) + 1 : 1,
    type: body.type as "buy" | "sell",
    customer: body.customer!,
    grams: Number(body.grams),
    pricePerGram: Number(body.pricePerGram),
    total: Number(body.total ?? Number(body.grams) * Number(body.pricePerGram)),
    status: (body.status as Order["status"]) ?? "pending",
    ref:
      body.ref ??
      `ORD-${new Date().getFullYear()}-${String(
        Math.floor(Math.random() * 1e6)
      ).padStart(6, "0")}`,
    date: body.date ?? new Date().toISOString(),
  };

  orders.push(newOrder);
  await writeOrders(orders);
  return NextResponse.json(newOrder, { status: 201 });
}
