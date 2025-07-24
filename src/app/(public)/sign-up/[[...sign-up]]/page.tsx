import Loader from "@/components/common/loader";
import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex flex-row justify-center items-center size-full">
      <SignUp fallback={<Loader />} />
    </div>
  );
  }
