type Attr = { key: string; value: string | null };

const DIAL: Record<"ID" | "MY" | "SG", string> = {
  ID: "+62",
  MY: "+60",
  SG: "+65",
};

function attr(attrs: Attr[], key: string) {
  const a = attrs.find((x) => x.key === key);
  return a?.value ?? null;
}

function formatPhone(raw: string | null) {
  if (!raw) return undefined;
  try {
    const obj = JSON.parse(raw) as {
      country?: "ID" | "MY" | "SG";
      local?: string;
    };
    if (obj?.country && obj?.local) return `${DIAL[obj.country]} ${obj.local}`;
  } catch {}
  return raw || undefined;
}

export type CandidateRow = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  domicile?: string;
  gender?: string;
  linkedin?: string;
  appliedAt: string;
  photo_profile?: string;
};

export function toCandidateRows(res: {
  data: Array<{ id: string; applied_at: string; attributes: Attr[] }>;
}): CandidateRow[] {
  return res.data.map((c) => {
    const attrs = c.attributes;
    const genderRaw = attr(attrs, "gender") || undefined;
    const phoneRaw = attr(attrs, "phone_number");

    return {
      id: c.id,
      name: attr(attrs, "full_name") ?? "",
      email: attr(attrs, "email") ?? "",
      phone: formatPhone(phoneRaw),
      domicile: attr(attrs, "domicile") || undefined,
      gender:
        genderRaw === "female"
          ? "Female"
          : genderRaw === "male"
          ? "Male"
          : undefined,
      linkedin: attr(attrs, "linkedin_link") || undefined,
      appliedAt: c.applied_at,
      photo_profile: attr(attrs, "photo_profile") || undefined,
    };
  });
}
