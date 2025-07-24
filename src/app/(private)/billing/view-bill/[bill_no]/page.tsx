"use client";
import { useParams } from "next/navigation";
import { useState, useEffect, useRef, useTransition } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Bills } from "@prisma/client";
import { formatUTCDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  IconCircleCheck,
  IconCircleCheckFilled,
  IconDownload,
  IconEye,
  IconPrinter,
} from "@tabler/icons-react";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import InvoicePDF from "./InvoicePDF";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ViewBillPage() {
  const { bill_no } = useParams();
  const printRef = useRef(null);
  const router = useRouter();

  const [billDetails, setBillDetails] = useState<Bills | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [viewPdfModal, setViewPdfModal] = useState<boolean>(false);

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!bill_no) return;

    const fetchBill = async () => {
      try {
        const res = await fetch(`/api/bills/${bill_no}`);
        if (!res.ok) throw new Error("Failed to fetch bill");

        const data = await res.json();
        setBillDetails(data.bill_data);
      } catch (error) {
        console.error("Error fetching bill:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBill();
  }, [bill_no]);

  if (loading)
    return (
      <div className="size-full flex justify-center items-center">
        <span className="loader"></span>
      </div>
    );
  if (!bill_no || !billDetails)
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
          Bill Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          The bill you&#39;re looking for doesn&#39;t exist or couldn&#39;t be
          loaded.
        </p>
      </div>
    );

  const onClickMarkAsPaid = async () => {
    console.log("test mark as paid");

    startTransition(async () => {
      try {
        const res = await fetch(`/api/bills/${bill_no}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paid: true }),
        });
        if (!res.ok) throw new Error("Failed to fetch bill");

        toast.success("Bill updated successfully!");
        router.push("/billing/history");
      } catch (error) {
        console.error("Error fetching bill:", error);
        toast.error("Error", {
          description: "Failed to updat bill",
          duration: 10000,
        });
      }
    });
  };
  return (
    <div className="container mx-auto px-4 pt-3 pb-8">
      <header className="">
          <h1 className="text-xl text-center my-6 font-bold text-gray-800 dark:text-white">
            Bill Summary
          </h1>
      </header>
      <div className="container mx-auto max-w-4xl border-2  shadow-2xl rounded-lg">
        <div
          ref={printRef}
          id="invoice-print"
          className="print-section px-6 py-6 space-y-7"
        >
          {/* Store Name */}
          {billDetails?.store_name && (
            <div className="text-center text-xl font-bold">
              {billDetails.store_name}
            </div>
          )}
          {/* Store Info */}
          <div className="border border-gray-300 rounded-md p-3 text-sm">
            <div className="grid grid-cols-2 gap-y-2">
              {billDetails?.store_address && (
                <div className="text-left">
                  <span className="font-semibold">Address:</span>{" "}
                  {billDetails.store_address}
                </div>
              )}
              {billDetails?.mobile_no && (
                <div className="text-right">
                  <span className="font-semibold">Mobile:</span>{" "}
                  {billDetails.mobile_no}
                </div>
              )}
              {billDetails?.pincode && (
                <div className="text-left">
                  <span className="font-semibold">Pincode:</span>{" "}
                  {billDetails.pincode}
                </div>
              )}
              {billDetails?.fssai_no && (
                <div className="text-right">
                  <span className="font-semibold">FSSAI:</span>{" "}
                  {billDetails.fssai_no}
                </div>
              )}
              {billDetails?.gst_no && (
                <div className="text-left">
                  <span className="font-semibold">GST no:</span>{" "}
                  {billDetails.gst_no}
                </div>
              )}
            </div>
          </div>

          <h4 className="text-lg font-semibold text-center mt-4">
            TAX INVOICE
          </h4>

          {/* Bill Info */}
          <div className="rounded-md p-3 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-2 gap-x-4">
              {billDetails?.bill_no && (
                <div className="text-left">
                  <strong>Bill No:</strong> {billDetails.bill_no}
                </div>
              )}
              {billDetails?.created_date && (
                <div className="text-left md:text-center">
                  <strong>Bill Dt:</strong>{" "}
                  {formatUTCDate(billDetails.created_date)}
                </div>
              )}
              {billDetails?.created_by && (
                <div className="text-left md:text-right">
                  <strong>Issuer:</strong> {billDetails.created_by}
                </div>
              )}
            </div>
          </div>
          <Table tableClassName="mt-4">
            <TableHeader className="">
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Qty/Kg</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {billDetails?.items?.map((item, idx) => (
                <TableRow key={`${item.product_code}-${idx}`}>
                  <TableCell>{item.product_code}</TableCell>
                  <TableCell>{item.product_name}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>₹{item.total.toFixed(2)}</TableCell>
                  <TableCell>₹{item.total.toFixed(2)}</TableCell>
                </TableRow>
              ))}
              <TableRow className="font-semibold bg-gray-100">
                <TableCell colSpan={2}>
                  Total Items: {billDetails?.items?.length}
                </TableCell>
                <TableCell>
                  Total Qty:{" "}
                  {billDetails?.items?.reduce(
                    (acc, item) => acc + Number(item.quantity),
                    0
                  )}
                </TableCell>
                <TableCell />
                <TableCell />
              </TableRow>
            </TableBody>
          </Table>

          <div className="mt-6 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₹{billDetails?.subtotal?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax ({`${billDetails.tax_percentage}%`}):</span>
              <span>₹{billDetails?.tax?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>₹{billDetails?.total?.toFixed(2)}</span>
            </div>
          </div>
          {/* Customer Details at Bottom */}
          {billDetails?.customer_name ? (
            <div className="rounded-md p-4 text-sm border border-gray-300 w-fit">
              <h4 className="font-semibold mb-2">Customer Details</h4>
              <div className="flex flex-col gap-y-2">
                {billDetails?.customer_name && (
                  <div className="">
                    <strong>Customer:</strong> {billDetails.customer_name}
                  </div>
                )}
                {billDetails?.customer_phone && (
                  <div className="">
                    <strong>Phone:</strong> {billDetails.customer_phone}
                  </div>
                )}
                {billDetails?.customer_email && (
                  <div className="">
                    <strong>Email:</strong> {billDetails.customer_email}
                  </div>
                )}
              </div>
            </div>
          ) : null}
          {/* Thank You Footer */}
          <div className="border-y  border-dashed border-gray-400 py-4 mt-6 text-center">
            <p className="text-base font-semibold text-gray-700">
              *** Thank you! Visit Again ***
            </p>
            <p className="text-sm text-gray-500 italic">
              We appreciate your business and hope to see you soon.
            </p>
          </div>
        </div>
        <div className="px-6 pb-6 mt-4 flex justify-end flex-wrap space-x-4 space-y-4">
          <Button variant="outline" onClick={() => window.print()} className="">
            <IconPrinter />
            <span className="hidden md:inline">Print Bill</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => setViewPdfModal(true)}
            className="hidden md:flex"
          >
            <IconEye />
            <span className="hidden md:inline">View Bill</span>
          </Button>
          {billDetails && (
            <PDFDownloadLink
              document={<InvoicePDF billDetails={billDetails} />}
              fileName="invoice.pdf"
            >
              {({ loading }) => (
                <Button className="flex items-center gap-2" disabled={loading}>
                  {loading ? (
                    <Loader2Icon className="animate-spin" />
                  ) : (
                    <IconDownload />
                  )}
                  <span className="hidden md:inline">
                    {loading ? "Generating..." : "Download Invoice"}
                  </span>
                </Button>
              )}
            </PDFDownloadLink>
          )}

          {billDetails?.paid ? (
            <Button className="bg-green-200 text-green-800 text-sm font-medium px-3 py-1 rounded-lg pointer-events-none">
              Paid
              <IconCircleCheckFilled />
            </Button>
          ) : (
            <Button
              variant="primarySuccess"
              disabled={isPending}
              onClick={onClickMarkAsPaid}
            >
              Mark as Paid
              <IconCircleCheck />
            </Button>
          )}
        </div>

        <Dialog open={viewPdfModal} onOpenChange={setViewPdfModal}>
          <DialogContent className="min-h-[80%] min-w-[90%] overflow-auto p-10">
            <DialogHeader className="hidden">
              <DialogTitle className="">View Bill</DialogTitle>
            </DialogHeader>
            {billDetails && (
              <PDFViewer height={"100%"} width="100%" showToolbar={false}>
                <InvoicePDF billDetails={billDetails} />
              </PDFViewer>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
