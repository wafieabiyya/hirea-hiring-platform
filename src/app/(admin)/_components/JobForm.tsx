"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import CurrencyInput from "@/features/jobs/ui/CurrencyInput";
import SelectDropdown from "@/shared/ui/SelectDropdown";
import { Form } from "@/shared/ui/Form";
import FormShell from "@/shared/ui/FormShel";
import Button from "@/shared/ui/Button";
import { createJobLocal } from "@/features/jobs/data/local-action";

type FieldKey =
  | "fullName"
  | "photo"
  | "gender"
  | "domicile"
  | "email"
  | "phone"
  | "linkedin"
  | "dob";
type Level = "mandatory" | "optional" | "off";

const fields: { key: FieldKey; label: string }[] = [
  { key: "fullName", label: "Full Name" },
  { key: "photo", label: "Photo Profile" },
  { key: "gender", label: "Gender" },
  { key: "domicile", label: "Domicile" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone number" },
  { key: "linkedin", label: "Linkedin link" },
  { key: "dob", label: "Date of birth" },
];

const JOB_TYPES = [
  "Full-time",
  "Contract",
  "Part-time",
  "Intern",
  "Freelance",
] as const;

type JobType = (typeof JOB_TYPES)[number];

const JOB_STATUS = ["active", "inactive", "draft"] as const;

type JobStatus = (typeof JOB_STATUS)[number];

export default function JobForm() {
  const router = useRouter();

  // form state
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [jobType, setJobType] = useState<string>("");
  const [jobStatus, setJobStatus] = useState<string>("");
  const [description, setDescription] = useState("");
  const [needed, setNeeded] = useState<string>("");
  const [location, setLocation] = useState("");

  const [minSalary, setMinSalary] = useState<number | null>(7_000_000);
  const [maxSalary, setMaxSalary] = useState<number | null>(8_000_000);

  const [levels, setLevels] = useState<Record<FieldKey, Level>>({
    fullName: "mandatory",
    photo: "mandatory",
    gender: "mandatory",
    domicile: "mandatory",
    email: "mandatory",
    phone: "mandatory",
    linkedin: "mandatory",
    dob: "mandatory",
  });

  const [submitting, setSubmitting] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  const LOCKED_MANDATORY: FieldKey[] = ["fullName", "photo", "email"];
  const isLockedMandatory = (k: FieldKey) => LOCKED_MANDATORY.includes(k);

  const baseBtn =
    "rounded-full px-3 py-1 text-sm border transition select-none";
  const selectedCyan =
    "border-[#01959F] bg-[#E6F7F8] text-[#01959F] font-medium";
  const unselectedNeutral =
    "border-gray-300 text-gray-700 bg-white hover:bg-gray-50";
  const disabledBtn =
    "opacity-60 bg-[#EDEDED] cursor-not-allowed hover:bg-transparent";

  const canSubmit = useMemo(() => {
    if (!title.trim()) return false;
    if (!company.trim()) return false;
    if (!jobType) return false;
    if (!description.trim()) return false;
    if (minSalary !== null && maxSalary !== null && minSalary > maxSalary)
      return false;
    return true;
  }, [title, company, jobType, description, minSalary, maxSalary]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || submitting) return;

    setSubmitting(true);
    setErrMsg(null);

    try {
      const jobPayload = {
        title: title.trim(),
        company: company.trim(),
        type: jobType as JobType,
        status: jobStatus as JobStatus,
        location: location.trim() || undefined,
        min_salary: minSalary ?? null,
        max_salary: maxSalary ?? null,
        description: description.trim(),
        tags: [] as string[],
      };

      await createJobLocal({
        job: jobPayload,
        fields: levels,
      });

      router.back();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setErrMsg(err?.message ?? "Failed to create job.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <FormShell
      title="Job Opening"
      onClose={() =>
        history.length > 1 ? router.back() : router.push("/jobs")
      }
      onSubmit={handleSubmit}
      primaryAction={
        <Button
          variant="primary"
          className="font-bold"
          disabled={!canSubmit || submitting}
        >
          {submitting ? "Publishing…" : "Publish Job"}
        </Button>
      }
      showCloseIcon={true}
    >
      {/* Error */}
      {errMsg && (
        <div className="mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {errMsg}
        </div>
      )}

      {/* Generic fields */}
      <Form.Row label="Job Name" required>
        <Form.Input
          placeholder="Ex. Front End Engineer"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </Form.Row>

      <Form.Row label="Company" required>
        <Form.Input
          placeholder="Ex. Rakamin"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          required
        />
      </Form.Row>

      <Form.Row label="Job Type" required>
        <SelectDropdown
          placeholder="Select job type"
          options={[...JOB_TYPES]}
          value={jobType || null}
          onChange={setJobType}
          className="mb-2"
        />
      </Form.Row>

      <Form.Row label="Job Status" required>
        <SelectDropdown
          placeholder="Select job status"
          options={[...JOB_STATUS]}
          value={jobStatus || null}
          onChange={setJobStatus}
          className="mb-2"
        />
      </Form.Row>

      <Form.Row label="Location">
        <Form.Input
          placeholder="Ex. Jakarta / Remote"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </Form.Row>

      <Form.Row label="Job Description" required>
        <Form.Textarea
          rows={3}
          placeholder="Describe this role…"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </Form.Row>

      <Form.Row label="Number of Candidate Needed">
        <Form.Input
          placeholder="Ex. 2"
          value={needed}
          onChange={(e) => setNeeded(e.target.value.replace(/\D/g, ""))}
          inputMode="numeric"
        />
      </Form.Row>

      <div
        className="my-4 border-t border-dashed border-[#EDEDED]"
        style={{
          borderImage:
            "repeating-linear-gradient(to right, currentColor 0, currentColor 10px, transparent 5px, transparent 20px) 1",
        }}
      />

      {/* Admin-only: salary */}
      <div className="mb-4 space-y-4">
        <p className="text-sm font-normal">Job Salary</p>
        <div className="flex items-center justify-between">
          <label className="w-full text-sm">
            Minimum Estimated Salary
            <CurrencyInput
              value={minSalary}
              onChange={setMinSalary}
              placeholder=" 0"
              className="mt-2 w-full rounded-md border-2 border-[#E0E0E0] px-3 py-2 text-sm"
              name="salaryMin"
            />
          </label>
          <div className="mx-2 mt-8 h-px w-6 flex-shrink-0 bg-gray-400" />
          <label className="w-full text-sm">
            Maximum Estimated Salary
            <CurrencyInput
              value={maxSalary}
              onChange={setMaxSalary}
              placeholder=" 0"
              className="mt-2 w-full rounded-md border-2 border-[#E0E0E0] px-3 py-2 text-sm"
              name="salaryMax"
            />
          </label>
        </div>

        {/* Validasi range */}
        {minSalary !== null && maxSalary !== null && minSalary > maxSalary && (
          <p className="text-sm text-red-600">
            Minimum salary cannot be greater than maximum salary.
          </p>
        )}
      </div>

      <fieldset className="mt-4 rounded-xl border border-[#EDEDED] p-4">
        <legend className="px-1 text-sm font-medium">
          Minimum Profile Information Required
        </legend>
        <ul className="my-2 divide-y divide-[#EDEDED]">
          {fields.map((f) => {
            const locked = isLockedMandatory(f.key);
            return (
              <li
                key={f.key}
                className="flex items-center justify-between py-3"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm leading-[28px] text-[#404040]">
                    {f.label}
                  </span>
                  {locked && (
                    <span className="rounded-full bg-[#E6F7F8] px-2 py-0.5 text-[11px] text-[#01959F]">
                      Always required
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  {(["mandatory", "optional", "off"] as Level[]).map((lv) => {
                    const active = levels[f.key] === lv;
                    const disabled = locked && lv !== "mandatory";
                    return (
                      <button
                        key={lv}
                        type="button"
                        disabled={disabled}
                        onClick={() =>
                          !disabled &&
                          setLevels((s) => ({
                            ...s,
                            [f.key]: lv,
                          }))
                        }
                        className={[
                          baseBtn,
                          active ? selectedCyan : unselectedNeutral,
                          disabled ? disabledBtn : "",
                        ].join(" ")}
                      >
                        {lv.charAt(0).toUpperCase() + lv.slice(1)}
                      </button>
                    );
                  })}
                </div>
              </li>
            );
          })}
        </ul>
      </fieldset>
    </FormShell>
  );
}
