import React from "react";
import Image from "next/image";
import Link from "next/link";

type EmptyStateJobProps = {
  title?: string;
  message?: string;
  link?: string;
  linkMessage?: string;
};
export default function EmptyStateJob({
  title,
  message,
  link,
  linkMessage,
}: EmptyStateJobProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl px-6 py-14 text-center">
      <Image
        src="/empty-state.png"
        alt="No jobs"
        width={360}
        height={220}
        className="mb-6 h-auto w-[360px] max-w-full"
        priority
      />
      <h3 className="text-xl font-semibold text-gray-900">
        {title || "No Job Openings Available"}
      </h3>
      <p className="mt-1 max-w-md text-base leading-7 tracking-normal text-gray-600">
        {message || `Create a job opening now and start the candidate process.`}
      </p>
      <Link
        href={link || "/jobs/new"}
        className="mt-6 inline-flex items-center gap-2 rounded-md bg-[#FBC037] px-4 py-2 text-base font-bold text-black hover:bg-[#FBC037]
                    "
      >
        {linkMessage || "Create a New Job"}
      </Link>
    </div>
  );
}
