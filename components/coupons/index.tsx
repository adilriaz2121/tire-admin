"use client";

import React, { useState } from "react";
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
} from "@nextui-org/react";
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
    <div className="flex flex-col gap-6">
      <div className="flex justify-between gap-4 items-center">
        <div className="flex-1 max-w-md">
          <SearchInput
            name="Coupons"
            callback={(value) =>
              updateSearchParams({ query: value, page: "1" })
            }
          />
        </div>
        <button
          onClick={handleAdd}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FF3E55] to-[#DB6E00] text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Coupon
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <Table aria-label="Coupons table" removeWrapper>
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                hideHeader={column.uid === "actions"}
                align={column.uid === "actions" ? "center" : "start"}
                className="bg-gray-50 text-gray-700 font-semibold"
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            items={data}
            emptyContent={
              <div className="flex flex-col items-center justify-center py-12">
                <svg
                  className="w-12 h-12 text-gray-400 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
                <p className="text-gray-500 text-lg font-medium">
                  No coupons found
                </p>
                <p className="text-gray-400 text-sm">
                  Get started by creating your first coupon
                </p>
              </div>
            }
          >
            {(item) => (
              <TableRow
                key={item.id}
                className="hover:bg-gray-50 transition-colors"
              >
                {(columnKey) => (
                  <TableCell className="py-4">
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
      </div>

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {(meta.page - 1) * meta.limit + 1} to{" "}
            {Math.min(meta.page * meta.limit, meta.total)} of {meta.total}{" "}
            coupons
          </div>
          <div className="flex items-center gap-4">
            <Select
              size="sm"
              className="w-32"
              variant="bordered"
              selectedKeys={[meta.limit.toString()]}
              onChange={(e) =>
                updateSearchParams({ limit: e.target.value, page: "1" })
              }
            >
              <SelectItem key="10" value="10">
                10 per page
              </SelectItem>
              <SelectItem key="20" value="20">
                20 per page
              </SelectItem>
              <SelectItem key="50" value="50">
                50 per page
              </SelectItem>
            </Select>
            <Pagination
              total={meta.totalPages}
              page={meta.page}
              onChange={(page) => updateSearchParams({ page: page.toString() })}
              showControls
              showShadow
              color="primary"
            />
          </div>
        </div>
      )}

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
