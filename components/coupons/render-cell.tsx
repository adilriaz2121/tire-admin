"use client";

import React from "react";
import { ICoupon } from "@/helpers/types";

import { deleteCoupon, setCouponActive } from "@/actions/coupon.action";
import { toast } from "sonner";

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
            {cellValue
              ? new Date(cellValue as string).toLocaleDateString()
              : "No expiry"}
          </p>
        </div>
      );
    case "actions":
      return (
        <div className="relative flex items-center gap-2">
          <button
            className="p-2 text-[#FF7101] hover:bg-orange-50 rounded-lg transition-colors"
            onClick={() => onEdit(coupon)}
            title="Edit Coupon"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            onClick={handleDelete}
            title="Delete Coupon"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      );
    default:
      return cellValue;
  }
};
