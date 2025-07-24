import React from "react";
import ConfigCard from "./ConfigCard";
import { getConfiguration } from "@/actions/configActions";

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
