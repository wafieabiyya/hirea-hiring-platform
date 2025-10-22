"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

type SelectDropdownProps = {
  label?: string;
  required?: boolean;
  placeholder?: string;
  options: string[];
  value: string | null;
  onChange: (val: string) => void;
  className?: string;
};

export default function SelectDropdown({
  label,
  required = false,
  placeholder = "Select...",
  options,
  value,
  onChange,
  className = "",
}: SelectDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className={`relative w-full ${className}`}>
      {label && (
        <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
          <span>{label}</span>
          {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="mt-2 flex w-full items-center justify-between rounded-md border-2 border-[#E0E0E0] bg-white px-3 py-2 text-sm text-gray-700 focus:border-[#01959F] focus:ring-1 focus:ring-[#01959F] focus:outline-none"
      >
        <span className={value ? "text-gray-900" : "text-gray-400"}>
          {value || placeholder}
        </span>
        <ChevronDown
          className={`ml-2 h-4 w-4 text-gray-500 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <ul className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg">
          {options.map((opt) => (
            <li
              key={opt}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className={`cursor-pointer px-4 py-2 text-sm hover:bg-[#F5FBFB] ${
                value === opt ? "text-[#01959F] font-medium bg-[#E6F7F8]" : ""
              }`}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
