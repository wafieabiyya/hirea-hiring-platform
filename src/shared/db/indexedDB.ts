/* eslint-disable @typescript-eslint/no-explicit-any */
import Dexie, { Table } from "dexie";
export type JobRow = {
  id?: number; // auto
  slug: string;
  title: string;
  company: string;
  type: "Full-time" | "Part-time" | "Intern" | "Contract" | "Freelance";
  status: "active" | "inactive" | "draft";
  location?: string | null;
  min_salary?: number | null;
  max_salary?: number | null;
  description?: string | null;
  tags: string[];
  created_at: string;
  candidate_count: number;
  config?: JobConfig | null;
};

export type JobFieldRow = {
  id?: number;
  job_id: number;
  key: string;
  level: "mandatory" | "optional" | "off";
};

export type ApplicationRow = {
  id?: number;
  job_id: number;
  status: string; // 'submitted'
  created_at: string; // ISO
};

export type AnswerRow = {
  id?: number;
  application_id: number;
  key: string;
  value: unknown;
};

export type JobConfig = {
  application_form: {
    sections: Array<{
      title: string;
      fields: Array<{
        key: string; // e.g. "full_name"
        validation: { required: boolean };
      }>;
    }>;
  };
};

class JobsDB extends Dexie {
  jobs!: Table<JobRow, number>;
  job_fields!: Table<JobFieldRow, number>;
  applications!: Table<ApplicationRow, number>;
  application_answers!: Table<AnswerRow, number>;

  constructor() {
    super("hirea");

    this.version(2)
      .stores({
        jobs: "++id, slug, title, created_at",
        job_fields: "++id, job_id, key, level",
        applications: "++id, job_id, created_at",
        application_answers: "++id, application_id, key",
      })
      .upgrade(async (tx) => {
        const all = await tx.table("jobs").toArray();
        await Promise.all(
          all.map((j: any) =>
            tx.table("jobs").update(j.id, {
              candidate_count:
                typeof j.candidate_count === "number" ? j.candidate_count : 0,
              config: j.config ?? null,
              slug: j.slug ?? slugify(j.title ?? "job"),
            }),
          ),
        );
      });
  }
}

export const db = new JobsDB();

export function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}
