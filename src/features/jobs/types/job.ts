export type JobStatus = "active" | "inactive" | "draft";

export type JobFieldKey =
  | "fullName"
  | "photo"
  | "gender"
  | "domicile"
  | "email"
  | "phone"
  | "linkedin"
  | "dob";

export type FieldLevel = "mandatory" | "optional" | "off";

export type JobType =
  | "Full-time"
  | "Part-time"
  | "Intern"
  | "Contract"
  | "Freelance";

export type Job = {
  id: string;
  title: string;
  company: string;
  status: JobStatus;
  type: JobType;
  location: string | null;
  min_salary: number | null;
  max_salary: number | null;
  description: string | null;
  tags: string[] | null;
  created_at: string;
};

export type JobField = {
  id: number;
  job_id: string;
  key: JobFieldKey;
  level: FieldLevel;
};

export type Application = {
  id: string;
  job_id: string;
  status: string;
  created_at: string;
};

export type Answer = {
  id: number;
  application_id: string;
  key: string;
  value: unknown;
};
