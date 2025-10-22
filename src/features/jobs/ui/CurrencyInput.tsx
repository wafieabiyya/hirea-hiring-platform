"use client";

import { useEffect, useRef, useState } from "react";
import { fIDR } from "../utils/job-helpers";

function digitsOnly(s: string) {
  return s.replace(/[^\d]/g, "");
}

export default function CurrencyInput({
  value,
  onChange,
  placeholder = "0",
  className = "",
  name,
  autoFocus,
  required,
  disabled,
}: {
  value: number | null;
  onChange: (v: number | null) => void;
  placeholder?: string;
  className?: string;
  name?: string;
  autoFocus?: boolean;
  required?: boolean;
  disabled?: boolean;
}) {
  const [display, setDisplay] = useState<string>(fIDR(value));
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDisplay(fIDR(value));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = digitsOnly(e.target.value);
    const num = raw.length ? Number(raw) : null;
    onChange(num);
    setDisplay(num === null ? "" : fIDR(num));

    requestAnimationFrame(() => {
      const el = ref.current;
      if (!el) return;
      const len = el.value.length;
      el.setSelectionRange(len, len);
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowed = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"];
    if (allowed.includes(e.key)) return;
    if (/^\d$/.test(e.key)) return;

    if (
      (e.ctrlKey || e.metaKey) &&
      ["a", "c", "v", "x"].includes(e.key.toLowerCase())
    )
      return;
    e.preventDefault();
  };

  const handleBlur = () => {
    const raw = digitsOnly(display);
    const num = raw.length ? Number(raw) : null;
    onChange(num);
    setDisplay(fIDR(num));
  };

  return (
    <div
      className={`flex items-center gap-1 rounded-md border-2 border-[#E0E0E0] px-3 py-2 ${className}`}
    >
      <span className="font-semibold text-gray-900">Rp</span>

      <input
        ref={ref}
        type="text"
        autoFocus={autoFocus}
        inputMode="numeric"
        placeholder={placeholder}
        value={display}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        disabled={disabled}
        className="w-full border-none bg-transparent p-0 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none"
        aria-required={required}
        aria-invalid={required && (value === null || value === undefined)}
      />

      {name ? <input type="hidden" name={name} value={value ?? ""} /> : null}
    </div>
  );
}
