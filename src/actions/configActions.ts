"use server";

import { prisma } from "@/lib/db";
import { getUserEmail, getUserPublicMetadata } from "@/lib/server/getUserInfo";

import { ConfigSchema, ConfigSchemaType } from "@/zodSchema/configSchema";

type FinalConfigType = ConfigSchemaType & {
  modified_date: Date;
  modified_by: string;
  store_id: string;
};

export async function saveConfiguration(data: ConfigSchemaType, id?: string) {
  try {
    const result = ConfigSchema.safeParse(data);

    if (!result.success) {
      return { success: false, errors: result.error.flatten().fieldErrors };
    }

    const created_date = new Date(Date.now() + 5.5 * 60 * 60 * 1000);

    const email = await getUserEmail();
    const publicMetadata = await getUserPublicMetadata();

    const finalData: FinalConfigType = {
      ...result.data,
      modified_by: email || "",
      modified_date: created_date,
      store_id:
        publicMetadata && typeof publicMetadata.store_id === "string"
          ? publicMetadata.store_id
          : "",
    };

    if (id) {
      const configuration = await prisma.configuration.update({
        where: { id },
        data: finalData,
      });

      return { success: true, configuration };
    } else {
      const configuration = await prisma.configuration.create({
        data: finalData,
      });

      return { success: true, configuration };
    }
  } catch (error) {
    console.error("Error in saveConfiguration:", error);
    return {
      success: false,
      errors: { general: "An error occurred while saving configuration" },
    };
  }
}

export async function getConfiguration() {
  try {
    const publicMetadata = await getUserPublicMetadata();
    const store_id =
      publicMetadata && typeof publicMetadata.store_id === "string"
        ? publicMetadata.store_id
        : "";

    const configuration = await prisma.configuration.findFirst({
      where: { store_id: store_id },
    });

    return { success: true, configuration };
  } catch (error) {
    console.error("Error fetching configuration:", error);
    return { success: false, configuration: null };
  }
}
