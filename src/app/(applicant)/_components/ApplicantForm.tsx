"use client";

import Image from "next/image";
import { ArrowLeft, Upload } from "lucide-react";
import FormShell from "@/shared/ui/FormShel";
import { useMemo, useState, FormEvent } from "react";
import { Form } from "@/shared/ui/Form";
import Button from "@/shared/ui/Button";
import DomicileSelect from "@/features/candidates/ui/DomicileSelect";
import PhoneInput from "@/features/candidates/ui/PhoneInput";
import DOBInput from "@/features/candidates/ui/DOBInput";
import TakePictureModal from "@/features/candidates/components/TakePictureModal";
import { FieldLevel } from "@/features/jobs/types/job";

type FieldSpec = { key: string; validation?: { required?: boolean } };

type ApplicantFormProps = {
  jobTitle: string;
  company: string;
  fields: FieldSpec[];
  levels?: Record<string, FieldLevel>;
  onClose: () => void;
  onSubmit?: (
    payload: Record<string, FormDataEntryValue>,
  ) => Promise<void> | void;
};

const ID_DOMICILES = [
  "Kota Jakarta Pusat - DKI Jakarta",
  "Kota Jakarta Utara - DKI Jakarta",
  "Kota Jakarta Barat - DKI Jakarta",
  "Kota Jakarta Selatan - DKI Jakarta",
  "Kota Jakarta Timur - DKI Jakarta",
  "Kota Bandung - Jawa Barat",
  "Kota Bekasi - Jawa Barat",
  "Kota Depok - Jawa Barat",
  "Kota Bogor - Jawa Barat",
  "Kota Surabaya - Jawa Timur",
  "Kota Yogyakarta - DI Yogyakarta",
  "Kota Semarang - Jawa Tengah",
];

