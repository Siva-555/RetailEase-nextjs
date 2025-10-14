import React from "react";
import type { Metadata } from "next";
import ConfigCard from "./ConfigCard";
import { getConfiguration } from "@/actions/configActions";

export const metadata: Metadata = {
  title: "Configuration",
  description: "RetailEase Configuration. Manage your application settings.",
};

const ConfigurationPage = async () => {
  const { success, configuration } = await getConfiguration();
  if (!success) {
    return (
      <div className="flex items-center justify-center h-full max-w-xl mx-auto mt-10 p-6">
        <h1 className="text-2xl font-bold">Configuration not found</h1>
      </div>
    );
  }
  return <ConfigCard data={configuration} />;
};

export default ConfigurationPage;
