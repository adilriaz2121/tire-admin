import React from "react";
import { FileWarning } from "lucide-react";

const Error = ({ error }: { error: string }) => {
  return (
    <div className="min-h-[50vh] flex items-center justify-center bg-background text-foreground">
      <div className="flex flex-col items-center justify-center gap-y-4">
        <FileWarning className="w-10 h-10" />
        <h2 className="text-2xl">{error}</h2>
      </div>
    </div>
  );
};

export default Error;
