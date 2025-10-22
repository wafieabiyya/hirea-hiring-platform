import React from "react";
import Image from "next/image";
export default function EmptyStateClient() {
  return (
    <div className="h-[600px] flex flex-col items-center justify-center text-center py-12">
      <Image
        src="/candidate-empty-state.svg"
        alt="Empty State For Candidate"
        width={276}
        height={260}
        className="mb-6 opacity-90"
      />
      <h3 className="text-black font-bold text-base mb-1">
        No candidates found
      </h3>
      <p className="text-gray-500 text-sm">
        Share your job vacancies so that more candidates will apply.
      </p>
    </div>
  );
}
