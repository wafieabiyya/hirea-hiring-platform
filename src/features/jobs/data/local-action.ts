import {
  db,
  JobConfig,
  JobFieldRow,
  JobRow,
  slugify,
} from "@/shared/db/indexedDB";

const LABELS: Record<string, string> = {
  full_name: "Full Name",
  email: "Email",
  phone_number: "Phone",
  domicile: "Domicile",
  gender: "Gender",
  linkedin_link: "LinkedIn",
  date_of_birth: "Date of Birth",
  photo_profile: "Photo Profile",
};

const ORDER: string[] = [
  "photo_profile",
  "full_name",
  "email",
  "phone_number",
  "domicile",
  "gender",
  "linkedin_link",
  "date_of_birth",
];

const KEY_WHITELIST = new Set(ORDER);

export type FieldLevel = "mandatory" | "optional" | "off";
export type JobFieldKey =
  | "fullName"
  | "photo"
  | "gender"
  | "domicile"
  | "email"
  | "phone"
  | "linkedin"
  | "dob";

export type JobType =
  | "Full-time"
  | "Part-time"
  | "Intern"
  | "Contract"
  | "Freelance";

export type JobStatus = "active" | "inactive" | "draft";
function toConfig(fields: Record<JobFieldKey, FieldLevel>): JobConfig {
  const keyMap: Record<JobFieldKey, string> = {
    fullName: "full_name",
    photo: "photo_profile",
    gender: "gender",
    domicile: "domicile",
    email: "email",
    phone: "phone_number",
    linkedin: "linkedin_link",
    dob: "date_of_birth",
  };

  const items = (Object.keys(fields) as JobFieldKey[])
    .filter((k) => fields[k] !== "off")
    .map((k) => ({
      key: keyMap[k],
      validation: { required: fields[k] === "mandatory" },
    }));

  return {
    application_form: {
      sections: [
        {
          title: "Minimum Profile Information Required",
          fields: items,
        },
      ],
    },
  };
}

export async function createJobLocal(input: {
  job: {
    title: string;
    company: string;
    type: JobType;
    status: JobStatus;
    location?: string;
    min_salary?: number | null;
    max_salary?: number | null;
    description?: string;
    tags?: string[];
    needed?: number | null;
  };
  fields: Record<JobFieldKey, FieldLevel>;
}) {
  const now = new Date().toISOString();
  const slug = slugify(input.job.title);

  const jobRow: JobRow = {
    slug,
    title: input.job.title,
    company: input.job.company,
    type: input.job.type,
    status: input.job.status,
    location: input.job.location ?? null,
    min_salary: input.job.min_salary ?? null,
    max_salary: input.job.max_salary ?? null,
    description: input.job.description ?? null,
    tags: input.job.tags ?? [],
    created_at: now,
    candidate_count: input.job.needed ?? 0,
    config: toConfig(input.fields),
  };

  const job_id = await db.jobs.add(jobRow);

  const fieldRows: JobFieldRow[] = (
    Object.keys(input.fields) as JobFieldKey[]
  ).map((k) => ({
    job_id,
    key: k,
    level: input.fields[k],
  }));
  if (fieldRows.length) await db.job_fields.bulkAdd(fieldRows);

  return await db.jobs.get(job_id);
}

export async function listJobsFormatted() {
  const data = await db.jobs.orderBy("created_at").reverse().toArray();
  return data.map((j) => ({
    id: `job${new Date(j.created_at)
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, "")}${String(j.id).padStart(4, "0")}`,
    slug: j.slug,
    id_num: j.id,
    title: j.title,
    status: j.status,

    created_at: j.created_at,

    salary_range: {
      min: j.min_salary ?? null,
      max: j.max_salary ?? null,
      currency: "IDR",
      display_text:
        j.min_salary || j.max_salary
          ? `Rp${(j.min_salary ?? 0).toLocaleString("id-ID")} - Rp${(
              j.max_salary ?? 0
            ).toLocaleString("id-ID")}`
          : null,
    },
    list_card: {
      badge: j.status,
      started_on_text: `started on ${new Date(j.created_at).toLocaleDateString(
        "en-GB",
        { day: "numeric", month: "short", year: "numeric" },
      )}`,
      cta: "Manage Job",
      candidates_count: j.candidate_count,
    },
  }));
}

