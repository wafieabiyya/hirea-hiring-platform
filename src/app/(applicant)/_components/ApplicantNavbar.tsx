"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function ApplicantNavbar() {
  const [openProfile, setOpenProfile] = useState(false);
  const [openNav, setOpenNav] = useState(false); // mobile menu
  const router = useRouter();

  const profileRef = useRef<HTMLDivElement>(null);

  // close profile dropdown on outside click / ESC
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!profileRef.current) return;
      if (!profileRef.current.contains(e.target as Node)) {
        setOpenProfile(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpenProfile(false);
        setOpenNav(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E0E0E0] bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Left: Logo */}
        <div className="flex items-center gap-3">
          <Link
            href="/jobs"
            className="text-lg font-bold text-[#01959F] hover:opacity-90"
          >
            Hirea
          </Link>
        </div>

        {/* Middle: Desktop menu */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link href="/jobs" className="hover:text-[#01959F]">
            Jobs
          </Link>
          <Link href="/applicant/applications" className="hover:text-[#01959F]">
            My Applications
          </Link>
        </div>

        {/* Right: Mobile hamburger + Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile hamburger (hidden on md+) */}
          <button
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={openNav}
            onClick={() => setOpenNav((v) => !v)}
            className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 hover:bg-gray-50 active:scale-[0.98] transition"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              {openNav ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M3 6h18M3 12h18M3 18h18" />
              )}
            </svg>
          </button>

          {/* Profile */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setOpenProfile((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={openProfile}
              className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-gray-300"
            >
              <Image
                src="/avatar-male.png"
                alt="User"
                width={36}
                height={36}
                className="h-9 w-9 rounded-full object-cover"
              />
            </button>

            {/* Profile dropdown */}
            {openProfile && (
              <div
                role="menu"
                className="absolute right-0 top-11 w-44 rounded-md border border-[#E0E0E0] bg-white p-2 shadow-md"
              >
                <button
                  onClick={() => {
                    setOpenProfile(false);
                    router.push("/applicant/profile");
                  }}
                  className="block w-full rounded px-3 py-2 text-left text-sm hover:bg-gray-50"
                  role="menuitem"
                >
                  Profile
                </button>
                <button
                  onClick={() => {
                    setOpenProfile(false);
                    router.push("/logout");
                  }}
                  className="block w-full rounded px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                  role="menuitem"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile menu (collapsible) */}
      <div
        className={[
          "md:hidden border-t border-[#E0E0E0] bg-white transition-[grid-template-rows] duration-200",
          openNav ? "grid grid-rows-[1fr]" : "grid grid-rows-[0fr]",
        ].join(" ")}
      >
        <div className="overflow-hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3 text-sm font-medium text-gray-700 sm:px-6">
            <Link
              href="/jobs"
              onClick={() => setOpenNav(false)}
              className="rounded px-2 py-2 hover:bg-gray-50"
            >
              Jobs
            </Link>
            <Link
              href="/applicant/applications"
              onClick={() => setOpenNav(false)}
              className="rounded px-2 py-2 hover:bg-gray-50"
            >
              My Applications
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
