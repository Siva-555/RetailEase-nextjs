"use client";

import { useState, useEffect, useTransition } from "react";
import {
  Plus,
  Minus,
  ShoppingCart,
  Trash2,
  Loader2Icon,
  FileClock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

import type { Inventory as InventoryType } from "@prisma/client";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

interface CustomerInfo {
  name: string;
  phone: string;
  email: string;
}

// type ProductType = Omit<
//   InventoryType,
//   | "sold_quantity"
//   | "deleted"
//   | "modified_by"
//   | "modified_date"
//   | "available_quantity"
// > & { quantity: number; total: number };

interface BillItem {
  product: InventoryType;
  quantity: number;
  total: number;
}

export default function BillingPage() {
  const router = useRouter();
  const { user } = useUser();
  const userMetadata = user?.publicMetadata as
    | {
        store_id?: string;
        store_name?: string;
        store_address?: string;
        pincode?: string;
        mobile_no?: string;
        gst_no?: string;
        fssai_no?: string;
        [key: string]: unknown;
      }
    | undefined;
  const [products, setProducts] = useState<InventoryType[]>([]);
  const [billItems, setBillItems] = useState<BillItem[]>([]);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: "",
    phone: "",
    email: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [tax, setTax] = useState(5);

  const [isPending, startTransition] = useTransition();
  const [isPendingProducts, startTransitionProducts] = useTransition();
  const [isPendingConfig, startTransitionConfig] = useTransition();

  useEffect(() => {
    fetchProducts();
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    startTransitionConfig(async () => {
      try {
        const response = await fetch("/api/configuration");
        if (!response.ok) {
          throw new Error("Failed to fetch configuration");
        }
        const data = await response.json();
        if (data?.success && data?.configuration?.id) {
          startTransitionConfig(() => {
            setTax(data?.configuration?.taxAmount ?? 5);
          });
        }
      } catch (error) {
        console.error("Error fetching configuration:", error);
        toast.error("Failed to load configuration", {
          description: "Please try again later.",
        });
      }
    });
  };

  const fetchProducts = async () => {
    startTransitionProducts(async () => {
      try {
        const response = await fetch("/api/products");
        const data = await response.json();
        // console.log("test api", response, data);
        startTransitionProducts(() => {
          setProducts(
            data.filter((p: InventoryType) => p.available_quantity > 0)
          );
        });
      } catch (error) {
        console.log("Error fetching products:", error);
        toast.error("Failed to fetch products", { duration: 10000 });
      }
    });
  };

  const addToBill = (product: InventoryType) => {
    const existingItem = billItems.find(
      (item) => item.product.id === product.id
    );

    if (existingItem) {
      if (existingItem.quantity < product.available_quantity) {
        setBillItems((prev) =>
          prev.map((item) =>
            item.product.id === product.id
              ? {
                  ...item,
                  quantity: item.quantity + 1,
                  total: (item.quantity + 1) * product.sell_price,
                }
              : item
          )
        );
      } else {
        toast.error("Stock Limit", {
          description: "Cannot add more items than available in stock",
          duration: 10000,
        });
      }
    } else {
      setBillItems((prev) => [
        ...prev,
        {
          product,
          quantity: 1,
          total: product.sell_price,
        },
      ]);
    }
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      setBillItems(billItems.filter((item) => item.product.id !== productId));
    } else {
      setBillItems((prev) =>
        prev.map((item) =>
          item.product.id === productId
            ? {
                ...item,
                quantity: newQuantity,
                total: newQuantity * item.product.sell_price,
              }
            : item
        )
      );
    }
  };

  const calculateTotal = () => {
    const total = billItems.reduce((sum, item) => sum + item.total, 0);
    return parseFloat(total.toFixed(2));
  };

  const generateBill = async () => {
    if (billItems.length === 0) {
      toast.error("Error", {
        description: "Please add items to the bill",
        duration: 10000,
      });
      return;
    }

    const sub_total = calculateTotal();

    const billData = {
      customer_name: customerInfo.name || "Walk-in Customer",
      customer_phone: customerInfo.phone || "",
      customer_email: customerInfo.email || "",
      items: billItems.map((item) => ({
        product_id: item.product.id,
        product_code: item.product.product_code,
        product_name: item.product.product_name,
        product_units: item.product.product_units,
        mrp: item.product.mrp,
        sell_price: item.product.sell_price,

        quantity: item.quantity,
        total: item.total,
      })),
      subtotal: sub_total,
      tax: parseFloat((sub_total * (tax / 100)).toFixed(2)),
      total: parseFloat((sub_total * (1 + tax / 100)).toFixed(2)),
      tax_percentage: tax,

      store_id: userMetadata?.store_id || "",
      store_name: userMetadata?.store_name || "",
      store_address: userMetadata?.store_address || "",
      pincode: userMetadata?.pincode || "",
      mobile_no: userMetadata?.mobile_no || "",
      gst_no: userMetadata?.gst_no || "",
      fssai_no: userMetadata?.fssai_no || "",
    };

    startTransition(async () => {
      try {
        const response = await fetch("/api/bills", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(billData),
        });

        console.log("test response", response);
        const data = await response.json();
        if (response.ok && data.data.bill_no) {
          toast.success("Bill generated successfully");

          router.replace(`/billing/view-bill/${data.data.bill_no}`);

          // Reset form
          // setBillItems([]);
          // setCustomerInfo({ name: "", phone: "", email: "" });
        } else {
          if(data?.type === "LIMIT_REACHED"){
            toast.error("Bill limit reached. ",{duration: 10000});
            return;
          }
          console.error("Error generating bill 1:", data);
          toast.error("Error", {
            description: "Failed to generate bill",
            duration: 10000,
          });
        }
      } catch (error) {
        console.error("Error generating bill 2 :", error);
        toast.error("Error", {
          description: "Failed to generate bill",
          duration: 10000,
        });
      }
    });
  };

  const filteredProducts = products.filter((product) =>
    product.product_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 pt-3 pb-8">
      <header className="bg-white dark:bg-gray-800 md:shadow-sm rounded-lg mb-4 border-b dark:border-gray-700">
        <div className="container mx-auto flex flex-row justify-between items-center px-4 py-4">
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">
            Generate Bill
          </h1>
          <Link href="/billing/history">
            <Button>
              History
              <FileClock className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </header>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Product Selection */}
        <div>
          <Card className="mb-6 shadow-lg">
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className=" grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="customerName">Name</Label>
                <Input
                  id="customerName"
                  value={customerInfo.name}
                  maxLength={50}
                  onChange={(e) =>
                    setCustomerInfo((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  placeholder="Enter customer name"
                />
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="customerPhone">Phone Number</Label>
                <Input
                  type="tel"
                  id="customerPhone"
                  value={customerInfo.phone}
                  maxLength={13}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "" || /^(\+)?[\d\s-]*$/.test(value)) {
                      setCustomerInfo((prev) => ({ ...prev, phone: value }));
                    }
                  }}
                  placeholder="Enter phone number"
                />
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="customerEmail">Email</Label>
                <Input
                  maxLength={50}
                  id="customerEmail"
                  type="email"
                  value={customerInfo.email}
                  onChange={(e) =>
                    setCustomerInfo((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  placeholder="Enter email address"
                />
              </div>
            </CardContent>
          </Card>

          {/* Product Search and Selection */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Select Products</CardTitle>
            </CardHeader>
            <CardContent className="px-3 md:px-6">
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-4"
              />

              {!isPendingProducts ? (
                <div className="space-y-2 h-96 overflow-y-auto text-sm">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product, index) => (
                      <button
                        disabled={product.available_quantity === 0}
                        key={`product-item-${index}-${product.id}`}
                        className="disabled:opacity-50 disabled:pointer-events-none flex items-center justify-between py-3 px-3 group hover:border-blue-500 border-2 rounded-lg focus:border-blue-500 transition-colors focus:text-blue-800 w-full"
                        // onClick={() => alert(`Clicked: ${product.product_name}`)}
                        onClick={() => addToBill(product)}
                      >
                        <div className="flex flex-col justigy-start items-start space-x-4">
                          <h4 className="font-medium group-hover:text-blue-800 focus-within:text-blue-800 line-clamp-2 text-left">
                            {product.product_name}
                          </h4>
                          <div className="flex flex-col items-start space-y-2 text-sm space-x-2 group-hover:text-blue-800 focus-within:text-blue-800">
                            <span className="text-stone-900">
                              Stock:
                              <span
                                className={cn(
                                  "ml-1 font-semibold",
                                  product.available_quantity === 0
                                    ? "text-gray-500"
                                    : product.available_quantity < 50
                                    ? "text-red-600"
                                    : product.available_quantity < 100
                                    ? "text-amber-600"
                                    : "text-green-800"
                                )}
                              >
                                {product.available_quantity === 0
                                  ? "Out of Stock"
                                  : product.available_quantity}
                              </span>
                            </span>

                            <div className="flex items-baseline space-x-2">
                              <span className="text-green-800">
                                ₹{product.sell_price.toFixed(2)}
                              </span>
                              <span className="line-through text-gray-500 text-xs">
                                ₹{product.mrp.toFixed(2)}
                              </span>
                              <span className="text-green-600 text-xs font-medium">
                                (
                                {Math.round(
                                  ((product.mrp - product.sell_price) /
                                    product.mrp) *
                                    100
                                )}
                                % OFF)
                              </span>
                            </div>
                          </div>
                        </div>
                        <span className="primary-button h-8 w-8 rounded-sm flex items-center justify-center">
                          <Plus className="h-4 w-4" />
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className=" flex justify-center my-auto ">
                      {" "}
                      No Products{" "}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  <span className="loader"></span>
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Bill Summary */}
        <div className="relative overflow-x-auto">
          <div className="sticky  self-start h-fit">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center sticky top-0">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Bill Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                {billItems.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No items added to bill
                  </p>
                ) : (
                  <>
                    {/* Store Details */}
                    <div className="text-[14px] text-black  mb-6 border border-gray-300 rounded-md p-4 print:border-none print:p-0 print:mb-2">
                      {userMetadata?.store_name && (
                        <div className="text-center text-lg font-bold mb-4">
                          {userMetadata.store_name}
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-y-2 text-sm">
                        {userMetadata?.store_address && (
                          <div className="text-left">
                            <span className="font-semibold">Address:</span>{" "}
                            {userMetadata.store_address}
                          </div>
                        )}
                        {userMetadata?.mobile_no && (
                          <div className="text-right">
                            <span className="font-semibold">Mobile:</span>{" "}
                            {userMetadata.mobile_no}
                          </div>
                        )}
                        {userMetadata?.pincode && (
                          <div className="text-left">
                            <span className="font-semibold">Pincode:</span>{" "}
                            {userMetadata.pincode}
                          </div>
                        )}
                        {userMetadata?.fssai_no && (
                          <div className="text-right">
                            <span className="font-semibold">FSSAI:</span>{" "}
                            {userMetadata.fssai_no}
                          </div>
                        )}
                        {userMetadata?.gst_no && (
                          <div className="text-left">
                            <span className="font-semibold">GST:</span>{" "}
                            {userMetadata.gst_no}
                          </div>
                        )}
                      </div>
                    </div>

                    <Table tableClassName="max-h-[300px] overflow-y-auto">
                      <TableHeader className="sticky top-0  z-10">
                        <TableRow>
                          <TableHead>Code</TableHead>
                          <TableHead>Item</TableHead>
                          <TableHead>Qty</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {billItems.map((item) => (
                          <TableRow key={item.product.id}>
                            <TableCell>{item.product.product_code}</TableCell>
                            <TableCell>{item.product.product_name}</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  title="Decrease Quantity"
                                  onClick={() =>
                                    updateQuantity(
                                      item.product.id,
                                      item.quantity - 1
                                    )
                                  }
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span>{item.quantity}</span>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  title="Increase Quantity"
                                  onClick={() =>
                                    updateQuantity(
                                      item.product.id,
                                      item.quantity + 1
                                    )
                                  }
                                  disabled={
                                    item.quantity >=
                                    item.product.available_quantity
                                  }
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell>₹{item.total.toFixed(2)}</TableCell>
                            <TableCell>₹{item.total.toFixed(2)}</TableCell>
                            <TableCell className="text-right">
                              <Button
                                size="sm"
                                variant="outlineDestructive"
                                title="Remove Item"
                                onClick={() =>
                                  updateQuantity(item.product.id, 0)
                                }
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}

                        <TableRow className="font-semibold ">
                          <TableCell colSpan={2}>
                            Total Items: {billItems.length}
                          </TableCell>
                          <TableCell>
                            Total Qty:{" "}
                            {billItems?.reduce(
                              (acc, item) => acc + Number(item.quantity),
                              0
                            )}
                          </TableCell>
                          <TableCell />
                          <TableCell />
                          <TableCell />
                        </TableRow>
                      </TableBody>
                    </Table>

                    <div className="mt-6 space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>₹{calculateTotal().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax ({`${tax}%`}):</span>
                        <span>
                          ₹{(calculateTotal() * (tax / 100)).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total:</span>
                        <span>
                          ₹{(calculateTotal() * (1 + tax / 100)).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <Button
                      className="w-full mt-6"
                      onClick={generateBill}
                      disabled={
                        isPending || isPendingConfig || isPendingProducts
                      }
                    >
                      {isPending ? (
                        <Loader2Icon className="animate-spin" />
                      ) : (
                        "Generate Bill"
                      )}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
