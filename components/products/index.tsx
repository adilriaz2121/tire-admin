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
import { IProduct, IMeta } from "@/helpers/types";
import { RenderCell } from "./render-cell";
import { ProductModal } from "./product-modal";
import SearchInput from "../search-input";
import useUpdateSearchParams from "@/components/hooks/useTableSearchParams";

interface ProductsProps {
  data: IProduct[];
  meta: IMeta;
}

export const Products: React.FC<ProductsProps> = ({ data, meta }) => {
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { searchParams, updateSearchParams } = useUpdateSearchParams();

  const columns = [
    { name: "MAKE", uid: "make" },
    { name: "MODEL", uid: "model" },
    { name: "YEAR", uid: "year" },
    { name: "SIZE", uid: "size" },
    { name: "PRICE", uid: "price" },
    { name: "QUANTITY", uid: "quantity" },
    { name: "STATUS", uid: "isActive" },
    { name: "ACTIONS", uid: "actions" },
  ];

  const handleEdit = (product: IProduct) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <SearchInput
          name="Products"
          callback={(value) => updateSearchParams({ query: value, page: "1" })}
        />

        <button
          onClick={handleAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
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
          Add Product
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <Table aria-label="Products table" removeWrapper>
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
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
                <p className="text-gray-500 text-lg font-medium">
                  No products found
                </p>
                <p className="text-gray-400 text-sm">
                  Get started by adding your first product
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
                      product={item}
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
            products
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
        <ProductModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};
