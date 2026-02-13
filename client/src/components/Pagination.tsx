import { useTranslation } from "react-i18next";

import { type Table } from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, LoaderCircle } from "lucide-react";

import { Button } from "@components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";

interface Props<TData> {
  table: Table<TData>;
  isLoading?: boolean;
}

export default function Pagination<TData>({ table, isLoading }: Props<TData>) {
  const { t } = useTranslation("common");

  if (isLoading) {
    return (
      <div className="flex items-center justify-between p-4 border-t-1 border-gray-200">
        <LoaderCircle className="h-5 w-5 animate-spin" />
        <LoaderCircle className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-4 border-t-1 border-gray-200">
      <div className="flex gap-4 items-baseline">
        <div className="text-muted-foreground hidden flex-1 text-sm leading-none lg:flex">
          {table.getFilteredSelectedRowModel().rows.length} {t("of")}{" "}
          {table.getFilteredRowModel().rows.length} {t("selected")}
        </div>
        {table.getFilteredSelectedRowModel().rows.length > 0 && (
          <>
            <Button
              variant="outline"
              className="border-red-500 text-red-500 font-normal hover:border-red-500 hover:text-white hover:bg-red-500"
              disabled
            >
              {t("delete")}
            </Button>
            <Button
              variant="outline"
              className="border-indigo-500 text-indigo-600 font-normal hover:border-indigo-500 hover:text-white hover:bg-indigo-500"
              disabled
            >
              {t("moderate")}
            </Button>
          </>
        )}
      </div>
      <div className="flex w-full items-center gap-8 lg:w-fit">
        <Select
          value={`${table.getState().pagination.pageSize}`}
          onValueChange={(value) => {
            table.setPageSize(Number(value));
          }}
        >
          <SelectTrigger size="sm" className="w-20" id="rows-per-page">
            <SelectValue placeholder={table.getState().pagination.pageSize} />
          </SelectTrigger>
          <SelectContent side="top">
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <SelectItem key={pageSize} value={`${pageSize}`}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex w-fit items-center justify-center text-sm font-medium">
          {t("page")} {table.getState().pagination.pageIndex + 1} {t("of")} {table.getPageCount()}
        </div>
        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">{t("goToFirstPage")}</span>
            <ChevronsLeft />
          </Button>
          <Button
            variant="outline"
            className="size-8"
            size="icon"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">{t("goToPreviousPage")}</span>
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            className="size-8"
            size="icon"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">{t("goToNextPage")}</span>
            <ChevronRight />
          </Button>
          <Button
            variant="outline"
            className="hidden size-8 lg:flex"
            size="icon"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">{t("goToLastPage")}</span>
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
