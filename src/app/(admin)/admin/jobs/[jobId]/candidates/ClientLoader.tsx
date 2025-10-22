/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import CandidatesClientPage from "./CandidatesClientPage";
import { db } from "@/shared/db/indexedDB";
import { listApplicationsByJobFormatted } from "@/features/jobs/data/local-action";
import {
  CandidateRow,
  toCandidateRows,
} from "@/features/jobs/utils/candidate-adapter";

export default function CandidatesClientLoader({
  jobIdParam,
}: {
  jobIdParam: string;
}) {
  const [title, setTitle] = useState<string>("Candidates");
  const [rows, setRows] = useState<CandidateRow[]>([]);

  const jobKey = useMemo(() => {
    const n = Number(jobIdParam);
    if (!Number.isNaN(n)) return { kind: "id" as const, value: n };

    const m = jobIdParam.match(/(\d{4})$/);
    if (m) return { kind: "id" as const, value: Number(m[1]) };

    // fallback: treat as slug
    return { kind: "slug" as const, value: jobIdParam };
  }, [jobIdParam]);

  useEffect(() => {
    let alive = true;
    (async () => {
      // resolve job
      const job =
        jobKey.kind === "id"
          ? await db.jobs.get(jobKey.value)
          : await db.jobs.where("slug").equals(jobKey.value).first();

      if (alive) setTitle(job?.title ?? "Candidates");

      const realId = job?.id;
      const res = realId
        ? await listApplicationsByJobFormatted(realId)
        : { data: [] as any[] };
      if (!alive) return;

      setRows(toCandidateRows(res));
    })();
    return () => {
      alive = false;
    };
  }, [jobKey]);

  return <CandidatesClientPage jobTitle={title} candidates={rows as any} />;
}
