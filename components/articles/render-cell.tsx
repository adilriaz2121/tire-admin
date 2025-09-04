"use client";

import React from "react";
import { IArticle } from "@/helpers/types";

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
          <button
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            onClick={() => onEdit(article)}
            title="Edit Article"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            onClick={handleDelete}
            title="Delete Article"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      );
    default:
      return cellValue;
  }
};
