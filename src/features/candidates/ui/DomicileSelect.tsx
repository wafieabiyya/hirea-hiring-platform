// DomicileSelect.tsx
"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

type Props = {
  value: string | null;
  onChange: (val: string) => void;
  options: string[];
  placeholder?: string;
  name?: string;
  className?: string;
  onCreateOption?: (val: string) => void;
  // ⬇️ baru
  required?: boolean;
};

export default function DomicileSelect({
  value,
  onChange,
  options,
  placeholder = "Choose your domicile",
  name,
  className = "",
  onCreateOption,
  required, // baru
}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [localOptions, setLocalOptions] = useState<string[]>(options);

  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => setLocalOptions(options), [options]);

  const sorted = useMemo(
    () => Array.from(new Set(localOptions)).sort((a, b) => a.localeCompare(b)),
    [localOptions],
  );

  const filtered = useMemo(() => {
    if (!query) return sorted;
    const q = query.toLowerCase();
    return sorted.filter((v) => v.toLowerCase().includes(q));
  }, [sorted, query]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const pick = (val: string) => {
    setQuery(val);
    onChange(val);
    setActiveIndex(0);
    setTimeout(() => {
      setOpen(false);
      setQuery("");
    }, 50);
  };

  const addCustom = (raw: string) => {
    const val = raw.trim();
    if (!val) return;
    if (!localOptions.includes(val)) {
      setLocalOptions((prev) => [...prev, val]);
      onCreateOption?.(val);
    }
    pick(val);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter")) {
      setOpen(true);
      setTimeout(() => inputRef.current?.select(), 0);
      return;
    }
    if (!open) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, Math.max(filtered.length - 1, 0)));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    }
    if (e.key === "Enter") {
      e.preventDefault();
      if (filtered.length > 0) {
        pick(filtered[activeIndex] ?? filtered[0]);
      } else if (query.trim()) {
        addCustom(query);
      }
    }
    if (e.key === "Escape") setOpen(false);
  };

  const displayText = value || "";

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      {/* input "invisible" untuk validasi native & FormData */}
      {name && (
        <input
          name={name}
          value={value ?? ""}
          readOnly
          required={required}
          className="absolute -left-[9999px] -top-[9999px] h-0 w-0 opacity-0 pointer-events-none"
        />
      )}

      <div
        className={[
          "flex w-full items-center rounded-md border-2 px-3 py-2",
          "bg-white text-sm outline-none transition",
          open
            ? "border-[#01959F]"
            : "border-[#E0E0E0] focus-within:border-[#01959F]",
        ].join(" ")}
        onClick={() => {
          setOpen(true);
          setTimeout(() => inputRef.current?.focus(), 0);
        }}
        aria-required={required ? true : undefined}
      >
        <input
          ref={inputRef}
          value={open ? query : displayText}
          onChange={(e) => {
            setQuery(e.target.value);
            setActiveIndex(0);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          className={[
            "w-full border-0 p-0 text-sm outline-none",
            value ? "text-gray-900" : "text-gray-400",
          ].join(" ")}
        />
        <ChevronDown
          className={`ml-2 h-4 w-4 text-gray-500 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </div>

      {open && (
        <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
          <ul className="max-h-60 overflow-y-auto py-1">
            {filtered.length > 0 ? (
              filtered.map((opt, i) => (
                <li key={opt}>
                  <button
                    type="button"
                    onMouseEnter={() => setActiveIndex(i)}
                    onClick={() => pick(opt)}
                    className={[
                      "block w-full px-4 py-3 text-left text-sm",
                      i === activeIndex ? "bg-[#F7FEFF]" : "hover:bg-[#F7FEFF]",
                      "text-gray-800",
                    ].join(" ")}
                  >
                    {opt}
                  </button>
                </li>
              ))
            ) : (
              <li className="px-4 py-3 text-sm text-gray-600">
                <div className="flex items-center justify-between">
                  <span>No results.</span>
                  {query.trim() && (
                    <button
                      type="button"
                      className="rounded-md border px-2 py-1 text-xs text-[#01959F] hover:bg-[#F5FBFB]"
                      onClick={() => addCustom(query)}
                    >
                      Add “{query.trim()}”
                    </button>
                  )}
                </div>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
