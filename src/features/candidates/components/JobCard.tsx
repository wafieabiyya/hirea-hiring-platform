"use client";

import { Banknote, MapPin } from "lucide-react";
import Image from "next/image";

type JobType = "Full-time" | "Part-time" | "Intern" | "Contract" | "Freelance";

export default function JobCard({
  active,
  onClick,
  title,
  company,
  location,
  minSalary,
  maxSalary,
  type,
  tags = [],
  postedAt,
}: {
  active?: boolean;
  onClick?: () => void;
  title: string;
  company: string;
  logo?: string;
  location: string;
  minSalary?: number | null;
  maxSalary?: number | null;
  type: JobType;
  tags?: string[];
  postedAt?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "rounded-xl w-full border border-[#E0E0E0] p-3 sm:p-4 text-left shadow-sm transition flex flex-col",
        active
          ? "bg-[#F7FEFF] border-l-[4px] border-l-[#01777F]"
          : "hover:border-[#01777F] hover:bg-teal-200/10",
      ].join(" ")}
    >
      <div className="flex items-start gap-2 sm:gap-3">
        <div className="mt-1 h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 overflow-hidden rounded-md border border-[#E0E0E0]">
          <Image
            src={"/rakamin.png"}
            alt={company}
            width={48}
            height={48}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-sm sm:text-base font-bold leading-tight sm:leading-[28px] tracking-normal">
              {title}
            </h3>
          </div>
          <p className="text-xs sm:text-sm leading-5 sm:leading-6 tracking-normal text-gray-600">
            {company}
          </p>

          <div className="mt-1 sm:mt-2 flex flex-col gap-1 text-xs sm:text-sm text-gray-700">
            <span className="flex items-center gap-1 text-xs sm:text-md leading-4 sm:leading-5 tracking-normal">
              <MapPin size={16} className="sm:w-5 sm:h-5" /> {location}
            </span>

            {(minSalary || maxSalary) && (
              <div className="flex items-center gap-1 text-xs sm:text-md leading-4 sm:leading-5 tracking-normal text-[#616161]">
                <Banknote size={16} className="sm:w-5 sm:h-5" />
                <span className="truncate">
                  Rp{minSalary?.toLocaleString("id-ID") ?? "-"} - Rp
                  {maxSalary?.toLocaleString("id-ID") ?? "-"}
                </span>
              </div>
            )}
          </div>

          <div className="mt-1 sm:mt-2 flex flex-wrap gap-1">
            <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 flex-shrink-0">
              {type}
            </span>
            {tags.slice(0, 1).map((t) => (
              <span
                key={t}
                className="rounded-md border px-2 py-0.5 text-xs text-gray-700 truncate"
              >
                {t}
              </span>
            ))}
            {tags.length > 1 && (
              <span className="text-xs text-gray-500 px-1 py-0.5">
                +{tags.length - 1}
              </span>
            )}
          </div>
        </div>
      </div>

      {postedAt && (
        <div className="mt-2 sm:mt-auto self-end text-xs text-gray-500">
          {postedAt}
        </div>
      )}
    </button>
  );
}
