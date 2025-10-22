import Link from "next/link";
import React from "react";
import Image from "next/image";

export default function JobApplySuccessPage() {
  return (
    <main className="flex items-center justify-center px-6">
      <div className="w-full max-w-[700px] h-full rounded-2xl border border-[#EDEDED] bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex w-full h-full items-center justify-center   ">
          <Image src={"/success-state.svg"} alt={""} width={420} height={120} />
        </div>
        <h1 className="text-xl font-semibold">🎉 Your application was sent!</h1>
        <p className="mt-2 text-sm text-gray-600">
          Congratulations! You&apos;ve taken the first step towards a rewarding
          career at Rakamin. We look forward to learning more about you during
          the application process.
        </p>

        <div className="mt-6 grid gap-2 sm:grid-cols-2">
          <a
            href="/jobs"
            className="rounded-md border border-gray-200 px-4 py-2 text-sm hover:bg-gray-50"
          >
            Back to Jobs
          </a>
          <Link
            href="/jobs"
            className="rounded-md bg-[#01959F] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            Go to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
