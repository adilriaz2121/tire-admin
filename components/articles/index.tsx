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
import { IArticle, IMeta } from "@/helpers/types";
import { RenderCell } from "./render-cell";
import { ArticleModal } from "./article-modal";
import SearchInput from "../search-input";
import useUpdateSearchParams from "@/components/hooks/useTableSearchParams";

interface ArticlesProps {
  data: IArticle[];
  meta: IMeta;
}

export const Articles: React.FC<ArticlesProps> = ({ data, meta }) => {
  const [selectedArticle, setSelectedArticle] = useState<IArticle | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { searchParams, updateSearchParams } = useUpdateSearchParams();

  const columns = [
    { name: "TITLE", uid: "title" },
    { name: "DETAIL", uid: "detail" },
    { name: "CREATED", uid: "createdAt" },
    { name: "ACTIONS", uid: "actions" },
  ];

  const handleEdit = (article: IArticle) => {
    setSelectedArticle(article);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedArticle(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedArticle(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between gap-4 items-center">
        <div className="flex-1 max-w-md">
          <SearchInput
            name="Articles"
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
          Add Article
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <Table aria-label="Articles table" removeWrapper>
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="text-gray-500 text-lg font-medium">
                  No articles found
                </p>
                <p className="text-gray-400 text-sm">
                  Get started by creating your first article
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
                      article={item}
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
            articles
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
        <ArticleModal
          article={selectedArticle}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};
