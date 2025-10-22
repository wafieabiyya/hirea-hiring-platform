"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import SelectDropdown from "@/shared/ui/SelectDropdown";
import JobCard from "@/features/candidates/components/JobCard";
import Button from "@/shared/ui/Button";
import { Banknote, MapPin } from "lucide-react";
import Modal from "@/shared/ui/Modal";
import ApplicantForm from "../_components/ApplicantForm";
import { db, type JobRow } from "@/shared/db/indexedDB";
import { JobType } from "@/features/jobs/types/job";
import {
  getJobDetailFormatted,
  submitApplicationLocal,
} from "@/features/jobs/data/local-action";
import EmptyStateJob from "@/features/jobs/components/EmptyStateJob";
import { useRouter } from "next/navigation";
import { Sk } from "@/shared/ui/Skeleton";
import JobSkeletonCard from "@/shared/ui/JobSkeletonCard";
import { DetailSkeleton } from "@/features/candidates/ui/DetailSkeleton";

const CATEGORY_OPTIONS: JobType[] = [
  "Full-time",
  "Part-time",
  "Intern",
  "Contract",
  "Freelance",
];

function timeAgo(iso: string) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (diff <= 0) return "Today";
  if (diff === 1) return "1 day ago";
  return `${diff} days ago`;
}

