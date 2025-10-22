"use client";

import EmptyStateClient from "@/features/jobs/components/EmptyStateClient";
import { type Candidate } from "@/features/jobs/data/dummy-candidate";
import { fallback, normalizeUrl } from "@/features/jobs/utils/job-helpers";
import DataTable from "@/shared/ui/DataTable";
import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

const columns: ColumnDef<Candidate>[] = [
  {
    id: "name",
    header: "Name",
    accessorKey: "name",
    enableResizing: true,
    size: 240,
    cell: (info) => (
      <span className="font-medium">{info.getValue<string>()}</span>
    ),
  },
  {
    id: "email",
    header: "Email",
    accessorKey: "email",
    enableResizing: true,
    size: 260,
  },
  {
    id: "phone",
    header: "Phone",
    accessorKey: "phone",
    enableResizing: true,
    size: 160,
    cell: (info) => fallback(info.getValue()),
  },
  {
    id: "dob",
    header: "Applied Date",
    accessorKey: "appliedAt",
    enableResizing: true,
    size: 160,
    cell: (info) =>
      new Date(info.getValue<string>()).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
  },
  {
    id: "domicile",
    header: "Domicile",
    accessorKey: "domicile",
    enableResizing: true,
    size: 140,
    cell: (info) => fallback(info.getValue()),
  },
  {
    id: "gender",
    header: "Gender",
    accessorKey: "gender",
    enableResizing: true,
    size: 120,
    cell: (info) => fallback(info.getValue()),
  },
  {
    id: "linkedin",
    header: "LinkedIn",
    accessorKey: "linkedin",
    enableResizing: true,
    size: 240,
    cell: (info) => {
      const raw = info.getValue<string | null | undefined>();
      const href = normalizeUrl(raw);
      if (!href) return <span className="text-gray-500">—</span>;
      return (
        <Link
          href={href}
          target="_blank"
          className="text-[#01959F] hover:underline break-all"
        >
          {href}
        </Link>
      );
    },
  },
];

export default function CandidatesClientPage({
  jobTitle,
  candidates,
}: {
  jobTitle: string;
  candidates: Candidate[];
}) {
  const isEmpty = candidates.length === 0;
  return (
    <section className="space-y-4">
      <h1 className="text-lg font-semibold">{jobTitle}</h1>

      <div className="border border-gray-300 p-4 rounded-md">
        {isEmpty ? (
          <EmptyStateClient />
        ) : (
          <DataTable<Candidate>
            data={candidates}
            columns={columns}
            initialColumnOrder={[
              "name",
              "email",
              "phone",
              "dob",
              "domicile",
              "gender",
              "linkedin",
            ]}
            globalFilterPlaceholder="Search name, email, phone…"
          />
        )}
      </div>
    </section>
  );
}
