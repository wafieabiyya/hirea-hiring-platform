"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

export default function AdminNavbar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b bg-white border-[#E0E0E0]  px-4 ">
      <nav className="flex items-center gap-4">
        <h1 className="text-lg font-bold text-[#1E1F21] leading-[18px] tacking-[0px]">
          Job List
        </h1>
      </nav>

      {/*  admin profile */}
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
    </header>
  );
}
