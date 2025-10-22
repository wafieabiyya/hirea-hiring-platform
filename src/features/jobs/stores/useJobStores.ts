/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { create } from "zustand";
import type { JobRow } from "@/shared/db/indexedDB";
import {
  createJobLocal,
  submitApplicationLocal,
} from "@/features/jobs/data/local-action";
import { db } from "@/shared/db/indexedDB";
import toast from "react-hot-toast";

type JobCreateInput = Parameters<typeof createJobLocal>[0];
type ApplyPayload = Record<string, FormDataEntryValue>;

type JobsState = {
  jobs: JobRow[];
  loading: boolean;
  error: string | null;

  loadAll: () => Promise<void>;
  loadActiveOnly: () => Promise<void>;
  createJob: (input: JobCreateInput) => Promise<JobRow | null>;
  submitApplication: (jobId: number, payload: ApplyPayload) => Promise<void>;

  byType: (t: JobRow["type"]) => JobRow[];
};

export const useJobsStore = create<JobsState>((set, get) => ({
  jobs: [],
  loading: false,
  error: null,

  loadAll: async () => {
    set({ loading: true, error: null });
    try {
      const rows = await db.jobs.orderBy("created_at").reverse().toArray();
      set({ jobs: rows, loading: false });
    } catch (e: any) {
      set({ loading: false, error: e?.message ?? "Failed to load jobs" });
      toast.error("Failed to load jobs");
    }
  },

  loadActiveOnly: async () => {
    set({ loading: true, error: null });
    try {
      const rows = await db.jobs
        .where("status")
        .equals("active")
        .reverse()
        .sortBy("created_at");
      rows.reverse();
      set({ jobs: rows, loading: false });
    } catch (e: any) {
      set({ loading: false, error: e?.message ?? "Failed to load jobs" });
      toast.error("Failed to load jobs");
    }
  },

  createJob: async (input) => {
    try {
      const row = await createJobLocal(input);
      if (!row) throw new Error("Failed to create job");

      set((s) => ({ jobs: [row as JobRow, ...s.jobs] }));
      toast.success("Job created");
      return row as JobRow;
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to create job");
      return null;
    }
  },

  submitApplication: async (jobId, payload) => {
    try {
      await submitApplicationLocal(jobId, payload);

      set((s) => ({
        jobs: s.jobs.map((j) =>
          j.id === jobId
            ? { ...j, candidate_count: (j.candidate_count ?? 0) + 1 }
            : j,
        ),
      }));
      toast.success("Application submitted");
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to submit application");
      throw e;
    }
  },

  byType: (t) => get().jobs.filter((j) => j.type === t),
}));
