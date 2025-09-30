import axios from "axios";
import type { Order } from "@/lib/orders-file";

export async function fetchOrders(): Promise<Order[]> {
  const { data } = await axios.get("/api/orders");
  return data;
}
