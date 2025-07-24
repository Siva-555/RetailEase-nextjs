"use client";

import { useMemo, useState } from "react";

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

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ProductModal from "./ProductModal";

import type { Inventory as InventoryType } from "@prisma/client";
import CellRenderer, {
  CustomCellRendererProps,
} from "@/components/common/CellRenderer";
import { IconEdit } from "@tabler/icons-react";
import { LucidePlus } from "lucide-react";

ModuleRegistry.registerModules([
  AllCommunityModule,
  MasterDetailModule,
  StatusBarModule,
  SideBarModule,
  FiltersToolPanelModule,
  ColumnsToolPanelModule,
]);

type Props = {
  rowData: InventoryType[] | null | undefined;
};

type EditProductType = {
  open: boolean;
  rowData: InventoryType | null | undefined;
};

const Inventory = ({ rowData }: Props) => {
  const [addProductOpen, setAddProductOpen] = useState<boolean>(false);
  const [editProduct, setEditProduct] = useState<EditProductType>({
    open: false,
    rowData: undefined,
  });

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

  const onClickEditProduct = (params: CustomCellRendererProps) => {
    if (params.data?.id) {
      setEditProduct({ open: true, rowData: params.data });
    }
  };

  const columnDefs: ColDef<InventoryType>[] = useMemo(() => {
    return [
      {
        headerName: "",
        field: "id",
        width: 45,
        filter: false,
        resizable: false,
        pinned: true,
        cellRendererSelector: () => {
          return {
            component: CellRenderer,
            params: {
              title: "Edit or Delete",
              className: "pointer",
              onClick: onClickEditProduct,
              cusRenderer: (
                <div className="flex items-center gap-2">
                  <span className="text-blue-600 hover:text-blue-800 cursor-pointer text-lg">
                    <IconEdit className="text-sm" size={18} />
                  </span>
                </div>
              ),
            },
          };
        },
      },
      { headerName: "Product code", field: "product_code", width: 135 },
      { headerName: "Product name", field: "product_name", width: 145 },
      { headerName: "Product units", field: "product_units", width: 140 },

      {
        headerName: "MRP (₹)",
        field: "mrp",
        width: 105,
        valueFormatter: (params) => {
          if (params.value === null || params.value === undefined) return "";
          return `₹ ${params.value.toFixed(2)}`;
        },
      },
      {
        headerName: "Sell price (₹)",
        field: "sell_price",
        width: 130,
        valueFormatter: (params) => {
          if (params.value === null || params.value === undefined) return "";
          return `₹ ${params.value.toFixed(2)}`;
        },
      },

      {
        headerName: "Available Qty/Kg",
        field: "available_quantity",
        width: 175,
      },
      { headerName: "Sold Quantity", field: "sold_quantity", width: 140 },

      // { headerName: "Modified date", field: "modified_date" },
      { headerName: "Email", field: "modified_by" },
    ];
  }, []);

  const onEditProductClose = () => {
    setEditProduct({ open: false, rowData: undefined });
  };

  return (
    <div className="size-full flex flex-col">
      <div className="flex flex-row justify-end">
        <Dialog open={addProductOpen} onOpenChange={setAddProductOpen}>
          <DialogTrigger asChild>
            <Button>
              <LucidePlus />Add Product
              {/* <span className="hidden md:inline">Add Product</span> */}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-lvh overflow-auto">
            <DialogHeader>
              <DialogTitle className="">Add Product</DialogTitle>
              <DialogDescription>
                Fill in the product details to add it to the inventory.
              </DialogDescription>
            </DialogHeader>
            <ProductModal
              className="mt-1"
              onSuccess={() => setAddProductOpen(false)}
            />
          </DialogContent>
        </Dialog>
        <Dialog open={editProduct.open} onOpenChange={onEditProductClose}>
          <DialogContent className="max-h-lvh overflow-auto">
            <DialogHeader>
              <DialogTitle className="">
                Edit Product:
                <span
                  title="Product Code"
                  className="text-sm rounded-2xl bg-neutral-300 px-2.5 py-1 ml-2"
                >
                  {editProduct?.rowData?.product_code}
                </span>
              </DialogTitle>
              <DialogDescription>
                Modify the details of this product or delete it from inventory.
              </DialogDescription>
            </DialogHeader>
            <ProductModal
              className="mt-1"
              edit={editProduct.open}
              rowData={editProduct.rowData ?? undefined}
              onSuccess={onEditProductClose}
            />
          </DialogContent>
        </Dialog>
      </div>
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
        <div className="h-[70vh] mt-2 ag-theme-quartz text-sm ">
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

export default Inventory;