export default function ApplicantForm({
  jobTitle,
  company,
  fields,
  levels = {},
  onClose,
  onSubmit,
}: ApplicantFormProps) {
  const [domicile, setDomicile] = useState<string>("");
  const [dob, setDob] = useState<Date | null>(null);
  const [phone, setPhone] = useState<{
    country: "ID" | "MY" | "SG";
    local: string;
  }>({
    country: "ID",
    local: "",
  });
  const [photo, setPhoto] = useState<string | null>(null);
  const [openTakePic, setOpenTakePic] = useState(false);

  const reqConfigMap = useMemo(() => {
    const m: Record<string, boolean> = {};
    for (const f of fields) m[f.key] = !!f.validation?.required;
    return m;
  }, [fields]);

  const has = (k: string) => {
    if (k in levels) return levels[k] !== "off";

    return fields.some((f) => f.key === k);
  };

  const isReq = (k: string) => {
    if (k in levels) return levels[k] === "mandatory";
    return !!reqConfigMap[k];
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    if (has("photo_profile") && photo) fd.set("photo_profile", photo);
    if (has("phone_number")) fd.set("phone_number", JSON.stringify(phone));
    if (has("date_of_birth") && dob) {
      const iso = new Date(
        Date.UTC(dob.getFullYear(), dob.getMonth(), dob.getDate()),
      )
        .toISOString()
        .slice(0, 10);
      fd.set("date_of_birth", iso);
    }

    const payload = Object.fromEntries(fd.entries()) as Record<
      string,
      FormDataEntryValue
    >;
    await onSubmit?.(payload);
  };

  return (
    <FormShell
      title={`Apply ${jobTitle} at ${company}`}
      onClose={onClose}
      onSubmit={handleSubmit}
      className="border-none"
      backButton={
        <button type="button" onClick={onClose} className="cursor-pointer p-1">
          <ArrowLeft
            className="rounded-md border border-[#E0E0E0] px-1 shadow-md"
            size={29}
          />
        </button>
      }
      rightInfo={
        <span className="flex items-center gap-1 text-xs text-gray-500">
          <span className="text-sm leading-6 tracking-normal text-[#01959F]">
            ℹ️
          </span>{" "}
          This field required to fill
        </span>
      }
      primaryAction={
        <Button type="submit" variant="primary" size="md" fullWidth>
          Submit
        </Button>
      }
    >
      {/* photo_profile */}
      {has("photo_profile") && (
        <Form.Row label="Photo Profile" required={isReq("photo_profile")}>
          <div className="my-5 flex flex-col items-start gap-4">
            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-gray-100 ring-1 ring-gray-200">
              {photo ? (
                <Image
                  src={photo}
                  alt="Preview"
                  width={80}
                  height={80}
                  className="h-20 w-20 object-cover"
                />
              ) : (
                <Image
                  src="/avatar-male.png"
                  alt="Preview"
                  width={80}
                  height={80}
                  className="h-20 w-20 object-cover"
                />
              )}
            </div>

            <button
              type="button"
              onClick={() => setOpenTakePic(true)}
              className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-bold shadow-sm hover:bg-gray-50"
            >
              <Upload className="h-4 w-4" />
              Take a Picture
            </button>
          </div>

          {photo && <input type="hidden" name="photo_profile" value={photo} />}

          <TakePictureModal
            open={openTakePic}
            onClose={() => setOpenTakePic(false)}
            onSubmit={(dataUrl) => {
              setPhoto(dataUrl);
              setOpenTakePic(false);
            }}
          />
        </Form.Row>
      )}

      {/* full_name */}
      {has("full_name") && (
        <Form.Row label="Full name" required={isReq("full_name")}>
          <div className="mb-2">
            <Form.Input
              name="full_name"
              placeholder="Enter your full name"
              required={isReq("full_name")}
            />
          </div>
        </Form.Row>
      )}

      {/* dob */}
      {has("date_of_birth") && (
        <Form.Row label="Date of Birth" required={isReq("date_of_birth")}>
          <div className="mb-4">
            <DOBInput
              value={dob}
              onChange={setDob}
              required={isReq("date_of_birth")}
            />
          </div>
        </Form.Row>
      )}

      {/* gender */}
      {has("gender") && (
        <Form.Row label="Pronoun (Gender)" required={isReq("gender")}>
          <div className="mb-4 flex items-center gap-6 text-sm">
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="gender"
                value="female"
                className="accent-[#01959F]"
                required={isReq("gender")}
              />
              She/her (Female)
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="gender"
                value="male"
                className="accent-[#01959F]"
              />
              He/him (Male)
            </label>
          </div>
        </Form.Row>
      )}

      {/* dom */}
      {has("domicile") && (
        <Form.Row label="Domicile" required={isReq("domicile")}>
          <DomicileSelect
            name="domicile"
            value={domicile || null}
            onChange={setDomicile}
            options={ID_DOMICILES}
            placeholder="Choose your domicile"
            className="mb-4"
            required={isReq("domicile")}
          />
        </Form.Row>
      )}

      {/* phone */}
      {has("phone_number") && (
        <Form.Row label="Phone Number" required={isReq("phone_number")}>
          <div className="mb-4">
            <PhoneInput
              value={phone}
              onChange={setPhone}
              required={isReq("phone_number")}
            />
          </div>
        </Form.Row>
      )}

      {/* email */}
      {has("email") && (
        <Form.Row label="Email" required={isReq("email")}>
          <div className="mb-2">
            <Form.Input
              name="email"
              type="email"
              placeholder="Enter your email address"
              required={isReq("email")}
            />
          </div>
        </Form.Row>
      )}

      {/* linkedin */}
      {has("linkedin_link") && (
        <Form.Row label="Link LinkedIn" required={isReq("linkedin_link")}>
          <div className="mb-2">
            <Form.Input
              name="linkedin_link"
              type="url"
              placeholder="https://linkedin.com/in/username"
              required={isReq("linkedin_link")}
            />
          </div>
        </Form.Row>
      )}
    </FormShell>
  );
}
