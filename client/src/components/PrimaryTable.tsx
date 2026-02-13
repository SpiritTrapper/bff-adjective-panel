import { useState } from "react";
import { useTranslation } from "react-i18next";

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { LoaderCircle, SearchX } from "lucide-react";
import { toast } from "sonner";
import useSWR from "swr";

import Pagination from "@components/Pagination";
import TDropdownMenu from "@components/TDropdownMenu";
import THeaderCheckbox from "@components/THeaderCheckbox";
import TRowCheckbox from "@components/TRowCheckbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui/table";

import { TABLE_PAGE_SIZE } from "@lib/constants";
import { ListResponse } from "@lib/types";
import { checkIfIsFlat, parseQueryFilters, swrFetcher } from "@lib/utils";

interface Props<TData extends { id: number }, TValue> {
  columns: ColumnDef<TData, TValue>[];
  url: string;
  onWatch?: (id: number) => void;
  onMakePromo?: (id: number, name: string) => void;
  filters?: Record<string, string | number | boolean>;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  isProtected?: boolean;
}

interface CallbackProps {
  id: number;
  name: string;
  promoState?: {
    isPromoted: boolean;
  };
}

export default function PrimaryTable<TData extends CallbackProps, TValue>({
  url,
  columns,
  filters,
  onWatch,
  onDelete,
  onEdit,
  onMakePromo,
}: Props<TData, TValue>) {
  const { t } = useTranslation("common");
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: TABLE_PAGE_SIZE,
  });

  const {
    data: newList,
    isLoading,
    isValidating,
  } = useSWR<ListResponse<TData> | TData[], TValue>(
    `${url}?take=${pagination.pageSize}&skip=${pagination.pageIndex * TABLE_PAGE_SIZE}${parseQueryFilters(filters)}`,
    (queryUrl) => swrFetcher(queryUrl),
    {
      onError: () => {
        toast.error(t("listLoadError"));
      },
    },
  );

  const { data, total } = checkIfIsFlat(newList);
  const pageCount = Math.ceil(total / pagination.pageSize);

  const extendedColumns: ColumnDef<TData, TValue>[] = [
    {
      id: "select",
      header: ({ table }) => <THeaderCheckbox table={table} />,
      cell: ({ row }) => <TRowCheckbox row={row} />,
      enableSorting: false,
      enableHiding: false,
    },
    ...columns,
    {
      id: "actions",
      cell: ({ row }) => (
        <TDropdownMenu
          label={t("openMenu")}
          items={[
            ...(onWatch
              ? [
                  {
                    title: t("view"),
                    action: () => onWatch(row.original.id),
                  },
                ]
              : []),
            ...(onEdit
              ? [
                  {
                    title: t("edit"),
                    action: () => onEdit(row.original.id),
                  },
                ]
              : []),
            ...(onMakePromo && !row.original.promoState?.isPromoted
              ? [
                  {
                    title: t("makePromo"),
                    action: () => onMakePromo(row.original.id, row.original.name),
                  },
                ]
              : []),
            ...(onDelete
              ? [
                  {
                    title: t("delete"),
                    action: () => onDelete(row.original.id),
                    isDelete: true,
                  },
                ]
              : []),
          ]}
        />
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns: extendedColumns,
    pageCount,
    state: {
      pagination,
      rowSelection,
    },
    enableRowSelection: true,
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  if (!isLoading && !isValidating && !data?.length) {
    return (
      <div className="flex flex-col min-h-[80vh] w-full p-3">
        <div className="m-auto flex flex-col gap-8 items-center">
          <SearchX size={60} strokeWidth={1} className="stroke-indigo-600" />
          <h2 className="font-normal text-xl">{t("emptyList")}</h2>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-muted sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="p-3">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="**:data-[slot=table-cell]:first:w-8">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="p-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : isLoading ? (
              <TableRow className="flex w-full py-4 px-2">
                <TableCell>
                  <LoaderCircle className="h-5 w-5 animate-spin" />
                </TableCell>
              </TableRow>
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {t("nothingFound")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <Pagination table={table} isLoading={isLoading} />
      </div>
    </>
  );
}
