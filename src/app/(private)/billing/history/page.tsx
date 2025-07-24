import BillHistoryGrid from "./BillHistoryGrid";
import { getAllBillDetails } from "@/actions/BillActions";
import BillStats from "@/components/BillStats";
import { Button } from "@/components/ui/button";
import { FileClock, LucidePlus } from "lucide-react";
import Link from "next/link";

export default async function History() {
  const { success, data: rowdata } = await getAllBillDetails();

  return (
    <div className="size-full flex flex-col">
      {/* <header className="flex flex-row items-center">
        <span><IconHistory size={20} /></span>
        <h1 className="text-xl font-semibold  ml-1">Bills History</h1>
      </header> */}
      <header className="bg-white dark:bg-gray-800 md:shadow-sm rounded-lg mb-4 border-b dark:border-gray-700">
        <div className="container mx-auto flex flex-row justify-between items-center px-4 py-4">
          <h1 className="text-xl flex flex-row items-center font-bold text-gray-800 dark:text-white">
            <span>
              <FileClock size={20} />
            </span>
            <span className="ml-1">Bill History</span>
          </h1>
          <Link href="/billing">
            <Button>
              <LucidePlus className="h-5 w-5" />
              New Bill
            </Button>
          </Link>
        </div>
      </header>
      <div className="pt-2">
        <BillStats />
      </div>
      <section className="size-full flex-1">
        <BillHistoryGrid rowData={success ? rowdata : []} />
      </section>
    </div>
  );
}
