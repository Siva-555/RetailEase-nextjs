import Loader from "@/components/common/loader";
import { SignIn } from "@clerk/nextjs";
import DummyDetails from "../../DummyDetails";

export default function Page() {

  return (
    <div className="flex flex-col justify-center items-center size-full">
      <SignIn fallback={<Loader />} />

      {/* dummy login details */}
      <DummyDetails />
    </div>
  );
}
