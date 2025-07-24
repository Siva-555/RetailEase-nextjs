import Loader from "@/components/common/loader";
import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex flex-row justify-center items-center size-full">
      <SignIn fallback={<Loader />}/>
    </div>
  );
}
