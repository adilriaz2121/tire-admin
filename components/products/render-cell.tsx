"use client";

import React from "react";
import { Chip, Button } from "@nextui-org/react";
import { IProduct } from "@/helpers/types";
import { EditIcon, DeleteIcon, EyeIcon } from "@nextui-org/shared-icons";
import { deleteProduct, toggleProductActive } from "@/actions/product.action";
import { toast } from "sonner";

interface RenderCellProps {
  product: IProduct;
  columnKey: string;
  onEdit: (product: IProduct) => void;
  onView: (product: IProduct) => void;
}

export const RenderCell: React.FC<RenderCellProps> = ({
  product,
  columnKey,
  onEdit,
  onView,
}) => {
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      const result = await deleteProduct(product.id);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Product deleted successfully");
        window.location.reload();
      }
    }
  };

  const handleToggleActive = async () => {
    const result = await toggleProductActive(product.id, product.isActive);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(
        `Product ${product.isActive ? "deactivated" : "activated"} successfully`
      );
      window.location.reload();
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  switch (columnKey) {
    case "make":
      return (
        <div className="flex flex-col">
          <p className="text-bold text-small capitalize">{product.make}</p>
        </div>
      );

    case "model":
      return (
        <div className="flex flex-col">
          <p className="text-bold text-small capitalize">{product.model}</p>
        </div>
      );

    case "year":
      return (
        <div className="flex flex-col">
          <p className="text-bold text-small">{product.year}</p>
        </div>
      );

    case "size":
      return (
        <div className="flex flex-col">
          <p className="text-bold text-small">{product.size}</p>
        </div>
      );

    case "price":
      return (
        <div className="flex flex-col">
          <p className="text-bold text-small text-green-600">
            {formatPrice(product.price)}
          </p>
        </div>
      );

    case "quantity":
      return (
        <div className="flex flex-col">
          <p className="text-bold text-small">{product.quantity}</p>
        </div>
      );

    case "isActive":
      return (
        <Chip
          className="capitalize"
          color={product.isActive ? "success" : "danger"}
          size="sm"
          variant="flat"
        >
          {product.isActive ? "Active" : "Inactive"}
        </Chip>
      );

    case "actions":
      return (
        <div className="relative flex items-center gap-2">
          <Button
            isIconOnly
            size="sm"
            variant="light"
            onPress={() => onView(product)}
            className="text-green-600 hover:text-green-800"
          >
            <EyeIcon className="w-4 h-4" />
          </Button>
          <Button
            isIconOnly
            size="sm"
            variant="light"
            onPress={() => onEdit(product)}
            className="text-blue-600 hover:text-blue-800"
          >
            <EditIcon className="w-4 h-4" />
          </Button>
          <Button
            isIconOnly
            size="sm"
            variant="light"
            onPress={handleToggleActive}
            className={
              product.isActive
                ? "text-red-600 hover:text-red-800"
                : "text-green-600 hover:text-green-800"
            }
          >
            {product.isActive ? (
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
                  d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"
                />
              </svg>
            ) : (
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
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </Button>
          <Button
            isIconOnly
            size="sm"
            variant="light"
            onPress={handleDelete}
            className="text-red-600 hover:text-red-800"
          >
            <DeleteIcon className="w-4 h-4" />
          </Button>
        </div>
      );

    default:
      return <div></div>;
  }
};
