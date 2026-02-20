"use client";

import React from "react";
import { Chip, Button } from "@nextui-org/react";
import { Order } from "@/actions/order.action";
import { EyeIcon } from "../icons/table/eye-icon";
import { EditIcon } from "../icons/table/edit-icon";

interface RenderCellProps {
  order: Order;
  columnKey: string;
  onView: (order: Order) => void;
  onEdit: (order: Order) => void;
  onRefresh: () => void;
}

export const RenderCell: React.FC<RenderCellProps> = ({
  order,
  columnKey,
  onView,
  onEdit,
  onRefresh,
}) => {

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
          <p className="text-bold text-small capitalize">{order.userName || order.name}</p>
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
            ${order.totalAmount?.toFixed(2) || order.total?.toFixed(2) || "0.00"}
          </p>
          {order.discount && order.discount > 0 && (
            <p className="text-bold text-tiny text-red-600">
              -${order.discount.toFixed(2)} discount
            </p>
          )}
          {order.couponCode && (
            <p className="text-bold text-tiny text-orange-600 font-mono">
              {order.couponCode}
            </p>
          )}
        </div>
      );

    case "status":
      const statusColorMap: Record<
        string,
        "success" | "warning" | "primary" | "danger"
      > = {
        delivered: "success",
        shipped: "primary",
        confirmed: "warning",
        cancelled: "danger",
      };

      return (
        <Chip
          className="capitalize"
          color={statusColorMap[order.status]}
          size="sm"
          variant="flat"
        >
          {order.status}
        </Chip>
      );

    case "trackingNumber":
      return order.trackingNumber ? (
        <p className="text-bold text-small font-mono">
          {order.trackingNumber}
        </p>
      ) : (
        <span className="text-default-400">-</span>
      );

    case "createdAt":
      if (!order.createdAt) return <span className="text-default-400">N/A</span>;
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
          <Button
            size="sm"
            variant="light"
            onPress={() => onView(order)}
            className="text-blue-600 hover:text-blue-800"
            startContent={
              <EyeIcon 
                fill="currentColor" 
                size={16} 
                width={16} 
                height={16}
                className="w-4 h-4"
              />
            }
          >
            View
          </Button>
          <Button
            size="sm"
            variant="light"
            onPress={() => onEdit(order)}
            className="text-[#05CB14] hover:text-[#E55A00]"
            startContent={
              <EditIcon 
                fill="currentColor" 
                size={16} 
                width={16} 
                height={16}
                className="w-4 h-4"
              />
            }
          >
            Edit
          </Button>
        </div>
      );

    default:
      return <span>{cellValue?.toString()}</span>;
  }
};
