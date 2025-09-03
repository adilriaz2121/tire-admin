"use client";

import React from "react";
import { ICoupon } from "@/helpers/types";
import { EditIcon } from "@/components/icons/table/edit-icon";
import { DeleteIcon } from "@/components/icons/table/delete-icon";
import { deleteCoupon, setCouponActive } from "@/actions/coupon.action";
import { toast } from "sonner";

interface RenderCellProps {
  coupon: ICoupon;
  columnKey: string | number;
  onEdit: (coupon: ICoupon) => void;
}

export const RenderCell: React.FC<RenderCellProps> = ({ coupon, columnKey, onEdit }) => {
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
      toast.success(`Coupon ${!coupon.isActive ? 'activated' : 'deactivated'} successfully`);
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
        <div className="flex flex-col">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer ${
              coupon.isActive
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
        </div>
      );
    case "validTo":
      return (
        <div className="flex flex-col">
          <p className="text-bold text-small">
            {cellValue ? new Date(cellValue as string).toLocaleDateString() : "No expiry"}
          </p>
        </div>
      );
    case "actions":
      return (
        <div className="relative flex items-center gap-2">
          <span
            className="text-lg text-default-400 cursor-pointer active:opacity-50"
            onClick={() => onEdit(coupon)}
          >
            <EditIcon />
          </span>
          <span
            className="text-lg text-danger cursor-pointer active:opacity-50"
            onClick={handleDelete}
          >
            <DeleteIcon />
          </span>
        </div>
      );
    default:
      return cellValue;
  }
};
