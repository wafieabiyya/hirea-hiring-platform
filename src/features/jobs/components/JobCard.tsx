/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { fDate, fIDR } from "../utils/job-helpers";

type JobLike = any;

const statusClass: Record<"active" | "inactive" | "draft", string> = {
  active: "border border-green-200 bg-green-50 text-green-700",
  inactive: "border border-red-200 bg-red-50 text-red-700",
  draft: "border border-amber-200 bg-amber-50 text-amber-700",
};

export default function JobCard({ job }: { job: JobLike }) {
  const rawStatus = job.status ?? job.list_card?.badge ?? "active";
  const s = String(rawStatus).toLowerCase();
  const status: "active" | "inactive" | "draft" = (
    ["active", "inactive", "draft"].includes(s) ? s : "active"
  ) as any;

  const startedText = job.created_at
    ? `started on ${fDate(job.created_at)}`
    : job.list_card?.started_on_text ?? "";

  const type = job.type as string | undefined;

  const displayText: string | null | undefined = job.salary_range?.display_text;
  const min = job.min_salary ?? job.salary_range?.min ?? null;
  const max = job.max_salary ?? job.salary_range?.max ?? null;
  const fallbackSalary =
    min !== null || max !== null
      ? `${fIDR(min)} - ${fIDR(max)}`
      : "Not specified";
  const salaryText = displayText ?? fallbackSalary;

  const realId = (job as any).id_num ?? (job as any).id;

  return (
    <article className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span
          className={`inline-flex items-center rounded-lg px-3 py-1 text-xs font-medium ${statusClass[status]}`}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>

        {type && (
          <span className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-3 py-1 text-xs text-gray-700">
            {type}
          </span>
        )}

        {startedText && (
          <span className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-3 py-1 text-xs text-gray-600">
            {startedText}
          </span>
        )}
      </div>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-[17px] font-semibold text-gray-900">
            {job.title}
          </h3>
          <p className="mt-1 text-sm text-gray-600">{salaryText}</p>
        </div>

        <Link
          href={`/admin/jobs/${realId}/candidates`}
          className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-teal-700"
        >
          Manage Job
        </Link>
      </div>
    </article>
  );
}
