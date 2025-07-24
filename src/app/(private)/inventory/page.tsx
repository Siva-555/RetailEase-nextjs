import { getInventory } from "@/actions/inventory";
import Inventory from "./inventory";

import { IconPackage } from "@tabler/icons-react";

const Page = async () => {
  const { success, inventory: rowdata } = await getInventory();

  return (
    <div className="size-full flex flex-col">
      <header className="bg-white dark:bg-gray-800 md:shadow-sm border-b dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-xl flex flex-row items-center font-bold text-gray-800 dark:text-white">
            <span>
              <IconPackage />
            </span>
            Inventory
          </h1>
        </div>
      </header>
      <section className="size-full flex-1 mt-2">
        <Inventory rowData={success ? rowdata : []} />
      </section>
    </div>
  );
};

export default Page;
