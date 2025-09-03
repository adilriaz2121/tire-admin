"use client";

import React from "react";
import { IArticle } from "@/helpers/types";
import { EditIcon } from "@/components/icons/table/edit-icon";
import { DeleteIcon } from "@/components/icons/table/delete-icon";
import { EyeIcon } from "@/components/icons/table/eye-icon";
import { deleteArticle } from "@/actions/article.action";
import { toast } from "sonner";

interface RenderCellProps {
  article: IArticle;
  columnKey: string | number;
  onEdit: (article: IArticle) => void;
}

export const RenderCell: React.FC<RenderCellProps> = ({ article, columnKey, onEdit }) => {
  const cellValue = article[columnKey as keyof IArticle];

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this article?")) {
      const result = await deleteArticle(article.id);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Article deleted successfully");
        window.location.reload();
      }
    }
  };

  switch (columnKey) {
    case "title":
      return (
        <div className="flex flex-col">
          <p className="text-bold text-small capitalize">{cellValue}</p>
        </div>
      );
    case "detail":
      return (
        <div className="flex flex-col">
          <p className="text-bold text-small capitalize line-clamp-2">
            {typeof cellValue === "string" && cellValue.length > 100
              ? `${cellValue.substring(0, 100)}...`
              : cellValue}
          </p>
        </div>
      );
    case "createdAt":
      return (
        <div className="flex flex-col">
          <p className="text-bold text-small capitalize">
            {new Date(cellValue as string).toLocaleDateString()}
          </p>
        </div>
      );
    case "actions":
      return (
        <div className="relative flex items-center gap-2">
          <span
            className="text-lg text-default-400 cursor-pointer active:opacity-50"
            onClick={() => onEdit(article)}
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
