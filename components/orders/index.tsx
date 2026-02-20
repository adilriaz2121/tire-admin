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
} from "@nextui-org/react";
import { Order, getAllOrders } from "@/actions/order.action";
import { RenderCell } from "./render-cell";
import { OrderModal } from "./order-modal";
import { ShipOrderModal } from "./ship-order-modal";
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

const statusTabs = [
  { key: "", label: "All Orders", icon: "📦" },
  { key: "confirmed", label: "Confirmed", icon: "✅" },
  { key: "shipped", label: "Shipped", icon: "🚚" },
  { key: "delivered", label: "Delivered", icon: "📬" },
  { key: "cancelled", label: "Cancelled", icon: "❌" },
];

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
  const [isShipModalOpen, setIsShipModalOpen] = useState(false);
  const [orderToShip, setOrderToShip] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const { searchParams, updateSearchParams } = useUpdateSearchParams();

  const activeStatus = searchParams.get("status") || "";

  const columns = [
    { name: "CUSTOMER", uid: "name" },
    { name: "EMAIL", uid: "email" },
    { name: "AMOUNT", uid: "totalAmount" },
    { name: "STATUS", uid: "status" },
    { name: "SHIPPING", uid: "shippingLocation" },
    { name: "TRACKING ID", uid: "trackingNumber" },
    { name: "DATE", uid: "createdAt" },
    { name: "ACTIONS", uid: "actions" },
  ];

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const statusParam = searchParams.get("status");
      const validStatuses: Array<'confirmed' | 'shipped' | 'delivered' | 'cancelled'> = ['confirmed', 'shipped', 'delivered', 'cancelled'];
      const status = statusParam && validStatuses.includes(statusParam as any)
        ? (statusParam as 'confirmed' | 'shipped' | 'delivered' | 'cancelled')
        : undefined;

      const params = {
        page: parseInt(searchParams.get("page") || "1"),
        limit: parseInt(searchParams.get("limit") || "10"),
        search: searchParams.get("search") || undefined,
        status,
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

  const [isEditMode, setIsEditMode] = useState(false);

  const handleView = (order: Order) => {
    setSelectedOrder(order);
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const handleEdit = (order: Order) => {
    setSelectedOrder(order);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleShipOrder = (order: Order) => {
    setIsModalOpen(false);
    setSelectedOrder(null);
    setIsEditMode(false);
    setOrderToShip(order);
    setIsShipModalOpen(true);
  };

  const handlePageChange = (page: number) => {
    updateSearchParams({ page: page.toString() });
  };

  const handleLimitChange = (limit: string) => {
    updateSearchParams({ limit, page: "1" });
  };

  const handleSearch = (search: string) => {
    updateSearchParams({ search: search || undefined, page: "1" });
  };

  const handleStatusTab = (status: string) => {
    updateSearchParams({ status: status || undefined, page: "1" });
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Status Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {statusTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleStatusTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              activeStatus === tab.key
                ? "bg-black text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <span>{tab.label}</span>
            {tab.key === "" && (
              <span className={`ml-1 text-xs px-1.5 py-0.5 rounded-full ${
                activeStatus === tab.key ? "bg-white/20" : "bg-gray-200"
              }`}>
                {meta.total}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Search */}
      <SearchInput name="orders" callback={handleSearch} />

      {/* Table controls */}
      <div className="flex justify-between items-center">
        <span className="text-default-400 text-small">
          {meta.total} orders {activeStatus ? `(${activeStatus})` : ""}
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
                    onEdit={handleEdit}
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
          isEditMode={isEditMode}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedOrder(null);
            setIsEditMode(false);
          }}
          onShipOrder={handleShipOrder}
          onRefresh={fetchOrders}
        />
      )}

      {orderToShip && (
        <ShipOrderModal
          order={orderToShip}
          isOpen={isShipModalOpen}
          onClose={() => {
            setIsShipModalOpen(false);
            setOrderToShip(null);
          }}
          onRefresh={fetchOrders}
        />
      )}
    </div>
  );
};

export default OrdersPage;
