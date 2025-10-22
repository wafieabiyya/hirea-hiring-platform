import React from "react";
import { Sk } from "./Skeleton";

export default function JobSkeletonCard() {
  return (
    <div className="rounded-xl w-full border border-[#E0E0E0] p-3 sm:p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <Sk className="h-10 w-10 sm:h-12 sm:w-12 rounded-md" />
        <div className="min-w-0 flex-1">
          <Sk className="h-4 sm:h-5 w-3/4 mb-2" />
          <Sk className="h-3 sm:h-4 w-1/2" />
          <div className="mt-2 space-y-2">
            <Sk className="h-3 w-2/3" />
            <Sk className="h-3 w-1/3" />
          </div>
          <div className="mt-2 flex gap-2">
            <Sk className="h-5 w-20" />
            <Sk className="h-5 w-16" />
          </div>
        </div>
      </div>
      <Sk className="h-3 w-16 mt-3 self-end" />
    </div>
  );
}
