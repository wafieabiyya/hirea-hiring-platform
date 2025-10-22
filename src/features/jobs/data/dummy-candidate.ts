export type Candidate = {
  name: string;
  email: string;
  phone: string;
  gender: "Male" | "Female";
  linkedin: string;
  domicile: string;
  appliedAt: string; // ISO
};

export const candidates: Candidate[] = Array.from({ length: 10 }).map(
  (_, i) => ({
    name:
      ["Aurelie Yukiko", "Ditya Hendyawan", "Mira Workman", "Paityn Culhane"][
        i % 4
      ] +
      " " +
      (i + 1),
    email: `person${i + 1}@example.com`,
    phone: "08" + String(120000000 + i),
    gender: i % 2 ? "Male" : "Female",
    linkedin: "https://www.linkedin.com/in/user-" + (i + 1),
    domicile: "Jakarta",
    appliedAt: new Date(2025, 0, (i % 28) + 1).toISOString(),
  }),
);
