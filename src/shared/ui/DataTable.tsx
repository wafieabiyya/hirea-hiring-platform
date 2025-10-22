"use client";

import * as React from "react";
import {
  type ColumnDef,
  type ColumnOrderState,
  type ColumnSizingState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronUp, ChevronDown } from "lucide-react";
import { useEffect } from "react";

type Props<TData> = {
  data: TData[];
  columns: ColumnDef<TData, unknown>[];
  initialColumnOrder?: string[];
  globalFilterPlaceholder?: string;
};

export default function DataTable<TData>({
  data,
  columns,
  initialColumnOrder,
  globalFilterPlaceholder = "Search…",
}: Props<TData>) {
  const selectionColumn = React.useMemo<ColumnDef<TData>>(
    () => ({
      id: "__select__",
      header: ({ table }) => {
        const checked = table.getIsAllPageRowsSelected();
        const some = table.getIsSomePageRowsSelected();
        return (
          <input
            type="checkbox"
            checked={checked}
            ref={(el) => {
              if (el) el.indeterminate = !checked && some;
            }}
            onChange={table.getToggleAllPageRowsSelectedHandler()}
            aria-label="Select all rows on this page"
            className="h-4 w-4 rounded border-gray-300 text-[#01959F] focus:ring-[#01959F]"
          />
        );
      },
      cell: ({ row }) => {
        const checked = row.getIsSelected();
        const some = row.getIsSomeSelected();
        return (
          <input
            type="checkbox"
            checked={checked}
            ref={(el) => {
              if (el) el.indeterminate = !checked && some;
            }}
            onChange={row.getToggleSelectedHandler()}
            aria-label="Select row"
            className="h-4 w-4 rounded border-gray-300 text-[#01959F] focus:ring-[#01959F]"
          />
        );
      },
      enableSorting: false,
      enableResizing: false,
      size: 48,
    }),
    [],
  );

  const finalColumns = React.useMemo(
    () => [selectionColumn, ...columns],
    [columns, selectionColumn],
  );

  const defaultOrder = React.useMemo<ColumnOrderState>(() => {
    const ids = finalColumns
      .map((c) => {
        if ("accessorKey" in c && typeof c.accessorKey === "string")
          return c.accessorKey as string;
        if ("id" in c && typeof c.id === "string") return c.id as string;
        return undefined;
      })
      .filter((v): v is string => !!v && v !== "__select__");
    return ids;
  }, [finalColumns]);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState<string>("");
  const [columnOrder, setColumnOrder] = React.useState<ColumnOrderState>(
    initialColumnOrder ?? defaultOrder,
  );
  const [columnSizing, setColumnSizing] = React.useState<ColumnSizingState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data,
    columns: finalColumns,
    state: {
      sorting,
      globalFilter,
      columnOrder,
      columnSizing,
      pagination,
      rowSelection,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnOrderChange: setColumnOrder,
    onColumnSizingChange: setColumnSizing,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    onPaginationChange: setPagination,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    columnResizeMode: "onChange",
    enableRowSelection: true,
  });

  const dragColId = React.useRef<string | null>(null);
  const onHeaderDragStart = (id: string) => (e: React.DragEvent) => {
    if (id === "__select__") return;
    dragColId.current = id;
    e.dataTransfer.setData("text/plain", id);
  };
  const onHeaderDrop = (id: string) => (e: React.DragEvent) => {
    e.preventDefault();
    if (id === "__select__") return;
    const src = dragColId.current;
    if (!src || src === id) return;

    const order = table.getState().columnOrder;
    const srcIdx = order.indexOf(src);
    const dstIdx = order.indexOf(id);
    if (srcIdx === -1 || dstIdx === -1) return;

    const next = [...order];
    next.splice(dstIdx, 0, next.splice(srcIdx, 1)[0]);
    table.setColumnOrder(next);
    dragColId.current = null;
  };

  useEffect(() => {
    setPagination((p) => ({ ...p, pageIndex: 0 }));
  }, [globalFilter, data, pagination.pageSize]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder={globalFilterPlaceholder}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder-gray-500 transition-colors focus:border-[#01959F] focus:outline-none focus:ring-1 focus:ring-[#01959F] sm:w-64"
        />
        <div className="hidden items-center gap-2 text-sm sm:flex">
          <span className="text-gray-600">Rows per page:</span>
          <select
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 transition-colors focus:border-[#01959F] focus:outline-none focus:ring-1 focus:ring-[#01959F]"
            value={pagination.pageSize}
            onChange={(e) =>
              setPagination((p) => ({ ...p, pageSize: Number(e.target.value) }))
            }
          >
            {[10, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-sm">
          <thead className="sticky top-0 border-b border-gray-200 bg-white">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((h) => {
                  const id = h.column.id;
                  const canSort = h.column.getCanSort();
                  const size = h.getSize();
                  const isSelect = id === "__select__";

                  return (
                    <th
                      key={h.id}
                      style={{ width: size }}
                      className={`relative select-none whitespace-nowrap px-3 py-3 text-left text-xs font-semibold text-gray-700 sm:px-4 ${
                        isSelect ? "sticky left-0 bg-white z-20" : ""
                      }`}
                      draggable={!isSelect}
                      onDragStart={
                        !isSelect ? onHeaderDragStart(id) : undefined
                      }
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={!isSelect ? onHeaderDrop(id) : undefined}
                    >
                      <div
                        className={`flex items-center gap-2 ${
                          canSort && !isSelect
                            ? "cursor-pointer hover:text-gray-900"
                            : ""
                        }`}
                        onClick={
                          canSort && !isSelect
                            ? h.column.getToggleSortingHandler()
                            : undefined
                        }
                      >
                        {flexRender(h.column.columnDef.header, h.getContext())}
                        {canSort && !isSelect && (
                          <div className="flex flex-col gap-0.5">
                            {h.column.getIsSorted() === "asc" && (
                              <ChevronUp className="h-4 w-4 text-[#01959F]" />
                            )}
                            {h.column.getIsSorted() === "desc" && (
                              <ChevronDown className="h-4 w-4 text-[#01959F]" />
                            )}
                          </div>
                        )}
                      </div>

                      {!isSelect && h.column.getCanResize() && (
                        <div
                          onMouseDown={h.getResizeHandler()}
                          onTouchStart={h.getResizeHandler()}
                          className="absolute right-0 top-0 h-full w-1 cursor-col-resize select-none touch-none opacity-0 hover:bg-[#01959F] hover:opacity-100"
                        />
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-gray-100 bg-white transition-colors hover:bg-gray-50"
              >
                {row.getVisibleCells().map((cell) => {
                  const size = cell.column.getSize();
                  const isSelect = cell.column.id === "__select__";
                  return (
                    <td
                      key={cell.id}
                      style={{ width: size }}
                      className={`whitespace-nowrap px-3 py-3 text-sm text-gray-800 sm:px-4 ${
                        isSelect ? "sticky left-0 bg-white z-10" : ""
                      }`}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
            {table.getRowModel().rows.length === 0 && (
              <tr>
                <td
                  colSpan={table.getAllLeafColumns().length}
                  className="px-4 py-8 text-center text-gray-500"
                >
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-gray-600">
          Page{" "}
          <span className="font-semibold text-gray-900">
            {pagination.pageIndex + 1}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-gray-900">
            {table.getPageCount()}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            className="rounded-lg border border-gray-200 px-2 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 sm:px-3 sm:text-sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            First
          </button>
          <button
            className="rounded-lg border border-gray-200 px-2 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 sm:px-3 sm:text-sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Prev
          </button>
          <button
            className="rounded-lg border border-gray-200 px-2 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 sm:px-3 sm:text-sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </button>
          <button
            className="rounded-lg border border-gray-200 px-2 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 sm:px-3 sm:text-sm"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            Last
          </button>
        </div>
      </div>
    </div>
  );
}
