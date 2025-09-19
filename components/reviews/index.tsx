"use client";

import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { Chip } from "@nextui-org/react";
import { EyeIcon, EditIcon, DeleteIcon } from "@nextui-org/shared-icons";
import useUpdateSearchParams from "@/components/hooks/useTableSearchParams";
import { deleteReview } from "@/actions/review.action";
import { toast } from "sonner";
import { ReviewModal } from "./review-modal";
import { ViewReviewModal } from "./view-review-modal";
import { RenderCell } from "./render-cell";

interface Review {
  id: string;
  name: string;
  country: string;
  review: string;
  rating: number;
  createdAt: string;
  productsId?: string;
}

interface ReviewsProps {
  data: Review[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const columns = [
  { name: "ID", uid: "id" },
  { name: "NAME", uid: "name" },
  { name: "COUNTRY", uid: "country" },
  { name: "RATING", uid: "rating" },
  { name: "REVIEW", uid: "review" },
  { name: "DATE", uid: "createdAt" },
  { name: "ACTIONS", uid: "actions" },
];

export function Reviews({ data, meta }: ReviewsProps) {
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [modalMode, setModalMode] = useState<"view" | "edit" | null>(null);

  const { updateSearchParams } = useUpdateSearchParams();

  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  const {
    isOpen: isViewOpen,
    onOpen: onViewOpen,
    onClose: onViewClose,
  } = useDisclosure();

  const handleView = (review: Review) => {
    setSelectedReview(review);
    setModalMode("view");
    onViewOpen();
  };

  const handleEdit = (review: Review) => {
    setSelectedReview(review);
    setModalMode("edit");
    onEditOpen();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      const result = await deleteReview(id);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Review deleted successfully");
        window.location.reload();
      }
    }
  };

  const renderCell = (review: Review, columnKey: React.Key) => (
    <RenderCell
      review={review}
      columnKey={columnKey}
      onView={handleView}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Filters */}
      <div className="flex gap-4 items-end">
        <Input
          placeholder="Search reviews..."
          className="max-w-xs"
          onChange={(e) =>
            updateSearchParams({ query: e.target.value, page: "1" })
          }
        />
        <Select
          placeholder="Filter by rating"
          className="max-w-xs"
          onChange={(e) =>
            updateSearchParams({
              rating: e.target.value || undefined,
              page: "1",
            })
          }
        >
          <SelectItem key="" value="">
            All Ratings
          </SelectItem>
          <SelectItem key="5" value="5">
            5 Stars
          </SelectItem>
          <SelectItem key="4" value="4">
            4 Stars
          </SelectItem>
          <SelectItem key="3" value="3">
            3 Stars
          </SelectItem>
          <SelectItem key="2" value="2">
            2 Stars
          </SelectItem>
          <SelectItem key="1" value="1">
            1 Star
          </SelectItem>
        </Select>
      </div>

      {/* Table */}
      <Table aria-label="Reviews table">
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
        <TableBody items={data} emptyContent="No reviews found.">
          {(review) => (
            <TableRow key={review.id}>
              {(columnKey) => (
                <TableCell>{renderCell(review, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">
          Showing {(meta.page - 1) * meta.limit + 1} to{" "}
          {Math.min(meta.page * meta.limit, meta.total)} of {meta.total} reviews
        </p>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="bordered"
            onPress={() =>
              updateSearchParams({ page: (meta.page - 1).toString() })
            }
            isDisabled={meta.page <= 1}
          >
            Previous
          </Button>
          <span className="flex items-center px-3">
            Page {meta.page} of {meta.totalPages}
          </span>
          <Button
            size="sm"
            variant="bordered"
            onPress={() =>
              updateSearchParams({ page: (meta.page + 1).toString() })
            }
            isDisabled={meta.page >= meta.totalPages}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Modals */}
      <ViewReviewModal
        isOpen={isViewOpen}
        onClose={onViewClose}
        review={selectedReview}
      />

      <ReviewModal
        isOpen={isEditOpen}
        onClose={onEditClose}
        review={selectedReview}
        mode="edit"
        onSuccess={() => {
          onEditClose();
          window.location.reload();
        }}
      />
    </div>
  );
}
