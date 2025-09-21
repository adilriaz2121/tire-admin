"use client";

import React from "react";
import { Chip, Tooltip, Button } from "@nextui-org/react";
import { Order, updateOrderStatus } from "@/actions/order.action";
import { EyeIcon } from "../icons/table/eye-icon";

interface RenderCellProps {
  order: Order;
  columnKey: string;
  onView: (order: Order) => void;
  onRefresh: () => void;
}

export const RenderCell: React.FC<RenderCellProps> = ({
  order,
  columnKey,
  onView,
  onRefresh,
}) => {
  const handleStatusChange = async (
    newStatus: "pending" | "shipped" | "delivered" | "cancelled"
  ) => {
    if (newStatus === order.status) return;

    try {
      await updateOrderStatus(order.id, newStatus);
      onRefresh();
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  const cellValue = order[columnKey as keyof Order];

  switch (columnKey) {
    case "id":
      return (
        <div className="flex flex-col">
          <p className="text-bold text-small font-mono">
            {order.id.substring(0, 8)}...
          </p>
          {order.paymentIntentId && (
            <p className="text-tiny text-default-400 font-mono">
              {order.paymentIntentId.substring(0, 12)}...
            </p>
          )}
        </div>
      );

    case "name":
      return (
        <div className="flex flex-col">
          <p className="text-bold text-small capitalize">{order.name}</p>
          {order.phone && (
            <p className="text-bold text-tiny capitalize text-default-400">
              {order.phone}
            </p>
          )}
        </div>
      );

    case "email":
      return (
        <div className="flex flex-col">
          <p className="text-bold text-small">{order.email}</p>
          <p className="text-bold text-tiny text-default-400">
            {order.city}, {order.country}
          </p>
        </div>
      );

    case "totalAmount":
      return (
        <div className="flex flex-col">
          <p className="text-bold text-small">
            $
            {order.totalAmount?.toFixed(2) || order.total?.toFixed(2) || "0.00"}
          </p>
          <p className="text-bold text-tiny text-default-400 uppercase">
            {order.currency || "USD"}
          </p>
        </div>
      );

    case "status":
      const statusColorMap: Record<
        string,
        "success" | "warning" | "primary" | "danger"
      > = {
        delivered: "success",
        shipped: "primary",
        pending: "warning",
        cancelled: "danger",
      };

      return (
        <div className="flex flex-col gap-1">
          <Chip
            className="capitalize"
            color={statusColorMap[order.status]}
            size="sm"
            variant="flat"
          >
            {order.status}
          </Chip>
          <div className="flex gap-1">
            {order.status !== "delivered" && order.status !== "cancelled" && (
              <>
                {order.status !== "shipped" && (
                  <Button
                    size="sm"
                    color="primary"
                    variant="flat"
                    className="min-w-unit-16 h-6 text-xs"
                    onPress={() => handleStatusChange("shipped")}
                  >
                    Ship
                  </Button>
                )}
                {order.status === "shipped" && (
                  <Button
                    size="sm"
                    color="success"
                    variant="flat"
                    className="min-w-unit-16 h-6 text-xs"
                    onPress={() => handleStatusChange("delivered")}
                  >
                    Deliver
                  </Button>
                )}
                <Button
                  size="sm"
                  color="danger"
                  variant="flat"
                  className="min-w-unit-16 h-6 text-xs"
                  onPress={() => handleStatusChange("cancelled")}
                >
                  Cancel
                </Button>
              </>
            )}
          </div>
        </div>
      );

    case "createdAt":
      return (
        <div className="flex flex-col">
          <p className="text-bold text-small">
            {new Date(order.createdAt).toLocaleDateString()}
          </p>
          <p className="text-bold text-tiny capitalize text-default-400">
            {new Date(order.createdAt).toLocaleTimeString()}
          </p>
        </div>
      );

    case "actions":
      return (
        <div className="relative flex items-center gap-2">
          <Tooltip content="View details">
            <Button
              isIconOnly
              size="sm"
              variant="light"
              onPress={() => onView(order)}
            >
              <EyeIcon fill="currentColor" />
            </Button>
          </Tooltip>
        </div>
      );

    default:
      return <span>{cellValue?.toString()}</span>;
  }
};
