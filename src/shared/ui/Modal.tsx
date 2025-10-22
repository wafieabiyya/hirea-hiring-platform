"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Modal({
  children,
  onCloseHref = "/jobs",
  closeOnBackdrop = true,
}: {
  children: React.ReactNode;
  onCloseHref?: string;
  closeOnBackdrop?: boolean;
}) {
  const router = useRouter();

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") router.push(onCloseHref);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [router, onCloseHref]);

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {closeOnBackdrop && (
        <div
          className="absolute inset-0"
          onClick={() => router.push(onCloseHref)}
        />
      )}

      <div className="relative flex flex-col h-full w-full max-w-3xl  mx-auto">
        {children}
      </div>
    </div>
  );
}
