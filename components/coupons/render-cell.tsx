"use client";

import React from "react";
import { Button } from "@nextui-org/react";
import { ICoupon } from "@/helpers/types";

import { deleteCoupon, setCouponActive } from "@/actions/coupon.action";
import { toast } from "sonner";
import { EditIcon } from "../icons/table/edit-icon";
import { DeleteIcon } from "../icons/table/delete-icon";

interface RenderCellProps {
  coupon: ICoupon;
  columnKey: string | number;
  onEdit: (coupon: ICoupon) => void;
}

export const RenderCell = ({ coupon, columnKey, onEdit }: any) => {
  const cellValue = coupon[columnKey as keyof ICoupon];

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      const result = await deleteCoupon(coupon.id);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Coupon deleted successfully");
        window.location.reload();
      }
    }
  };

  const handleToggleActive = async () => {
    const result = await setCouponActive(coupon.id, !coupon.isActive);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(
        `Coupon ${!coupon.isActive ? "activated" : "deactivated"} successfully`
      );
      window.location.reload();
    }
  };

  switch (columnKey) {
    case "code":
      return (
        <div className="flex flex-col">
          <p className="text-bold text-small font-mono">{cellValue}</p>
        </div>
      );
    case "discount":
      return (
        <div className="flex flex-col">
          <p className="text-bold text-small">
            {coupon.discountType === "percentage"
              ? `${cellValue}%`
              : `$${cellValue}`}
          </p>
        </div>
      );
    case "discountType":
      return (
        <div className="flex flex-col">
          <p className="text-bold text-small capitalize">
            {cellValue === "percentage" ? "Percentage" : "Fixed Amount"}
          </p>
        </div>
      );
    case "isActive":
      return (
        <div className="flex flex-col w-20 items-center justify-center">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer ${coupon.isActive
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
              }`}
            onClick={handleToggleActive}
          >
            {coupon.isActive ? "Active" : "Inactive"}
          </span>
        </div>
      );
    case "usedCount":
      return (
        <div className="flex flex-col">
          <p className="text-bold text-small">{cellValue}</p>
          {coupon.maxUse && (
            <p className="text-tiny text-default-400">
              / {coupon.maxUse} max
            </p>
          )}
        </div>
      );
    case "usage":
      return (
        <div className="flex flex-col">
          <p className="text-bold text-small">
            {coupon.usedCount} {coupon.maxUse ? `/${coupon.maxUse}` : ""}
          </p>
          {coupon.maxUse && (
            <p className="text-tiny text-default-400">
              {Math.round((coupon.usedCount / coupon.maxUse) * 100)}% used
            </p>
          )}
        </div>
      );
    case "validity":
      const now = new Date();
      const validFrom = coupon.validFrom ? new Date(coupon.validFrom) : null;
      const validTo = coupon.validTo ? new Date(coupon.validTo) : null;

      let status = "Active";
      let statusColor = "text-green-600";

      if (validFrom && now < validFrom) {
        status = "Not Started";
        statusColor = "text-gray-500";
      } else if (validTo && now > validTo) {
        status = "Expired";
        statusColor = "text-red-600";
      }

      return (
        <div className="flex flex-col">
          {validFrom && (
            <p className="text-tiny text-default-400">
              From: {new Date(validFrom).toLocaleDateString()}
            </p>
          )}
          {validTo ? (
            <p className={`text-bold text-small ${statusColor}`}>
              To: {new Date(validTo).toLocaleDateString()}
            </p>
          ) : (
            <p className="text-bold text-small text-gray-500">No expiry</p>
          )}
          <p className={`text-tiny ${statusColor} font-medium`}>{status}</p>
        </div>
      );
    case "validTo":
      return (
        <div className="flex flex-col">
          <p className="text-bold text-small">
            {cellValue
              ? new Date(cellValue as string).toLocaleDateString()
              : "No expiry"}
          </p>
        </div>
      );
    case "actions":
      return (
        <div className="relative flex items-center gap-2">
          <Button
            size="sm"
            variant="light"
            onPress={() => onEdit(coupon)}
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
          <Button
            size="sm"
            variant="light"
            color="danger"
            onPress={handleDelete}
            className="text-red-600 hover:text-red-800"
            startContent={
              <DeleteIcon 
                fill="currentColor" 
                size={16} 
                width={16} 
                height={16}
                className="w-4 h-4"
              />
            }
          >
            Delete
          </Button>
        </div>
      );
    default:
      return cellValue;
  }
};
