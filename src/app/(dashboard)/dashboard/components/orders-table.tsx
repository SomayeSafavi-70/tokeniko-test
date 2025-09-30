"use client";
import { useEffect, useMemo, useState } from "react";
import { Card, Table, Form, Pagination, Badge } from "react-bootstrap";
import { useFilteredOrders, useOrdersQuery } from "../hooks/use-orders";
import { ArrowUp, ArrowDown, TrendingUp, TrendingDown } from "react-feather";

type SortKey =
  | "date"
  | "type"
  | "grams"
  | "pricePerGram"
  | "total"
  | "status"
  | "customer";

type SortDir = "asc" | "desc";

const PAGE_SIZE = 10;

export default function OrdersTable() {
  const { data: orders, isLoading, isError } = useOrdersQuery();
  const [q, setQ] = useState("");
  const filtered = useFilteredOrders(orders, q);

  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [q, orders]);

  const onSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(1);
  };

  const headerIndicator = (key: SortKey) => {
    if (sortKey !== key) return null;
    return sortDir === "asc" ? (
      <ArrowUp size={14} className="ms-1" />
    ) : (
      <ArrowDown size={14} className="ms-1" />
    );
  };

  const sorted = useMemo(() => {
    const arr = [...(filtered || [])];
    const cmp = (a: any, b: any) => {
      let av: any;
      let bv: any;
      switch (sortKey) {
        case "date":
          av = Date.parse(a.date);
          bv = Date.parse(b.date);
          break;
        case "type":
        case "status":
        case "customer":
          av = a[sortKey] ?? "";
          bv = b[sortKey] ?? "";
          break;
        case "grams":
        case "pricePerGram":
        case "total":
          av = Number(a[sortKey] ?? 0);
          bv = Number(b[sortKey] ?? 0);
          break;
        default:
          av = a[sortKey];
          bv = b[sortKey];
      }
      if (typeof av === "number" && typeof bv === "number") return av - bv;
      return String(av).localeCompare(String(bv), "fa", {
        sensitivity: "base",
      });
    };
    arr.sort(cmp);
    if (sortDir === "desc") arr.reverse();
    return arr;
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil((sorted?.length || 0) / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const pageItems = sorted.slice(start, end);

  if (isLoading)
    return <div className="py-5 text-center">در حال بارگذاری…</div>;
  if (isError)
    return (
      <div className="py-5 text-center text-danger">خطا در دریافت اطلاعات</div>
    );

  return (
    <Card className="shadow-sm border-0 overflow-hidden">
      <Card.Header className="bg-white py-3">
        <div
          className="d-flex flex-column flex-md-row align-items-stretch align-items-md-center gap-3"
          dir="rtl"
        >
          <h5 className="mb-0">سفارش‌های خرید و فروش طلا</h5>
          <div className="ms-md-auto w-100 w-md-auto">
            <Form.Control
              placeholder="جستجو نام مشتری…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
        </div>
      </Card.Header>

      <div className="table-responsive orders-table-wrapper">
        <Table hover responsive className="mb-0 table-modern align-middle">
          <thead className="table-light sticky-top">
            <tr className="text-center">
              <th className="text-nowrap">#</th>

              <th
                role="button"
                onClick={() => onSort("type")}
                className="text-nowrap"
              >
                نوع {headerIndicator("type")}
              </th>

              <th
                role="button"
                onClick={() => onSort("customer")}
                className="text-nowrap"
              >
                مشتری {headerIndicator("customer")}
              </th>

              <th
                role="button"
                onClick={() => onSort("grams")}
                className="text-nowrap"
              >
                گرم {headerIndicator("grams")}
              </th>

              <th
                role="button"
                onClick={() => onSort("pricePerGram")}
                className="text-nowrap"
              >
                قیمت هر گرم {headerIndicator("pricePerGram")}
              </th>

              <th
                role="button"
                onClick={() => onSort("total")}
                className="text-nowrap"
              >
                جمع کل {headerIndicator("total")}
              </th>

              <th
                role="button"
                onClick={() => onSort("status")}
                className="text-nowrap"
              >
                وضعیت {headerIndicator("status")}
              </th>

              <th className="text-nowrap">مرجع</th>

              <th
                role="button"
                onClick={() => onSort("date")}
                className="text-nowrap"
              >
                تاریخ {headerIndicator("date")}
              </th>
            </tr>
          </thead>

          <tbody>
            {pageItems.map((o: any) => (
              <tr key={o.id} className="text-center">
                <td className="fw-semibold">{o.id}</td>

                <td>
                  {o.type === "buy" ? (
                    <Badge
                      bg="success"
                      pill
                      className="d-inline-flex align-items-center gap-1 px-3 py-2"
                    >
                      <TrendingUp size={14} /> خرید
                    </Badge>
                  ) : (
                    <Badge
                      bg="danger"
                      pill
                      className="d-inline-flex align-items-center gap-1 px-3 py-2"
                    >
                      <TrendingDown size={14} /> فروش
                    </Badge>
                  )}
                </td>

                <td className="text-start fw-medium">{o.customer}</td>

                <td>{o.grams}</td>

                <td className="text-nowrap">
                  {o.pricePerGram.toLocaleString("fa-IR")}
                </td>

                <td className="fw-bold text-nowrap">
                  {o.total.toLocaleString("fa-IR")}
                </td>

                <td>
                  {o.status === "completed" && (
                    <Badge bg="primary" pill>
                      انجام‌شده
                    </Badge>
                  )}
                  {o.status === "pending" && (
                    <Badge bg="warning" text="dark" pill>
                      در انتظار
                    </Badge>
                  )}
                  {o.status === "canceled" && (
                    <Badge bg="secondary" pill>
                      لغو شده
                    </Badge>
                  )}
                </td>

                <td className="text-monospace">{o.ref}</td>

                <td className="text-nowrap">
                  {new Date(o.date).toLocaleString("fa-IR")}
                </td>
              </tr>
            ))}

            {pageItems.length === 0 && (
              <tr>
                <td colSpan={9} className="text-center py-5 text-muted">
                  نتیجه‌ای یافت نشد.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      <Card.Footer className="bg-white d-flex justify-content-between align-items-center flex-wrap gap-2">
        <small className="text-muted">
          نمایش {start + 1} تا {Math.min(end, sorted.length)} از {sorted.length}
        </small>
        <Pagination className="mb-0">
          <Pagination.First disabled={page === 1} onClick={() => setPage(1)} />
          <Pagination.Prev
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          />

          {Array.from({ length: totalPages }).map((_, i) => {
            const n = i + 1;
            if (n === 1 || n === totalPages || Math.abs(n - page) <= 2) {
              return (
                <Pagination.Item
                  key={n}
                  active={n === page}
                  onClick={() => setPage(n)}
                >
                  {n}
                </Pagination.Item>
              );
            }
            if (Math.abs(n - page) === 3)
              return <Pagination.Ellipsis key={`e-${n}`} disabled />;
            return null;
          })}

          <Pagination.Next
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          />
          <Pagination.Last
            disabled={page === totalPages}
            onClick={() => setPage(totalPages)}
          />
        </Pagination>
      </Card.Footer>
    </Card>
  );
}
