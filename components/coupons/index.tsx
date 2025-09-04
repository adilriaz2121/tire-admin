"use client";

import React, { useState } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import { ICoupon, IMeta } from "@/helpers/types";
import { RenderCell } from "./render-cell";
import { CouponModal } from "./coupon-modal";
import SearchInput from "../search-input";
import useUpdateSearchParams from "@/components/hooks/useTableSearchParams";

interface CouponsProps {
  data: ICoupon[];
  meta: IMeta;
}

export const Coupons: React.FC<CouponsProps> = ({ data, meta }) => {
  const [selectedCoupon, setSelectedCoupon] = useState<ICoupon | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { searchParams, updateSearchParams } = useUpdateSearchParams();

  const columns = [
    { name: "CODE", uid: "code" },
    { name: "DISCOUNT", uid: "discount" },
    { name: "TYPE", uid: "discountType" },
    { name: "STATUS", uid: "isActive" },
    { name: "USED", uid: "usedCount" },
    { name: "VALID TO", uid: "validTo" },
    { name: "ACTIONS", uid: "actions" },
  ];

  const handleEdit = (coupon: ICoupon) => {
    setSelectedCoupon(coupon);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedCoupon(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCoupon(null);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between gap-3 items-end">
        <SearchInput
          name="Coupons"
          callback={(value) => updateSearchParams({ query: value, page: "1" })}
        />
        <div className="flex gap-3">
          <button
            onClick={handleAdd}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FF3E55] to-[#DB6E00] text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Coupon
          </button>
        </div>
      </div>
      
      <Table aria-label="Coupons table">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              hideHeader={column.uid === "actions"}
              align={column.uid === "actions" ? "center" : "start"}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={data} emptyContent="No coupons found">
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>
                  <RenderCell
                    coupon={item}
                    columnKey={columnKey}
                    onEdit={handleEdit}
                  />
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {isModalOpen && (
        <CouponModal
          coupon={selectedCoupon}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};
