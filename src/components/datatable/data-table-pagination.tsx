"use client";

import { useState, useEffect } from "react";
import { Table } from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  const [localPageSize, setLocalPageSize] = useState(
    table.getState().pagination.pageSize
  );

  useEffect(() => {
    setLocalPageSize(table.getState().pagination.pageSize);
  }, [table.getState().pagination.pageSize]);

  const [localPageIndex, setLocalPageIndex] = useState(
    table.getState().pagination.pageIndex
  );

  useEffect(() => {
    setLocalPageIndex(table.getState().pagination.pageIndex);
  }, [table.getState().pagination.pageIndex]);

  const pageCount = table.getPageCount();

  const handleFirstPage = () => {
    setLocalPageIndex(0);
    table.setPageIndex(0);
  };

  const handlePreviousPage = () => {
    const nextVal = Math.max(0, localPageIndex - 1);
    setLocalPageIndex(nextVal);
    table.previousPage();
  };

  const handleNextPage = () => {
    const nextVal = Math.min(pageCount - 1, localPageIndex + 1);
    setLocalPageIndex(nextVal);
    table.nextPage();
  };

  const handleLastPage = () => {
    const lastIndex = Math.max(0, pageCount - 1);
    setLocalPageIndex(lastIndex);
    table.setPageIndex(lastIndex);
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-2 py-2">
      <div className="flex-1 text-sm text-muted-foreground text-center sm:text-left">
        {/* {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected. */}
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 lg:gap-8 w-full sm:w-auto">
        <div className="flex items-center justify-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <select
            value={localPageSize}
            onChange={(e) => {
              const val = Number(e.target.value);
              setLocalPageSize(val);
              table.setPageSize(val);
            }}
            className="h-8 w-[70px] rounded-md border border-input bg-background dark:bg-input/30 px-2 py-1 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize} className="bg-popover text-popover-foreground">
                {pageSize}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center justify-center space-x-6 w-full sm:w-auto">
          <div className="flex items-center justify-center text-sm font-medium min-w-[80px]">
            Page {localPageIndex + 1} of{" "}
            {pageCount}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={handleFirstPage}
              disabled={localPageIndex === 0}
            >
              <span className="sr-only">Go to first page</span>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={handlePreviousPage}
              disabled={localPageIndex === 0}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={handleNextPage}
              disabled={localPageIndex >= pageCount - 1}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={handleLastPage}
              disabled={localPageIndex >= pageCount - 1}
            >
              <span className="sr-only">Go to last page</span>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
