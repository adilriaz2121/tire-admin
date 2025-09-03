import {
  Link,
  SelectItem,
  Pagination,
  Select,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import React, { Key } from "react";
import { IColumn, IMeta } from "@/helpers/types";
import useUpdateSearchParams from "../hooks/useUpdateSearchParams";

type DataItem = Record<string, any>;

// Define a type for the RenderCell function
type RenderCellFunction<T> = ({
  item,
  columnKey,
}: {
  item: T;
  columnKey: string | React.Key;
}) => React.ReactNode;

interface TableWrapperProps<T> {
  data: T[];
  columns: IColumn[];
  RenderCell: RenderCellFunction<T>;
  meta: IMeta;
}

export const TableWrapper = <T extends DataItem>({
  data,
  columns,
  meta,
  RenderCell,
}: TableWrapperProps<T>) => {
  const { updateSearchParams } = useUpdateSearchParams();
  const pageItems = Math.round((meta.pageItems + 5) / 10) * 10;
  return (
    <div className="w-full flex flex-col gap-4">
      <Table aria-label="Example table with custom cells">
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
        <TableBody items={data}>
          {(item) => (
            <TableRow key={item._id}>
              {(columnKey) => (
                <TableCell>
                  {RenderCell({ item: item, columnKey: columnKey })}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-end gap-4">
        <Pagination
          total={meta.totalPages}
          isCompact

          showControls
          onChange={(page) => updateSearchParams("page", page.toString())}
          initialPage={meta.currentPage}
          variant="flat"
        />
        <Select
          name="items"

          className="w-[150px]"
          variant="bordered"
          defaultSelectedKeys={[
            pageItems <= 10 ? "ten" : pageItems <= 20 ? "twenty" : "fifty",
          ]}
          onChange={(e) =>
            updateSearchParams(
              "limit",
              (e.target.value === "ten"
                ? 10
                : e.target.value === "twenty"
                  ? 20
                  : 50
              ).toString()
            )
          }
        >
          <SelectItem key="ten" value={10}>
            10 per page
          </SelectItem>
          <SelectItem key="twenty" value={20}>
            20 per page
          </SelectItem>
          <SelectItem key="fifty" value={50}>
            50 per page
          </SelectItem>
        </Select>
      </div>
    </div>
  );
};
