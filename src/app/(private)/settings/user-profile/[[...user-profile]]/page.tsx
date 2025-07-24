import Loader from "@/components/common/loader";
import { UserProfile } from "@clerk/nextjs";

const UserProfilePage = () => {
  return (
    <div className="flex items-center justify-center pt-4 pb-8 size-full">
      <UserProfile path="/settings/user-profile" fallback={<Loader />} />
    </div>
  );
};

export default UserProfilePage;
