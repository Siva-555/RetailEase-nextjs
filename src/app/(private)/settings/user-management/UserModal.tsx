"use client";
import { useTransition } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Loader2Icon } from "lucide-react";
import {
  createUserSchema,
  editUserSchema,
  CreateUserInput,
  EditUserInput,
} from "@/zodSchema/userSchema";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import { User } from "@/types";

type ProductModalProps = {
  className: string;
  onSuccess: () => void;
  edit?: boolean | undefined;
  editData?: User;
};

const UserModal = ({
  className,
  edit,
  editData,
  onSuccess,
}: ProductModalProps) => {
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<CreateUserInput | EditUserInput>({
    resolver: zodResolver(edit ? editUserSchema : createUserSchema),
    mode: "onChange",
    defaultValues: edit
      ? { role: editData?.role }
      : { email: "", password: "", role: undefined },
  });

  const onSubmit = (data: CreateUserInput | EditUserInput) => {
    if (edit) {
      console.log("test on submit", data)
      if (editData?.id) {
        startTransition(async () => {
          try {
            const payload = { id: editData.id, role: data.role };
            const res = await fetch("/api/users/update-role", {
              method: "PATCH",
              body: JSON.stringify(payload),
            });

            const result = await res.json();

            if (res.ok) {
              toast.success("Updated successfully");
              form.reset();
              onSuccess();
            } else {
              toast.error("Creation failed");
              if (result?.error) {
                setError(String(result?.error));
              }
            }
          } catch (error) {
            console.log(error);
            toast.error("Something went wrong while updateing.");
            setError(String(error));
          }
        });
      } else {
        toast.error("Something went wrong, Please try again..", {
          duration: 10000,
        });
      }
    } else {
      startTransition(async () => {
        try {
          const payload = data as CreateUserInput;
          const res = await fetch("/api/users/create-user", {
            method: "POST",
            body: JSON.stringify(payload),
          });

          const result = await res.json();

          if (res.ok) {
            toast.success("User created successfully");
            form.reset();
            onSuccess();
          } else {
            toast.error("Creation failed");
            if (result?.error) {
              setError(String(result?.error));
            }
          }
        } catch (error) {
          console.log(error);
          toast.error("Something went wrong while creating.");
          setError(String(error));
        }
      });
    }
  };
  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn("space-y-4 flex flex-col gap-1  max-w-md", className)}
        >
          {!edit ? (
            <>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="gap-1">
                      Email<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="eg: user@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="gap-1">
                      Password<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          className="pr-9"
                          type={showPassword ? "text" : "password"}
                          placeholder="eg: strongPassword123"
                          {...field}
                        />
                        <button
                          type="button"
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                          onClick={() => setShowPassword((prev) => !prev)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          ) : null}

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="gap-1">
                  Role<span className="text-red-500">*</span>
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="moderator">Moderator</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center">
            {error && (
              <p className="text-red-500 text-sm text-center break-words max-w-xs">
                {error}
              </p>
            )}
          </div>
          <div className="flex flex-row gap-2 ">
            <Button
              type="submit"
              disabled={
                isPending ? true : edit ? !form.formState.isDirty : false
              }
              className=" flex-4/5"
            >
              {isPending ? <Loader2Icon className="animate-spin" /> : "Submit"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default UserModal;
