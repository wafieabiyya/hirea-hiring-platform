/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";
import { useShallow } from "zustand/react/shallow";

import EmptyStateJob from "@/features/jobs/components/EmptyStateJob";
import JobCard from "@/features/jobs/components/JobCard";
import { useJobsStore } from "@/features/jobs/stores/useJobStores";

export default function AdminJobsClient() {
  const [q, setQ] = useState("");
  const { jobs, loading, error } = useJobsStore(
    useShallow((s) => ({
      jobs: s.jobs,
      loading: s.loading,
      error: s.error,
    })),
  );

  useEffect(() => {
    useJobsStore.getState().loadAll();
  }, []);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return jobs;
    return jobs.filter((j) =>
      [j.title, j.slug, j.company, j.type, j.status, j.description, j.location]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(query)),
    );
  }, [jobs, q]);

  return (
    <section className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-6">
          {/* Search */}
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex w-full items-center gap-2 rounded-md border-[2px] border-[#EDEDED] bg-white px-3 py-1"
          >
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by job details"
              className="flex-1 text-sm outline-none placeholder:text-gray-400"
            />
            <button
              type="submit"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-gray-50"
              aria-label="Search"
              title="Search"
            >
              <Search className="h-5 w-5 text-teal-600" />
            </button>
          </form>

          {/* Loading / Error / List */}
          {loading && jobs.length === 0 ? (
            <div className="rounded-xl border bg-white p-8 text-center text-gray-600">
              Loading jobs…
            </div>
          ) : error ? (
            <div className="rounded-xl border bg-white p-8 text-center text-red-600">
              {error}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyStateJob />
          ) : (
            <div className="space-y-5">
              {filtered.map((j: any) => (
                <JobCard key={j.id} job={j} />
              ))}
            </div>
          )}
        </div>

        {/* CTA card */}
        <aside className="relative h-[168px] overflow-hidden rounded-xl bg-black">
          <Image
            src="/bg-menu.jpg"
            alt="Bg Menu"
            fill
            className="object-cover opacity-50"
            priority
          />
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-4 text-center">
            <h3 className="text-lg font-bold leading-[28px] text-white">
              Recruit the best candidates
            </h3>
            <p className="mt-2 text-sm font-bold text-white/90">
              Create jobs, invite, and hire with ease
            </p>
            <Link
              href="/admin/jobs/new"
              className="mt-4 flex w-full justify-center rounded-md bg-teal-600 px-4 py-2 text-sm font-bold text-white hover:bg-teal-700"
            >
              Create a new job
            </Link>
          </div>
        </aside>
      </div>
    </section>
  );
}
