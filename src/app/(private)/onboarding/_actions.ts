"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import {
  OnboardingInput,
  onboardingSchema,
} from "@/zodSchema/onboardingSchema";
import { getShortRandomId } from "@/lib/server/getRandomUUID";

export const completeOnboarding = async (input: OnboardingInput) => {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { message: "No Logged In User", status: "error" };
    }

    const parsed = onboardingSchema.safeParse(input);
    if (!parsed.success) {
      return { message: "Invalid input", status: "error" };
    }

    const client = await clerkClient();

    const currentUser = await client.users.getUser(userId);

    let store_id = currentUser.publicMetadata?.store_id as string | undefined;

    // If store_id doesn't exist, generate a new one
    if (!store_id) {
      store_id = `STORE-${getShortRandomId(7)}`;
    }

    const publicMetadata = {
      onboardingComplete: true,
      store_id,
      store_name: parsed.data.store_name,
      store_address: parsed.data.store_address,
      pincode: parsed.data.pincode,
      mobile_no: parsed.data.mobile_no,
      gst_no: parsed.data.gst_no || "",
      fssai_no: parsed.data.fssai_no || "",
      // role: "admin",
    };

    const res = await client.users.updateUser(userId, {
      publicMetadata: {
        ...publicMetadata,
        role: "admin",
      },
    });

    // to update store info for all associated logins
    const allUsersResponse = await client.users.getUserList();
    const allUsers = allUsersResponse.data || [];

    // Update all users with the same store_id
    const usersInSameStore = allUsers.filter(
      (user) => user.publicMetadata?.store_id === store_id && user.id !== userId
    );

    for (const user of usersInSameStore) {
      await client.users.updateUser(user.id, {
        publicMetadata: {
          ...user.publicMetadata,
          ...publicMetadata,
        },
      });
    }

    // console.log("test --", res, parsed,store_id);
    return {
      status: "success",
      message: "Onboarding completed successfully!",
      data: res.publicMetadata,
    };
  } catch (err) {
    console.log("on clerk onboarding error", err);
    return {
      message: "There was an error updating the user metadata.",
      status: "error",
    };
  }
};
