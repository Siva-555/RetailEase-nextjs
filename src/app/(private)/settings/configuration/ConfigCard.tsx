"use client";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useEffect, useState, useTransition } from "react";
import { Loader2Icon } from "lucide-react";

import { ConfigSchema, ConfigSchemaType } from "@/zodSchema/configSchema";
import { saveConfiguration } from "@/actions/configActions";
import { useRouter } from "next/navigation";
import type { configuration as configurationDbType } from "@prisma/client";

export default function ConfigCard({
  data,
}: {
  data: configurationDbType | null;
}) {
  const router = useRouter();

  const [configId, setConfigId] = useState<string | undefined>(
    data?.id || undefined
  );
  const form = useForm<ConfigSchemaType>({
    resolver: zodResolver(ConfigSchema),
    mode: "onChange",
    defaultValues: {
      taxAmount: data?.taxAmount || 5,
      lowStockValue: data?.lowStockValue || 10,
    },
  });

  const [isPending, startTransition] = useTransition();

  // const fetchConfig = async () => {
  //   startTransition(async () => {
  //     try {
  //       const response = await fetch("/api/configuration");
  //       if (!response.ok) {
  //         throw new Error("Failed to fetch configuration");
  //       }
  //       const data = await response.json();
  //       if (data?.success && data?.configuration?.id) {
  //         startTransition(() => {
  //           setConfigId(data.configuration.id);
  //           form.reset({
  //             lowStockValue: data?.configuration?.lowStockValue || 5,
  //             taxAmount: data?.configuration?.taxAmount || 10,
  //           });
  //         });
  //       }
  //     } catch (error) {
  //       console.error("Error fetching configuration:", error);
  //       toast.error("Failed to load configuration", {
  //         description: "Please try again later.",
  //       });
  //     }
  //   });
  // };


  useEffect(() => {
    // fetchConfig();
    if(data?.id){
      setConfigId(data.id);
      form.reset({
        taxAmount: data.taxAmount ?? 5,
        lowStockValue: data.lowStockValue || 10,
      });
    }
  }, [data, form]);

  const onSubmit = (data: ConfigSchemaType) => {
    try {
      const result = ConfigSchema.safeParse(data);

      if (!result.success) {
        toast.error("Validation failed.");
        return;
      }

      const validatedData = result.data;
      startTransition(async () => {
        const result = await saveConfiguration(validatedData, configId);
        if (result.success) {
          // form.reset();
          // startTransition(() => {
          //   console.log("test - configId", result);
          // });
          router.refresh();
          // fetchConfig();
          toast.success("configuration saved successfully");
        } else {
          toast.error("Failed to save configuration. Please try again.", {
            duration: 10000,
          });
        }
      });
    } catch (error) {
      console.error("Error in onSubmit:", error);
    }
  };

  return (
    <Card className="max-w-xl mx-auto">
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Tax Amount */}
            <FormField
              control={form.control}
              name="taxAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="gap-1">
                    Tax Percentage (%)<span className="text-red-500">*</span>
                  </FormLabel>
                  <p className="text-sm text-muted-foreground mb-2">
                    Tax percentage applied to the total bill amount.
                  </p>
                  <FormControl>
                    <Input type="number" max={70} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lowStockValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="gap-1">
                    Low Stock Threshold<span className="text-red-500">*</span>
                  </FormLabel>
                  <p className="text-sm text-muted-foreground mb-2">
                    Minimum quantity of product to consider as low stock.
                  </p>
                  <FormControl>
                    <Input type="number" max={10000} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isPending ? true : !form.formState.isDirty}
              className="shadow-xl w-full"
            >
              {isPending ? (
                <Loader2Icon className="animate-spin" />
              ) : (
                "Save Configuration"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
