"use client";

import React, { useState } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
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
    <div className="flex flex-col gap-4">
      <div className="flex justify-between gap-3 items-end">
        <SearchInput
          name="Articles"
          callback={(value) => updateSearchParams({ query: value, page: "1" })}
        />
        <div className="flex gap-3">
          <button
            onClick={handleAdd}
            className="bg-primaryColor text-black px-4 py-2 rounded-lg font-medium hover:bg-primaryColor/90 transition-colors"
          >
            Add Article
          </button>
        </div>
      </div>
      
      <Table aria-label="Articles table">
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
        <TableBody items={data} emptyContent="No articles found">
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>
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