export default function ApplicantJobsPage() {
  const [category, setCategory] = useState<string>("");
  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [applyOpen, setApplyOpen] = useState(false);

  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);

  const [detailFields, setDetailFields] = useState<
    { key: string; validation?: { required?: boolean } }[]
  >([]);
  const [, setDetailLevels] = useState<
    Record<string, "mandatory" | "optional" | "off">
  >({});

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      const rows = await db.jobs.orderBy("created_at").reverse().toArray();
      if (!alive) return;

      setJobs(rows);

      const activeOnly = rows.filter((j) => j.status === "active");
      if (activeOnly.length && activeId == null) setActiveId(activeOnly[0].id!);

      setLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, [activeId]);

  const isActive = (s: unknown) =>
    String(s ?? "")
      .trim()
      .toLowerCase() === "active";

  const filtered = useMemo(() => {
    const onlyActive = jobs.filter((j) => isActive(j.status));
    if (!category) return onlyActive;

    const normType = (t: unknown) =>
      String(t ?? "").replace(/^Internship$/i, "Intern");

    return onlyActive.filter((j) => normType(j.type) === category);
  }, [jobs, category]);

  useEffect(() => {
    if (!jobs.length || activeId != null) return;
    const firstActive = jobs.find((j) => isActive(j.status));
    if (firstActive) setActiveId(firstActive.id!);
  }, [jobs, activeId]);

  useEffect(() => {
    if (!filtered.length) {
      setActiveId(null);
      return;
    }
    if (!filtered.some((j) => j.id === activeId)) {
      setActiveId(filtered[0].id!);
    }
  }, [filtered, activeId]);

  const activeJob = filtered.find((j) => j.id === activeId) ?? null;

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!activeId) {
        setDetailFields([]);
        setDetailLevels({});
        return;
      }
      setDetailLoading(true);
      const d = await getJobDetailFormatted(activeId);
      if (!alive || !d) {
        setDetailLoading(false);
        return;
      }

      const fields =
        d.application_form?.sections?.[0]?.fields ??
        activeJob?.config?.application_form?.sections?.[0]?.fields ??
        [];

      setDetailFields(fields);
      setDetailLevels(d.field_levels ?? {});
      setDetailLoading(false);
    })();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId]);

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6">
      {/* Filter */}
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
        <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto">
          <SelectDropdown
            placeholder="All categories"
            options={CATEGORY_OPTIONS}
            value={category || null}
            onChange={(val) => setCategory(val)}
            className="w-full sm:w-56"
          />
        </div>
      </div>

      {loading ? (
        <>
          <div className="my-2 text-sm sm:text-base font-normal">
            <Sk className="h-4 w-28" />
          </div>

          <div
            className="grid gap-4 sm:gap-6 lg:grid-cols-[420px_1fr]"
            aria-busy
          >
            {/* LEFT skeleton list */}
            <div
              className={[
                "w-full overflow-y-auto pr-1",
                "max-h-[60vh] sm:max-h-[70vh]",
                "lg:h-[648px] lg:max-h-none",
              ].join(" ")}
            >
              <div className="space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <JobSkeletonCard key={i} />
                ))}
              </div>
            </div>

            <DetailSkeleton />
          </div>
        </>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-[#EDEDED] bg-white p-6 sm:p-10 text-center text-gray-600">
          <EmptyStateJob
            message="Please wait for the next batch of openings."
            link="/jobs"
            linkMessage="Find Another Category"
          />
        </div>
      ) : (
        <>
          <div className="my-2 text-sm sm:text-base font-normal">
            {filtered.length} Vacancy{filtered.length !== 1 ? "ies" : ""}
          </div>

          {/* Grid: stack on mobile, 2 cols on lg */}
          <div className="grid gap-4 sm:gap-6 lg:grid-cols-[420px_1fr]">
            {/* LEFT: list */}
            <div
              className={[
                "w-full overflow-y-auto pr-1",
                "max-h-[60vh] sm:max-h-[70vh]",

                "lg:h-[648px] lg:max-h-none",
              ].join(" ")}
            >
              <div className="space-y-3">
                {filtered.map((job) => (
                  <JobCard
                    key={job.id}
                    active={job.id === activeId}
                    onClick={() => setActiveId(job.id!)}
                    title={job.title}
                    company={job.company}
                    location={job.location ?? "-"}
                    minSalary={job.min_salary ?? undefined}
                    maxSalary={job.max_salary ?? undefined}
                    type={job.type}
                    tags={job.tags ?? []}
                    postedAt={timeAgo(job.created_at)}
                  />
                ))}
              </div>
            </div>

            {/* RIGHT: detail */}
            <div
              className={[
                "flex flex-col overflow-y-auto rounded-xl border border-[#EDEDED] bg-white",
                "max-h-[65vh] sm:max-h-[75vh]",
                "lg:h-[648px] lg:max-h-none",
              ].join(" ")}
            >
              {detailLoading ? (
                <DetailSkeleton />
              ) : activeJob ? (
                <Fragment>
                  {/* header */}
                  <div className="sticky top-0 z-10 border-b border-[#EDEDED] bg-white px-4 sm:px-6 pb-4 pt-4 sm:pt-6">
                    <div className="flex flex-col-reverse items-start justify-between gap-3 sm:flex-row sm:items-start sm:gap-4">
                      <div className="flex min-w-0 items-start gap-3">
                        <div className="mt-0.5 h-10 w-10 sm:h-12 sm:w-12 overflow-hidden rounded-md border border-[#E0E0E0]">
                          <Image
                            src={"/rakamin.png"}
                            alt={activeJob.company}
                            width={48}
                            height={48}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="mb-1 inline-flex items-center gap-2">
                            <span className="rounded-md bg-[#43936C] px-2 py-0.5 text-xs font-medium text-white">
                              {activeJob.type}
                            </span>
                          </div>
                          <h2 className="truncate text-base sm:text-xl font-semibold">
                            {activeJob.title}
                          </h2>
                          <p className="text-xs sm:text-sm text-gray-500">
                            {activeJob.company}
                          </p>
                        </div>
                      </div>

                      <Button
                        variant="secondary"
                        size="lg"
                        onClick={() => setApplyOpen(true)}
                        className="w-full sm:w-auto"
                      >
                        Apply
                      </Button>
                    </div>
                  </div>

                  {/* content */}
                  <div className="px-4 sm:px-6">
                    <div className="space-y-3 border-b border-[#EDEDED] py-4 text-gray-600">
                      <div className="flex flex-wrap items-center gap-2 text-sm sm:text-lg">
                        <MapPin size={20} className="sm:hidden" />
                        <MapPin size={25} className="hidden sm:block" />
                        <span className="break-words">
                          {activeJob.location ?? "-"}
                        </span>
                        {!!activeJob.tags?.length && (
                          <div className="ml-0 sm:ml-2 flex flex-wrap gap-2">
                            {activeJob.tags.map((t) => (
                              <span
                                key={t}
                                className="px-2 py-0.5 text-xs sm:text-sm text-gray-700"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {(activeJob.min_salary || activeJob.max_salary) && (
                        <div className="flex flex-wrap items-center gap-2 text-sm sm:text-lg">
                          <Banknote size={20} className="sm:hidden" />
                          <Banknote size={25} className="hidden sm:block" />
                          <span className="whitespace-nowrap">
                            Rp
                            {activeJob.min_salary?.toLocaleString("id-ID") ??
                              "-"}{" "}
                            - Rp
                            {activeJob.max_salary?.toLocaleString("id-ID") ??
                              "-"}
                          </span>
                        </div>
                      )}
                    </div>

                    {activeJob.description && (
                      <div className="py-5">
                        <h1 className="mb-2 text-base sm:text-lg font-bold">
                          Description
                        </h1>
                        <ul className="list-disc space-y-2 pl-5 text-xs sm:text-sm leading-relaxed text-gray-800">
                          {activeJob.description.split("\n").map((line, i) => (
                            <li key={i}>{line.replace(/^•\s?/, "")}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </Fragment>
              ) : (
                <div className="flex flex-1 items-center justify-center p-6 sm:p-8 text-gray-600 text-sm sm:text-base">
                  Select a job to see details.
                </div>
              )}
            </div>
          </div>

          {/* Apply modal */}
          {applyOpen && activeJob && (
            <Modal onCloseHref="/jobs">
              <ApplicantForm
                jobTitle={activeJob.title}
                company={activeJob.company}
                fields={
                  detailFields.length
                    ? detailFields
                    : activeJob.config?.application_form?.sections?.[0]
                        ?.fields ?? []
                }
                onClose={() => setApplyOpen(false)}
                onSubmit={async (payload) => {
                  await submitApplicationLocal(activeJob.id!, payload);

                  setJobs((prev) =>
                    prev.map((j) =>
                      j.id === activeJob.id
                        ? {
                            ...j,
                            candidate_count: (j.candidate_count ?? 0) + 1,
                          }
                        : j,
                    ),
                  );

                  router.push("/jobs/success");
                }}
              />
            </Modal>
          )}
        </>
      )}
    </section>
  );
}
