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
  logo?: string;
  location: string;
  minSalary?: number;
  maxSalary?: number;
  type: JobType;
  tags?: string[];
  postedAt: string; // ISO
  description: string;
};

export const JOBS: Job[] = [
  {
    id: "1",
    title: "UX Designer",
    company: "Rakamin",
    logo: "/images/company-placeholder.png",
    location: "Jakarta Selatan",
    minSalary: 7000000,
    maxSalary: 15000000,
    type: "Full-time",
    tags: ["Remote"],
    postedAt: new Date(Date.now() - 2 * 86400000).toISOString(), // 2 days ago
    description:
      "• Develop, test, and maintain responsive, high-performance web applications using modern front-end technologies.\n• Collaborate with UI/UX designers to translate wireframes into functional code.\n• Integrate front-end components with APIs and backend services.\n• Ensure cross-browser compatibility and follow best practices.\n• Participate in code reviews and improve application quality.",
  },
  {
    id: "2",
    title: "Frontend Engineer Intern",
    company: "Acme",
    logo: "/images/company-placeholder.png",
    location: "Jakarta",
    minSalary: 3000000,
    maxSalary: 5000000,
    type: "Intern",
    tags: ["On-site"],
    postedAt: new Date(Date.now() - 6 * 86400000).toISOString(),
    description:
      "• Assist in developing UI components.\n• Learn modern tooling and testing.\n• Collaborate with senior engineers.",
  },
  {
    id: "3",
    title: "Backend Engineer",
    company: "Techify",
    logo: "/images/company-placeholder.png",
    location: "Bandung",
    minSalary: 12000000,
    maxSalary: 18000000,
    type: "Full-time",
    tags: ["Remote"],
    postedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    description:
      "• Build scalable services and APIs.\n• Write clean, maintainable code.\n• Monitor performance and reliability.",
  },
  {
    id: "4",
    title: "Content Writer (Freelance)",
    company: "WriteWell",
    logo: "/images/company-placeholder.png",
    location: "Remote",
    type: "Freelance",
    postedAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    description:
      "• Create SEO-friendly content.\n• Collaborate with marketing team.\n• Manage content calendar.",
  },
  {
    id: "5",
    title: "Content Writer (Freelance)",
    company: "WriteWell",
    logo: "/images/company-placeholder.png",
    location: "Remote",
    type: "Freelance",
    postedAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    description:
      "• Create SEO-friendly content.\n• Collaborate with marketing team.\n• Manage content calendar.",
  },
  {
    id: "6",
    title: "Content Writer (Freelance)",
    company: "WriteWell",
    logo: "/images/company-placeholder.png",
    location: "Remote",
    type: "Freelance",
    postedAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    description:
      "• Create SEO-friendly content.\n• Collaborate with marketing team.\n• Manage content calendar.",
  },
  {
    id: "7",
    title: "Content Writer (Freelance)",
    company: "WriteWell",
    logo: "/images/company-placeholder.png",
    location: "Remote",
    type: "Freelance",
    postedAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    description:
      "• Create SEO-friendly content.\n• Collaborate with marketing team.\n• Manage content calendar.",
  },
  {
    id: "8",
    title: "Content Writer (Freelance)",
    company: "WriteWell",
    logo: "/images/company-placeholder.png",
    location: "Remote",
    type: "Freelance",
    postedAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    description:
      "• Create SEO-friendly content.\n• Collaborate with marketing team.\n• Manage content calendar.",
  },
  {
    id: "9",
    title: "Content Writer (Freelance)",
    company: "WriteWell",
    logo: "/images/company-placeholder.png",
    location: "Remote",
    type: "Freelance",
    postedAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    description:
      "• Create SEO-friendly content.\n• Collaborate with marketing team.\n• Manage content calendar.",
  },
  {
    id: "10",
    title: "Content Writer (Freelance)",
    company: "WriteWell",
    logo: "/images/company-placeholder.png",
    location: "Remote",
    type: "Freelance",
    postedAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    description:
      "• Create SEO-friendly content.\n• Collaborate with marketing team.\n• Manage content calendar.",
  },
];
