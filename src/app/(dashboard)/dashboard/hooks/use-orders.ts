"use client";

import { useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Order } from "@/lib/orders-file";
import { fetchOrders } from "../core/_requests";

export function useOrdersQuery() {
  return useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: fetchOrders,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}

function normalize(s: any) {
  return String(s ?? "")
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
    .toLowerCase()
    .trim();
}

export function useFilteredOrders(orders: Order[] | undefined, query: string) {
  return useMemo(() => {
    if (!orders) return [];
    const nq = normalize(query);
    if (!nq) return orders;

    return orders.filter((o) => {
      const haystack = normalize(
        [
          o.id,
          o.type,
          o.customer,
          o.grams,
          o.pricePerGram,
          o.total,
          o.status,
          o.ref,
          o.date,
        ].join(" ")
      );
      return haystack.includes(nq);
    });
  }, [orders, query]);
}