export async function getJobDetailFormatted(jobId: number) {
  const job = await db.jobs.get(jobId);
  if (!job) return null;

  const rawLevels = await db.job_fields.where("job_id").equals(jobId).toArray();
  const levels: Record<string, "mandatory" | "optional" | "off"> = {};
  rawLevels.forEach((r) => (levels[r.key] = r.level));

  const cfg = job.config?.application_form ?? { sections: [] };
  const normalizedSections = (cfg.sections ?? []).map((sec) => ({
    ...sec,
    fields: (sec.fields ?? []).filter((f) => levels[f.key] !== "off"),
  }));

  return {
    job: {
      id: job.id,
      slug: job.slug,
      title: job.title,
      company: job.company,
      type: job.type,
      location: job.location,
      description: job.description,
      tags: job.tags,
      salary_range: {
        min: job.min_salary ?? null,
        max: job.max_salary ?? null,
        currency: "IDR",
        display_text:
          job.min_salary || job.max_salary
            ? `Rp${(job.min_salary ?? 0).toLocaleString("id-ID")} - Rp${(
                job.max_salary ?? 0
              ).toLocaleString("id-ID")}`
            : null,
      },
      candidates_count: job.candidate_count,
      created_at: job.created_at,
    },
    application_form: {
      sections: normalizedSections,
    },

    field_levels: levels,
  };
}

function toStorableValue(key: string, v: unknown): unknown {
  if (key === "phone_number" && typeof v === "string") {
    try {
      const parsed = JSON.parse(v);
      if (
        parsed &&
        typeof parsed === "object" &&
        "country" in parsed &&
        "local" in parsed
      ) {
        const cc =
          parsed.country === "ID"
            ? "+62"
            : parsed.country === "MY"
            ? "+60"
            : "+65";
        return `${cc} ${String(parsed.local)}`;
      }
    } catch {}
    return v;
  }

  return v;
}
export async function submitApplicationLocal(
  jobId: number,
  payload: Record<string, FormDataEntryValue>,
) {
  const now = new Date().toISOString();
  const appId = await db.applications.add({
    job_id: jobId,
    status: "submitted",
    created_at: now,
  });

  const rows = Object.entries(payload)
    .filter(([k]) => KEY_WHITELIST.has(k))
    .map(([key, raw]) => ({
      application_id: appId,
      key,
      value: toStorableValue(key, raw),
    }));

  if (rows.length) await db.application_answers.bulkAdd(rows);
  return appId;
}

export async function listApplicationsByJobFormatted(jobId: number) {
  const apps = await db.applications.where("job_id").equals(jobId).toArray();

  const appIds = apps.map((a) => a.id!) as number[];
  const allAnswers = await db.application_answers
    .where("application_id")
    .anyOf(appIds)
    .toArray();

  const answersByApp: Record<number, typeof allAnswers> = {};
  for (const ans of allAnswers) {
    const aid = ans.application_id as number;
    (answersByApp[aid] ||= []).push(ans);
  }

  function buildAttributes(list: { key: string; value: unknown }[]) {
    const m = new Map<
      string,
      { key: string; label: string; value: string | null; order: number }
    >();
    for (const it of list) {
      const key = it.key;
      if (!KEY_WHITELIST.has(key)) continue;

      let valueStr: string | null = null;
      if (key === "photo_profile") {
        valueStr = typeof it.value === "string" ? it.value : null;
      } else if (typeof it.value === "string") {
        valueStr = it.value;
      } else if (it.value == null) {
        valueStr = null;
      } else {
        valueStr = String(it.value);
      }

      m.set(key, {
        key,
        label: LABELS[key] ?? key,
        value: valueStr,
        order: ORDER.indexOf(key) >= 0 ? ORDER.indexOf(key) + 1 : 999,
      });
    }
    return Array.from(m.values()).sort((a, b) =>
      a.order === b.order ? a.label.localeCompare(b.label) : a.order - b.order,
    );
  }

  return {
    data: apps.map((a) => ({
      id:
        "cand" +
        new Date(a.created_at).toISOString().slice(0, 10).replace(/-/g, "") +
        String(a.id).padStart(4, "0"),
      applied_at: a.created_at,
      attributes: buildAttributes(
        (answersByApp[a.id!] || []).map((x) => ({
          key: x.key,
          value: x.value,
        })),
      ),
    })),
  };
}
