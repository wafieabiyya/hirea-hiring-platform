import type { ReactNode } from "react";
import HeaderSwitch from "../_components/HeaderSwitcher";

export const metadata = {
  title: "Admin • HireA",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh flex flex-col bg-gray-50">
      <HeaderSwitch />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
