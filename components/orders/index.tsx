"use client";

import React, { useState, useCallback, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Select,
  SelectItem,
  Button,
  Input,
} from "@nextui-org/react";
import { Order, getAllOrders } from "@/actions/order.action";
import { RenderCell } from "./render-cell";
import { OrderModal } from "./order-modal";
import SearchInput from "../search-input";
import useUpdateSearchParams from "@/components/hooks/useTableSearchParams";

interface OrdersProps {
  initialData?: Order[];
  initialMeta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const OrdersPage: React.FC<OrdersProps> = ({
  initialData = [],
  initialMeta,
}) => {
  const [orders, setOrders] = useState<Order[]>(initialData);
  const [meta, setMeta] = useState(
    initialMeta || { page: 1, limit: 10, total: 0, totalPages: 1 }
  );
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { searchParams, updateSearchParams } = useUpdateSearchParams();

  const columns = [
    { name: "ORDER ID", uid: "id" },
    { name: "CUSTOMER", uid: "name" },
    { name: "EMAIL", uid: "email" },
    { name: "AMOUNT", uid: "totalAmount" },
    { name: "STATUS", uid: "status" },
    { name: "DATE", uid: "createdAt" },
    { name: "ACTIONS", uid: "actions" },
  ];

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: parseInt(searchParams.get("page") || "1"),
        limit: parseInt(searchParams.get("limit") || "10"),
        search: searchParams.get("search") || undefined,
        status: searchParams.get("status") || undefined,
        dateFrom: searchParams.get("dateFrom") || undefined,
        dateTo: searchParams.get("dateTo") || undefined,
        minAmount: searchParams.get("minAmount")
          ? parseFloat(searchParams.get("minAmount")!)
          : undefined,
        maxAmount: searchParams.get("maxAmount")
          ? parseFloat(searchParams.get("maxAmount")!)
          : undefined,
      };

      const response = await getAllOrders(params);

      if (response.success && response.data) {
        setOrders(response.data.orders);
        setMeta({
          page: response.data.pagination.page,
          limit: response.data.pagination.limit,
          total: response.data.pagination.total,
          totalPages: response.data.pagination.totalPages,
        });
      } else {
        console.error("Invalid response format:", response);
        setOrders([]);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleView = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handlePageChange = (page: number) => {
    updateSearchParams("page", page.toString());
  };

  const handleLimitChange = (limit: string) => {
    updateSearchParams("limit", limit);
    updateSearchParams("page", "1");
  };

  const handleSearch = (search: string) => {
    updateSearchParams("search", search);
    updateSearchParams("page", "1");
  };

  const handleStatusFilter = (status: string) => {
    updateSearchParams("status", status);
    updateSearchParams("page", "1");
  };

  const handleAmountFilter = (type: "min" | "max", value: string) => {
    updateSearchParams(type === "min" ? "minAmount" : "maxAmount", value);
    updateSearchParams("page", "1");
  };

  const statusCounts = {
    total: meta.total,
    pending: orders.filter((order) => order.status === "pending").length,
    shipped: orders.filter((order) => order.status === "shipped").length,
    delivered: orders.filter((order) => order.status === "delivered").length,
    cancelled: orders.filter((order) => order.status === "cancelled").length,
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Filters */}
      <div className="flex flex-col gap-4">
        {/* Search and Status Filter */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <SearchInput name="orders" callback={handleSearch} />
          <Select
            placeholder="Filter by status"
            className="w-full"
            selectedKeys={
              searchParams.get("status") ? [searchParams.get("status")!] : []
            }
            onSelectionChange={(keys) => {
              const status = Array.from(keys)[0] as string;
              handleStatusFilter(status || "");
            }}
          >
            <SelectItem key="" value="">
              All Status
            </SelectItem>
            <SelectItem key="pending" value="pending">
              Pending
            </SelectItem>
            <SelectItem key="shipped" value="shipped">
              Shipped
            </SelectItem>
            <SelectItem key="delivered" value="delivered">
              Delivered
            </SelectItem>
            <SelectItem key="cancelled" value="cancelled">
              Cancelled
            </SelectItem>
          </Select>
        </div>

        {/* Amount filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input
            type="number"
            placeholder="Min Amount"
            className="w-full"
            value={searchParams.get("minAmount") || ""}
            onChange={(e) => handleAmountFilter("min", e.target.value)}
          />
          <Input
            type="number"
            placeholder="Max Amount"
            className="w-full"
            value={searchParams.get("maxAmount") || ""}
            onChange={(e) => handleAmountFilter("max", e.target.value)}
          />
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-blue-50 p-3 rounded-lg text-center">
          <p className="text-2xl font-bold text-blue-600">
            {statusCounts.total}
          </p>
          <p className="text-sm text-blue-600">Total Orders</p>
        </div>
        <div className="bg-yellow-50 p-3 rounded-lg text-center">
          <p className="text-2xl font-bold text-yellow-600">
            {statusCounts.pending}
          </p>
          <p className="text-sm text-yellow-600">Pending</p>
        </div>
        <div className="bg-orange-50 p-3 rounded-lg text-center">
          <p className="text-2xl font-bold text-orange-600">
            {statusCounts.shipped}
          </p>
          <p className="text-sm text-orange-600">Shipped</p>
        </div>
        <div className="bg-green-50 p-3 rounded-lg text-center">
          <p className="text-2xl font-bold text-green-600">
            {statusCounts.delivered}
          </p>
          <p className="text-sm text-green-600">Delivered</p>
        </div>
        <div className="bg-red-50 p-3 rounded-lg text-center">
          <p className="text-2xl font-bold text-red-600">
            {statusCounts.cancelled}
          </p>
          <p className="text-sm text-red-600">Cancelled</p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-default-400 text-small">
          Total {meta.total} orders
        </span>
        <div className="flex items-center gap-2">
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
          </label>
          <Select
            className="w-20"
            size="sm"
            selectedKeys={[searchParams.get("limit") || "10"]}
            onSelectionChange={(keys) => {
              const limit = Array.from(keys)[0] as string;
              handleLimitChange(limit);
            }}
          >
            <SelectItem key="10" value="10">
              10
            </SelectItem>
            <SelectItem key="25" value="25">
              25
            </SelectItem>
            <SelectItem key="50" value="50">
              50
            </SelectItem>
          </Select>
        </div>
      </div>

      <Table aria-label="Orders table">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={orders}
          isLoading={loading}
          emptyContent="No orders found"
        >
          {(order) => (
            <TableRow key={order.id}>
              {(columnKey) => (
                <TableCell>
                  <RenderCell
                    order={order}
                    columnKey={columnKey as string}
                    onView={handleView}
                    onRefresh={fetchOrders}
                  />
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="py-2 px-2 flex justify-between items-center">
        <Pagination
          showControls
          classNames={{
            cursor: "bg-foreground text-background",
          }}
          color="default"
          isDisabled={loading}
          page={meta.page}
          total={meta.totalPages}
          variant="light"
          onChange={handlePageChange}
        />
        <div className="flex w-[30%] justify-end gap-2">
          <Button
            isDisabled={loading}
            size="sm"
            variant="flat"
            onPress={fetchOrders}
          >
            Refresh
          </Button>
        </div>
      </div>

      {selectedOrder && (
        <OrderModal
          order={selectedOrder}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedOrder(null);
          }}
          onRefresh={fetchOrders}
        />
      )}
    </div>
  );
};

export default OrdersPage;
