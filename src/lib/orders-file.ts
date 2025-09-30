import { promises as fs } from "fs";
import path from "path";

export type Order = {
  id: number;
  type: "buy" | "sell";
  customer: string;
  grams: number;
  pricePerGram: number;
  total: number;
  status: "pending" | "completed" | "canceled";
  ref: string;
  date: string; // ISO
};

const ORDERS_PATH = path.join(process.cwd(), "data", "orders.json");

export async function readOrders(): Promise<Order[]> {
  try {
    const raw = await fs.readFile(ORDERS_PATH, "utf8");
    return JSON.parse(raw || "[]");
  } catch (e: any) {
    if (e.code === "ENOENT") {
      await fs.mkdir(path.dirname(ORDERS_PATH), { recursive: true });
      await fs.writeFile(ORDERS_PATH, "[]", "utf8");
      return [];
    }
    throw e;
  }
}

export async function writeOrders(orders: Order[]) {
  await fs.writeFile(ORDERS_PATH, JSON.stringify(orders, null, 2), "utf8");
}
