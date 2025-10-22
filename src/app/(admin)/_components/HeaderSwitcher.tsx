"use client";

import { usePathname } from "next/navigation";
import AdminNavbar from "./AdminNavbar";
import NavBreadcrumb from "@/features/jobs/ui/NavBreadcrumb";

export default function HeaderSwitch() {
  const pathname = usePathname();

  const isJobDetail = /^\/(?:admin\/)?jobs\/[^/]+(?:\/|$)/.test(pathname);

  if (isJobDetail) {
    const jobsListHref = pathname.startsWith("/admin")
      ? "/admin/jobs"
      : "/jobs";

    return (
      <NavBreadcrumb
        items={[
          { label: "Job list", href: jobsListHref },
          { label: "Manage Candidate" },
        ]}
      />
    );
  }

  // default header
  return <AdminNavbar />;
}
