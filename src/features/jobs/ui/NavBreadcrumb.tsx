"use client";

import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NavBreadcrumb({
  items,
  right,
}: {
  items: { label: string; href?: string }[];
  right?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <header className="sticky top-0 z-40 border-b border-[#E0E0E0] bg-white px-6 py-4">
      <div className="flex items-center justify-between">
        <nav className="flex items-center gap-2 text-sm">
          {items.map((it, i) => (
            <span
              key={i}
              className="flex items-center gap-2 text-sm leading-6 tracking-normal"
            >
              {it.href ? (
                <Link
                  href={it.href}
                  className="rounded-md border border-[#E0E0E0] shadow-sm px-3 py-1 hover:bg-gray-50"
                >
                  {it.label}
                </Link>
              ) : (
                <span className="rounded-md border border-[#C2C2C2] bg-[#EDEDED] px-3 py-1">
                  {it.label}
                </span>
              )}
              {i < items.length - 1 && (
                <ChevronRightIcon className="h-4 w-4 text-gray-400" />
              )}
            </span>
          ))}
        </nav>

        {right ?? (
          <div className="relative flex items-center gap-3">
            <button
              onClick={() => setOpen(!open)}
              className="relative flex h-7 w-7 items-center justify-center overflow-hidden rounded-full border border-[#E0E0E0]"
            >
              <Image
                src="/images/avatar-placeholder.png"
                alt="Admin"
                width={28}
                height={28}
                className="rounded-full object-cover"
              />
            </button>

            {open && (
              <div className="absolute right-0 top-12 w-40 rounded-md border bg-white p-2 shadow-md">
                <button
                  onClick={() => router.push("/profile")}
                  className="block w-full rounded px-3 py-2 text-left text-sm hover:bg-gray-50"
                >
                  Profile
                </button>
                <button
                  onClick={() => router.push("/logout")}
                  className="block w-full rounded px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
