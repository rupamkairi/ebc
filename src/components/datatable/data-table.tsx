"use client";

import * as React from "react";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  useReactTable,
  PaginationState,
  OnChangeFn,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "@/components/datatable/data-table-pagination";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageCount?: number;
  pagination?: PaginationState;
  onPaginationChange?: OnChangeFn<PaginationState>;
  sorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
  loading?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageCount = -1, // -1 means standard auto-pagination if client-side, but usually we pass total pages from server
  pagination,
  onPaginationChange,
  sorting,
  onSortingChange,
  loading = false,
}: DataTableProps<TData, TValue>) {
  // If no external control, we can use internal state, but for "server-side" usually controlled is best.
  // We'll assume controlled if props are provided.

  // Internal state fallback if not controlled (though requirement implies server connection)
  const [internalSorting, setInternalSorting] = React.useState<SortingState>(
    []
  );
  const [internalPagination, setInternalPagination] =
    React.useState<PaginationState>({
      pageIndex: 0,
      pageSize: 10,
    });

  // The active source of truth for pagination (controlled prop or uncontrolled local state)
  const activePagination = pagination ?? internalPagination;

  const handlePaginationChange = React.useCallback<OnChangeFn<PaginationState>>(
    (updater) => {
      const next = typeof updater === "function" ? updater(activePagination) : updater;
      
      // If the page size has changed, automatically reset the page index back to 0
      // to avoid out-of-bounds page indexes and stale update races.
      if (next.pageSize !== activePagination.pageSize) {
        next.pageIndex = 0;
      }

      if (onPaginationChange) {
        onPaginationChange(next);
      } else {
        setInternalPagination(next);
      }
    },
    [onPaginationChange, activePagination]
  );

  const dynamicPageCount = React.useMemo(() => {
    const currentPageIndex = activePagination.pageIndex;
    const currentPageSize = activePagination.pageSize;
    const currentDataLength = data.length;

    if (pageCount !== -1) return pageCount;

    // If the server returned more items than the page size, we are paginating client-side.
    if (currentDataLength > currentPageSize) {
      return Math.ceil(currentDataLength / currentPageSize);
    }

    if (currentDataLength === 0 && currentPageIndex === 0) return 1;

    // If loaded data length equals page size, there is almost certainly a next page
    if (currentDataLength === currentPageSize) {
      return currentPageIndex + 2;
    }

    // Otherwise, current page is the last page
    return currentPageIndex + 1;
  }, [pageCount, activePagination, data.length]);

  const paginatedData = React.useMemo(() => {
    const currentPageIndex = activePagination.pageIndex;
    const currentPageSize = activePagination.pageSize;

    // If the server returned all items (i.e. length > pageSize), slice client-side
    if (data.length > currentPageSize) {
      const start = currentPageIndex * currentPageSize;
      const end = start + currentPageSize;
      return data.slice(start, end);
    }

    return data;
  }, [data, activePagination]);

  const table = useReactTable({
    data: paginatedData,
    columns,
    pageCount: dynamicPageCount,
    state: {
      sorting: sorting ?? internalSorting,
      pagination: activePagination,
    },
    onSortingChange: onSortingChange ?? setInternalSorting,
    onPaginationChange: handlePaginationChange,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
  });

  return (
    <div className="space-y-4">
      <div className="rounded-md border w-full overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} totalItems={data.length} />
    </div>
  );
}
