"use client";

import * as React from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  onboardingSchema,
  OnboardingInput,
} from "@/zodSchema/onboardingSchema";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";

import { completeOnboarding } from "./_actions";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";
// import Link from "next/link";
import { IconBuildingStore } from "@tabler/icons-react";

export default function OnboardingComponent() {
  const { user } = useUser();
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();
  const [showDialog, setShowDialog] = React.useState(false);
  const [isEdit, setIsEdit] = React.useState(false);
  const [formData, setFormData] = React.useState<OnboardingInput | null>(null);

  const form = useForm<OnboardingInput>({
    resolver: zodResolver(onboardingSchema),
    mode: "onChange",
    defaultValues: {
      store_name: "",
      store_address: "",
      pincode: "",
      mobile_no: "",
      gst_no: "",
      fssai_no: "",
    },
  });

  React.useEffect(() => {
    if (user && user.publicMetadata) {
      const meta = user.publicMetadata;

      if (meta.onboardingComplete) {
        setIsEdit(true);
      }

      form.reset({
        store_name: (meta.store_name as string) || "",
        store_address: (meta.store_address as string) || "",
        pincode: (meta.pincode as string) || "",
        mobile_no: (meta.mobile_no as string) || "",
        gst_no: (meta.gst_no as string) || "",
        fssai_no: (meta.fssai_no as string) || "",
      });
    }
  }, [user]);

  const onSubmit = async (data: OnboardingInput) => {
    if (isEdit) {
      setFormData(data); // Save data to submit after confirmation
      setShowDialog(true); // Open confirmation dialog
    } else {
      handleSubmitData(data); // Directly submit if not editing
    }
  };

  const handleSubmitData = async (data: OnboardingInput) => {
    try {
      startTransition(async () => {
        const res = await completeOnboarding({ ...data });

        if (res?.status === "success") {
          toast.success("Store details updated successfully!");
          await user?.reload();
          router.push("/");
          form.reset();
        } else if (res?.status === "error") {
          toast.error(res.message || "Failed to complete onboarding.");
        }
      });
    } catch (error) {
      console.error("Error in onSubmit:", error);
    }
  };

  return (
    <div className=" mt-10 space-y-6 px-4">
      <h1 className="text-2xl font-bold flex justify-center items-center">
        <IconBuildingStore className="mr-2" />
        Store Onboarding
      </h1>

      <div className="flex flex-col items-center justify-center mb-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 max-w-xl max-auto w-full"
          >
            {user?.publicMetadata.store_id ? (
              <FormItem>
                <FormLabel className="gap-1">Store id</FormLabel>
                <FormControl>
                  <Input
                    value={
                      typeof user?.publicMetadata?.store_id === "string"
                        ? user.publicMetadata.store_id
                        : ""
                    }
                    disabled
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            ) : null}

            <FormField
              control={form.control}
              name="store_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="gap-1">
                    Store Name<span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="E.g., Krishna Ration Store"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="store_address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="gap-1">
                    Store Address<span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="E.g., 123 Main Street, Chennai"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pincode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="gap-1">
                    Pincode<span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="E.g., 600001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mobile_no"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="gap-1">
                    Mobile Number<span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="E.g., 9876543210" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gst_no"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="gap-1 flex items-baseline">
                    GST Number{" "}
                    <span className="text-gray-700 font-[400] text-xs ">
                      (Optional)
                    </span>{" "}
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="E.g., 27AAHFG1234M1Z9" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fssai_no"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="gap-1 flex items-baseline">
                    FSSAI Number{" "}
                    <span className="text-gray-700 font-[400] text-xs ">
                      (Optional)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="E.g., 12234567890123" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-row gap-2 justify-end">
              {/* {isPending ? (
                <Button variant="outline" disabled className="shadow-xl">
                  <Link href="/">Cancel</Link>
                </Button>
              ) : (
                <Button asChild variant="outline" className="shadow-xl">
                  <Link href="/">Cancel</Link>
                </Button>
              )} */}

              <Button
                type="submit"
                disabled={isPending ? true : !form.formState.isDirty}
                className="shadow-xl"
              >
                {isPending ? (
                  <Loader2Icon className="animate-spin" />
                ) : (
                  "Submit"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>

      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Update</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to update your store details?
              <br /> This will
              <strong> overwrite </strong> your previous data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (formData) handleSubmitData(formData);
              }}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
