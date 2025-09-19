"use client";

import React from "react";
import { Chip } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { EyeIcon, EditIcon, DeleteIcon } from "@nextui-org/shared-icons";

interface Review {
  id: string;
  name: string;
  country: string;
  review: string;
  rating: number;
  createdAt: string;
  productsId?: string;
}

interface RenderCellProps {
  review: Review;
  columnKey: React.Key;
  onView: (review: Review) => void;
  onEdit: (review: Review) => void;
  onDelete: (id: string) => void;
}

export const RenderCell = ({
  review,
  columnKey,
  onView,
  onEdit,
  onDelete,
}: RenderCellProps) => {
  const cellValue = review[columnKey as keyof Review];

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "success";
    if (rating >= 3) return "warning";
    return "danger";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const truncateText = (text: string, maxLength: number = 50) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  switch (columnKey) {
    case "id":
      return (
        <div className="text-sm text-gray-600">
          {review.id.substring(0, 8)}...
        </div>
      );

    case "name":
      return <div className="font-medium">{review.name}</div>;

    case "country":
      return <div className="text-sm">{review.country || "N/A"}</div>;

    case "rating":
      return (
        <Chip color={getRatingColor(review.rating)} variant="flat" size="sm">
          {review.rating} ⭐
        </Chip>
      );

    case "review":
      return (
        <div className="max-w-xs">
          <p className="text-sm text-gray-600">{truncateText(review.review)}</p>
        </div>
      );

    case "createdAt":
      return (
        <div className="text-sm text-gray-500">
          {formatDate(review.createdAt)}
        </div>
      );

    case "actions":
      return (
        <div className="flex items-center gap-2">
          <Button
            isIconOnly
            size="sm"
            variant="light"
            onPress={() => onView(review)}
          >
            <EyeIcon className="w-4 h-4" />
          </Button>
          <Button
            isIconOnly
            size="sm"
            variant="light"
            onPress={() => onEdit(review)}
          >
            <EditIcon className="w-4 h-4" />
          </Button>
          <Button
            isIconOnly
            size="sm"
            variant="light"
            color="danger"
            onPress={() => onDelete(review.id)}
          >
            <DeleteIcon className="w-4 h-4" />
          </Button>
        </div>
      );

    default:
      return cellValue;
  }
};
