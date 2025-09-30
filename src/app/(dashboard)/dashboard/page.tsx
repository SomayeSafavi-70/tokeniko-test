"use client";

import OrdersTable from "./components/orders-table";

export default function Dashboard() {
  return (
    <>
      <div className="row w-100 p-4">
        <OrdersTable />
      </div>
    </>
  );
}
