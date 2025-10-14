"use client";
import { useMemo } from "react";

import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import type { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";

import {
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  MasterDetailModule,
  SideBarModule,
  StatusBarModule,
} from "ag-grid-enterprise";

import CellRenderer from "@/components/common/CellRenderer";

import { Bills } from "@prisma/client";
import { formatUTCDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { IconEye } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

ModuleRegistry.registerModules([
  AllCommunityModule,
  MasterDetailModule,
  StatusBarModule,
  SideBarModule,
  FiltersToolPanelModule,
  ColumnsToolPanelModule,
]);

const BillHistoryGrid = ({ rowData }: { rowData: Bills[] }) => {
  const defaultColDef = useMemo(() => {
    return {
      sortable: true,
      filter: true,
      resizable: true,
      pivot: false,
      autoHeaderHeight: true,
      wrapHeaderText: true,
      // minWidth: 100,
    };
  }, []);
  const columnDefs: ColDef<Bills>[] = useMemo(() => {
    return [
      { headerName: "Bill no", field: "bill_no", width: 165 },
      { headerName: "Customer", field: "customer_name", width: 145 },

      {
        headerName: "Tax (₹)",
        field: "tax",
        width: 105,
        valueFormatter: (params) => {
          if (params.value === null || params.value === undefined) return "";
          return `₹ ${params.value.toFixed(2)}`;
        },
      },
      {
        headerName: "Sub total (₹)",
        field: "subtotal",
        width: 145,
        valueFormatter: (params) => {
          if (params.value === null || params.value === undefined) return "";
          return `₹ ${params.value.toFixed(2)}`;
        },
      },

      {
        headerName: "Total (₹)",
        field: "total",
        width: 120,
        valueFormatter: (params) => {
          if (params.value === null || params.value === undefined) return "";
          return `₹ ${params.value.toFixed(2)}`;
        },
      },
      {
        headerName: "Status",
        field: "paid",
        width: 105,
        cellRendererSelector: (params) => {
          return {
            component: CellRenderer,
            params: {
              title: "Status",
              className: "",
              cusRenderer: (
                <div className="flex items-center gap-2">
                  <Badge variant={params.value ? "success" : "warningLight"} className="min-w-[65px]">
                    {params.value ? "Paid" : "Pending"}
                  </Badge>
                </div>
              ),
            },
          };
        },
      },
      {
        headerName: "Bill Dt",
        field: "created_date",
        width: 155,
        valueGetter: (params) => {
          if (!params.data?.created_date) return "";
          const date = formatUTCDate(params.data.created_date);
          return date;
        },
      },
      { headerName: "Created By", field: "created_by" },
      {
        headerName: "View",
        field: "id",
        width: 105,
        cellRendererSelector: (params) => {
          return {
            component: CellRenderer,
            params: {
              title: "Status",
              className: "",
              cusRenderer: (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="p-1" asChild>
                    <Link
                      href={
                        params.data?.bill_no
                          ? `/billing/view-bill/${params.data.bill_no}`
                          : "#"
                      }
                      target="_blank"
                    >
                      <IconEye />
                    </Link>
                  </Button>
                </div>
              ),
            },
          };
        },
      },
    ];
  }, []);
  return (
    <div className="size-full flex flex-col">
      {!rowData || rowData?.length == 0 ? (
        <div className="size-full flex-1 flex flex-col justify-center items-center">
          <h2 className="text-center text-3xl mt-6 ">
            No products found in inventory.
          </h2>
          <p className="text-center text-sm mt-2 text-gray-500">
            Please add products to the inventory to manage them.
          </p>
        </div>
      ) : (
        <div className="h-[70vh] mt-6 ag-theme-quartz text-sm ">
          <AgGridReact
            // theme={themeBalham}
            columnDefs={columnDefs}
            headerHeight={35}
            rowHeight={30}
            rowData={rowData}
            defaultColDef={defaultColDef}
            pagination={true}
            paginationPageSize={100}
            // onGridReady={onGridReadyConsignments}
            // enableRangeSelection={true}
            // enableCellContextMenu={true}
            masterDetail={true}
            // detailCellRendererParams={detailCellRendererParams}
            // onCellDoubleClicked={onCellDoubleClicked}
            sideBar={{
              toolPanels: [
                {
                  id: "columns",
                  labelDefault: "Columns",
                  labelKey: "columns",
                  iconKey: "columns",
                  toolPanel: "agColumnsToolPanel",
                  toolPanelParams: {
                    suppressPivotMode: true,
                    suppressRowGroups: true,
                    suppressValues: true,
                  },
                },
                {
                  id: "filters",
                  labelDefault: "Filters",
                  labelKey: "filters",
                  iconKey: "filter",
                  toolPanel: "agFiltersToolPanel",
                },
              ],
            }}
            statusBar={{
              statusPanels: [
                {
                  statusPanel: "agTotalAndFilteredRowCountComponent",
                  align: "left",
                },
                {
                  statusPanel: "agTotalRowCountComponent",
                  align: "center",
                },
                { statusPanel: "agFilteredRowCountComponent" },
                { statusPanel: "agSelectedRowCountComponent" },
                { statusPanel: "agAggregationComponent" },
              ],
            }}
          />
        </div>
      )}
    </div>
  );
};

export default BillHistoryGrid;
