import type { ReactNode } from "react";
import ApplicantNavbar from "./_components/ApplicantNavbar";

export default function ApplicantLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh flex flex-col bg-gray-50">
      <ApplicantNavbar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
