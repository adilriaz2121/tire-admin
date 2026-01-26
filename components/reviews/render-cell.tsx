"use client";

import React from "react";
import { Chip } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { EyeIcon, EditIcon, DeleteIcon } from "@nextui-org/shared-icons";

import { IReview } from "@/helpers/types";

type Review = IReview;

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

  const calculateAverageRating = (review: Review): number => {
    const ratings = [
      review.Dry,
      review.Wet,
      review.Winter,
      review.Comfort,
      review.Noise,
      review.Treadwear,
    ];
    const sum = ratings.reduce((a, b) => a + b, 0);
    return Math.round((sum / ratings.length) * 10) / 10;
  };

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

  switch (columnKey) {
    case "id":
      return (
        <div className="text-sm text-gray-600 font-mono">
          {review.id.substring(0, 8)}...
        </div>
      );

    case "name":
      return (
        <div className="flex flex-col">
          <div className="font-medium">{review.name}</div>
          <div className="text-xs text-gray-500">{review.email}</div>
        </div>
      );

    case "email":
      return <div className="text-sm">{review.email}</div>;

    case "brandSize":
      return (
        <div className="flex flex-col">
          <div className="font-medium text-sm">{review.brand}</div>
          <div className="text-xs text-gray-500">{review.size}</div>
        </div>
      );

    case "ratings":
      const avgRating = calculateAverageRating(review);
      return (
        <div className="flex flex-col gap-1">
          <Chip color={getRatingColor(avgRating)} variant="flat" size="sm">
            Avg: {avgRating.toFixed(1)} ⭐
          </Chip>
        
        </div>
      );

    case "vehicle":
      return (
        <div className="flex flex-col">
          <div className="text-sm font-medium">{review.vehicle}</div>
          <div className="text-xs text-gray-500">{review.milesDriven} miles</div>
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
            size="sm"
            variant="light"
            onPress={() => onView(review)}
            className="text-blue-600 hover:text-blue-800"
            startContent={
              <EyeIcon className="w-4 h-4" />
            }
          >
            View
          </Button>
          <Button
            size="sm"
            variant="light"
            onPress={() => onEdit(review)}
            className="text-[#05CB14] hover:text-[#E55A00]"
            startContent={
              <EditIcon className="w-4 h-4" />
            }
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="light"
            color="danger"
            onPress={() => onDelete(review.id)}
            className="text-red-600 hover:text-red-800"
            startContent={
              <DeleteIcon className="w-4 h-4" />
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
