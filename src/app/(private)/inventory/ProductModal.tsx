"use client";

import { useTransition } from "react";

import type { Inventory as InventoryType } from "@prisma/client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { inventorySchema, InventoryInput } from "@/zodSchema/inventorySchema";
import {
  createInventory,
  deleteProduct,
  updateInventory,
} from "@/actions/inventory";
import { cn } from "@/lib/utils";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";

type ProductModalProps = {
  className: string;
  onSuccess: () => void;
  edit?: boolean | undefined;
  rowData?: InventoryType | undefined;
};

export default function ProductModal({
  className,
  edit,
  rowData,
  onSuccess,
}: ProductModalProps) {
  const [isPending, startTransition] = useTransition();
  const [isDeletePending, startDeleteTransition] = useTransition();
  const router = useRouter();

  const form = useForm<InventoryInput>({
    resolver: zodResolver(inventorySchema),
    mode: "onChange",
    defaultValues:
      edit && rowData
        ? {
            product_name: rowData?.product_name,
            product_units: rowData?.product_units,
            mrp: rowData?.mrp,
            sell_price: rowData?.sell_price,
            available_quantity: rowData?.available_quantity,
          }
        : {
            product_name: "",
            product_units: undefined,
            mrp: 0,
            sell_price: 0,
            available_quantity: 0,
          },
  });

  const onSubmit = (data: InventoryInput) => {
    try {
      const result = inventorySchema.safeParse(data);

      if (!result.success) {
        toast.error("Validation failed.");
        return;
      }

      if (edit) {
        if (rowData?.id) {
          const validatedData = result.data;
          const dirtyFields = form.formState.dirtyFields;
          // only dirty feilds
          const updatedFields: Partial<InventoryInput> = Object.fromEntries(
            Object.entries(validatedData).filter(
              ([key]) => dirtyFields[key as keyof InventoryInput]
            )
          );

          startTransition(async () => {
            const result = await updateInventory(rowData.id, updatedFields);
            if (result.success) {
              form.reset();
              startTransition(() => {
                router.refresh();
              });
              toast.success("Product is updated successfully");
              onSuccess();
            } else {
              toast.error("Failed to update the product. Please try again.", {
                duration: 10000,
              });
            }
          });
        } else {
          toast.error("Something went wrong, Please try again..", {
            duration: 10000,
          });
        }
      } else {
        startTransition(async () => {
          const result = await createInventory(data);
          if (result.success) {
            form.reset();
            startTransition(() => {
              router.refresh();
            });
            toast.success("Product is added successfully");
            onSuccess();
          } else {
            toast.error("Failed to add the product. Please try again.", {
              duration: 10000,
            });
          }
        });
      }
    } catch (error) {
      console.error("Error in onSubmit:", error);
    }
  };

  const onDeleteHandler = () => {
    try {
      if (rowData?.id) {
        startDeleteTransition(async () => {
          const result = await deleteProduct(rowData.id);
          if (result.success) {
            form.reset();
            startDeleteTransition(() => {
              router.refresh();
            });
            toast.success("Product is deleted successfully");
            onSuccess();
          } else {
            toast.error("Failed to delete the product. Please try again.", {
              duration: 10000,
            });
          }
        });
      } else {
        toast.error("Something went wrong, Please try again..", {
          duration: 10000,
        });
      }
    } catch (error) {
      console.error("Error in onSubmit:", error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("space-y-4 flex flex-col gap-1  max-w-md", className)}
      >
        <FormField
          control={form.control}
          name="product_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="gap-1">
                Product Name<span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Product Name..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="product_units"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="gap-1">
                Product Units<span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex space-x-4"
                >
                  <FormItem className="flex items-center space-x-2">
                    <RadioGroupItem value="QTY" id="qty" />
                    <FormLabel
                      htmlFor="qty"
                      className="cursor-pointer font-[400]"
                    >
                      QTY
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2">
                    <RadioGroupItem value="KG" id="kg" />
                    <FormLabel
                      htmlFor="kg"
                      className="cursor-pointer font-[400]"
                    >
                      KG
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="mrp"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="gap-1">
                MRP <span className="font-light">(₹)</span>
                <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input type="number" min={0} placeholder="MRP" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sell_price"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="gap-1">
                Sell Price <span className="font-light">(₹)</span>
                <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input type="number" placeholder="Sell Price" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="available_quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="gap-1">
                Available Qty/Kg<span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Available Quantity"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-row gap-2 ">
          {edit ? (
            <Button
              type="button"
              disabled={isPending || isDeletePending}
              onClick={onDeleteHandler}
              className="flex-1/5"
              variant="outlineDestructive"
            >
              {isDeletePending ? (
                <Loader2Icon className="animate-spin" />
              ) : (
                "Delete"
              )}
            </Button>
          ) : null}
          <Button
            type="submit"
            disabled={
              isPending || isDeletePending
                ? true
                : edit
                ? !form.formState.isDirty
                : false
            }
            className=" flex-4/5"
          >
            {isPending ? <Loader2Icon className="animate-spin" /> : "Submit"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
