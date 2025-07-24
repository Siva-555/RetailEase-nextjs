"use client";

import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import Loader from "@/components/common/loader";
import UserModal from "./UserModal";
import { Loader2Icon, LucidePlus, Trash2 } from "lucide-react";
import { IconEdit } from "@tabler/icons-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { User } from "@/types";

export default function AdminUserPage() {
  const { user: adminuser } = useUser();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setloading] = useState<boolean>(true);
  const [userModal, setUserModal] = useState<boolean>(false);
  const [editUserModal, setEditUserModal] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [isPending, startTransition] = useTransition();

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      setUsers(data || []);
    } catch (err) {
      console.log("error", err);
    } finally {
      setloading(false);
    }
  };

  const deleteUser = async (id: string) => {
    startTransition(async () => {
      try {
        const res = await fetch(`/api/users/delete-user`, {
          method: "POST",
          body: JSON.stringify({ id }),
        });
        if (res.ok) {
          toast.success("User deleted successfully.");
          startTransition(() => {
            setSelectedUser(null);
            setOpenDialog(false);
          });
          fetchUsers();
        } else {
          toast.error("Failed to deleted, Please try again");
        }
      } catch (err) {
        console.log("error - ", err);
        toast.error("Something went wrong.");
      }
    });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <Loader />;

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className=" font-semibold mb-4 flex justify-between">
        User Management{" "}
        <Button
          onClick={() => setUserModal(true)}
          className="shadow-2xl "
          size={"sm"}
          disabled={users.length > 5}
          title={
            users.length > 5
              ? "This feature is restricted to prevent misuse"
              : ""
          }
        >
          <LucidePlus />
          <span className="hidden md:inline">Create User</span>
          {/* <span className="inline md:hidden">Create</span> */}
        </Button>
      </CardHeader>
      <CardContent>
        <Table tableClassName="">
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.email}</TableCell>
                <TableCell className="capitalize">{user.role}</TableCell>
                <TableCell className="gap-2 flex">
                  <Button
                    size="sm"
                    variant="outline"
                    title="Edit user"
                    className="shadow-2xl"
                    disabled={
                      adminuser?.primaryEmailAddress?.emailAddress ===
                      user.email
                    }
                    onClick={() => {
                      setSelectedUser(user);
                      setUserModal(true);
                      setEditUserModal(true);
                    }}
                  >
                    <IconEdit className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outlineDestructive"
                    className="hover:bg-destructive/70 hover:text-white shadow-2xl"
                    title="Delete user"
                    disabled={
                      adminuser?.primaryEmailAddress?.emailAddress ===
                      user.email
                    }
                    onClick={() => {
                      setSelectedUser(user);
                      setOpenDialog(true);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <AlertDialog
          open={openDialog}
          onOpenChange={(bool) => {
            setSelectedUser(null);
            setOpenDialog(bool);
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete{" "}
                <b>{selectedUser?.email || "this user"}</b>. This action cannot
                be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                disabled={isPending}
                className="bg-destructive text-white hover:bg-destructive/80"
                onClick={() => {
                  if (selectedUser) {
                    deleteUser(selectedUser.id);
                  }
                }}
              >
                {isPending ? (
                  <Loader2Icon className="animate-spin" />
                ) : (
                  "Confirm Delete"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Dialog
          open={userModal}
          onOpenChange={(bool) => {
            setUserModal(bool);
            setEditUserModal(false);
            setSelectedUser(null);
          }}
        >
          <DialogContent className="max-h-lvh overflow-auto">
            <DialogHeader>
              <DialogTitle className="">
                {editUserModal ? "Update user" : "Create User"}
              </DialogTitle>
            </DialogHeader>
            <UserModal
              className="mt-1"
              edit={editUserModal}
              editData={selectedUser || undefined}
              onSuccess={() => {
                fetchUsers();
                setUserModal(false);
                setEditUserModal(false);
                setSelectedUser(null);
              }}
            />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
  // return (
  //   <div className="p-6 max-w-4xl mx-auto">
  //     <h2 className="text-xl font-semibold mb-4 flex justify-between">
  //       User Management{" "}
  //       <Button
  //         onClick={() => setUserModal(true)}
  //         className="shadow-2xl "
  //         disabled={users.length > 5}
  //         title={
  //           users.length > 5 ? "This feature is restricted to prevent misuse" : ""
  //         }
  //       >
  //         Create User
  //       </Button>
  //     </h2>

  //     <Table tableClassName="shadow-[0px_2px_6px_3px_#0000001a] p-5 rounded-2xl">
  //       <TableHeader>
  //         <TableRow>
  //           <TableHead>Email</TableHead>
  //           <TableHead>Role</TableHead>
  //           <TableHead>Action</TableHead>
  //         </TableRow>
  //       </TableHeader>
  //       <TableBody>
  //         {users.map((user) => (
  //           <TableRow key={user.id}>
  //             <TableCell>{user.email}</TableCell>
  //             <TableCell className="capitalize">{user.role}</TableCell>
  //             <TableCell className="gap-2 flex">
  //               <Button
  //                 size="sm"
  //                 variant="outline"
  //                 title="Edit user"
  //                 className="shadow-2xl"
  //                 disabled={
  //                   adminuser?.primaryEmailAddress?.emailAddress === user.email
  //                 }
  //                 onClick={() => {
  //                   setSelectedUser(user);
  //                   setUserModal(true);
  //                   setEditUserModal(true);
  //                 }}
  //               >
  //                 <IconEdit className="h-3 w-3" />
  //               </Button>
  //               <Button
  //                 size="sm"
  //                 variant="outlineDestructive"
  //                 className="hover:bg-destructive/70 hover:text-white shadow-2xl"
  //                 title="Delete user"
  //                 disabled={
  //                   adminuser?.primaryEmailAddress?.emailAddress === user.email
  //                 }
  //                 onClick={() => {
  //                   setSelectedUser(user);
  //                   setOpenDialog(true);
  //                 }}
  //               >
  //                 <Trash2 className="h-3 w-3" />
  //               </Button>
  //             </TableCell>
  //           </TableRow>
  //         ))}
  //       </TableBody>
  //     </Table>

  //     <AlertDialog
  //       open={openDialog}
  //       onOpenChange={(bool) => {
  //         setSelectedUser(null);
  //         setOpenDialog(bool);
  //       }}
  //     >
  //       <AlertDialogContent>
  //         <AlertDialogHeader>
  //           <AlertDialogTitle>Are you sure?</AlertDialogTitle>
  //           <AlertDialogDescription>
  //             This will permanently delete{" "}
  //             <b>{selectedUser?.email || "this user"}</b>. This action cannot be
  //             undone.
  //           </AlertDialogDescription>
  //         </AlertDialogHeader>
  //         <AlertDialogFooter>
  //           <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
  //           <AlertDialogAction
  //             disabled={isPending}
  //             className="bg-destructive text-white hover:bg-destructive/80"
  //             onClick={() => {
  //               if (selectedUser) {
  //                 deleteUser(selectedUser.id);
  //               }
  //             }}
  //           >
  //             {isPending ? (
  //               <Loader2Icon className="animate-spin" />
  //             ) : (
  //               "Confirm Delete"
  //             )}
  //           </AlertDialogAction>
  //         </AlertDialogFooter>
  //       </AlertDialogContent>
  //     </AlertDialog>

  //     <Dialog
  //       open={userModal}
  //       onOpenChange={(bool) => {
  //         setUserModal(bool);
  //         setEditUserModal(false);
  //         setSelectedUser(null);
  //       }}
  //     >
  //       <DialogContent className="max-h-lvh overflow-auto">
  //         <DialogHeader>
  //           <DialogTitle className="">
  //             {editUserModal ? "Update user" : "Create User"}
  //           </DialogTitle>
  //         </DialogHeader>
  //         <UserModal
  //           className="mt-1"
  //           edit={editUserModal}
  //           editData={selectedUser || undefined}
  //           onSuccess={() => {
  //             fetchUsers();
  //             setUserModal(false);
  //             setEditUserModal(false);
  //             setSelectedUser(null);
  //           }}
  //         />
  //       </DialogContent>
  //     </Dialog>
  //   </div>
  // );
}
