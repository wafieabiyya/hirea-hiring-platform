"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Search } from "lucide-react";

type CountryCode = "ID" | "MY" | "SG";
type PhoneValue = { country: CountryCode; local: string };

const COUNTRIES: Record<
  CountryCode,
  { name: string; dial: string; flag: string }
> = {
  ID: { name: "Indonesia", dial: "+62", flag: "🇮🇩" },
  MY: { name: "Malaysia", dial: "+60", flag: "🇲🇾" },
  SG: { name: "Singapore", dial: "+65", flag: "🇸🇬" },
};

const COUNTRY_LIST = (
  Object.entries(COUNTRIES) as [CountryCode, typeof COUNTRIES.ID][]
).map(([code, v]) => ({ code, ...v }));

export default function PhoneInput({
  value,
  onChange,
  placeholder = "81XXXXXXXXX",
  className = "",
  disabled,
  required,
}: {
  value: PhoneValue;
  onChange: (v: PhoneValue) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const searchRef = useRef<HTMLInputElement | null>(null);

  // close on outside click
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  // focus the search field when dropdown opens
  useEffect(() => {
    if (!open) return;
    requestAnimationFrame(() => searchRef.current?.focus());
  }, [open]);

  const selected = COUNTRIES[value.country];

  // live filtered list
  const q = query.trim().toLowerCase();
  const qDial = query.replace(/[^\d]/g, "");
  const filtered = COUNTRY_LIST.filter((i) => {
    if (!q) return true;
    const nameHit = i.name.toLowerCase().includes(q);
    const dialHit = i.dial.replace("+", "").includes(qDial);
    return nameHit || (!!qDial && dialHit);
  });

  const pick = (code: CountryCode) => {
    onChange({ ...value, country: code });
    setOpen(false);

    requestAnimationFrame(() => inputRef.current?.focus());
  };

  return (
    <div
      ref={wrapRef}
      className={[
        "relative flex w-full items-center rounded-md border-2 border-[#E0E0E0] bg-white text-sm focus-within:border-[#01959F]",
        disabled ? "opacity-60" : "",
        className,
      ].join(" ")}
    >
      {/* Country trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          setOpen((p) => !p);
          if (!open) setQuery(""); // reset query when opening
        }}
        className="flex h-10 min-w-14 items-center gap-2 rounded-l-md px-2"
        aria-label="Select country"
      >
        <span className="text-lg leading-none">{selected.flag}</span>
        <ChevronDown
          className={`h-4 w-4 text-gray-500 transition ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Separator */}
      <span aria-hidden className="mx-2 h-5 w-px bg-[#E0E0E0]" />

      {/* Fixed dial */}
      <span className="mr-2 whitespace-nowrap text-gray-900">
        {selected.dial}
      </span>

      {/* Local number input */}
      <input
        ref={inputRef}
        type="tel"
        inputMode="numeric"
        pattern="[0-9]*"
        placeholder={placeholder}
        value={value.local}
        onChange={(e) =>
          onChange({ ...value, local: e.target.value.replace(/\D/g, "") })
        }
        required={required}
        disabled={disabled}
        className="h-10 flex-1 rounded-r-md px-2 outline-none placeholder:text-gray-400"
      />

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 top-12 z-30 w-80 rounded-lg border border-gray-200 bg-white shadow-lg">
          <div className="p-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <input
                ref={searchRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    e.stopPropagation();
                    if (filtered.length > 0) pick(filtered[0].code);
                  }

                  if (e.key === "Escape") {
                    e.preventDefault();
                    e.stopPropagation();
                    setOpen(false);
                  }
                }}
                placeholder="Search"
                className="h-9 w-full rounded-md border border-gray-200 pl-8 pr-2 text-sm outline-none focus:border-[#01959F]"
              />
            </div>
          </div>
          <div className="border-[1px] border-[#E0E0E0] mb-2" />
          <ul className="max-h-64 overflow-auto py-1">
            {filtered.length === 0 && (
              <li className="px-3 py-2 text-sm text-gray-500">No results</li>
            )}
            {filtered.map((c) => {
              const active = c.code === value.country;
              return (
                <li key={c.code}>
                  <button
                    type="button"
                    className={`flex w-full items-center justify-between gap-3 px-3 py-2 text-left hover:bg-[#F5FBFB] ${
                      active ? "bg-[#E6F7F8] font-medium text-[#01959F]" : ""
                    }`}
                    onClick={() => pick(c.code)}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-lg leading-none">{c.flag}</span>
                      {c.name}
                    </span>
                    <span className="text-gray-500">{c.dial}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

export function toE164(v: PhoneValue) {
  return `${COUNTRIES[v.country].dial}${v.local}`;
}
