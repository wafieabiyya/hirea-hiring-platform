"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Calendar as CalendarIcon,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

type Props = {
  value: Date | null;
  onChange: (d: Date) => void;
  placeholder?: string;
  className?: string;
  minDate?: Date;
  maxDate?: Date;
  required?: boolean;
  name?: string;
};

function fmt(d: Date) {
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// helper ke YYYY-MM-DD (untuk nilai yang dikirim)
function toISODate(d: Date | null) {
  if (!d) return "";
  const iso = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
    .toISOString()
    .slice(0, 10);
  return iso; // "YYYY-MM-DD"
}

export default function DOBInput({
  value,
  onChange,
  placeholder = "Select your date of birth",
  className = "",
  minDate,
  maxDate,
  // ⬇️ baru
  required,
  name,
}: Props) {
  const today = useMemo(() => new Date(), []);
  const _min = useMemo(() => minDate ?? new Date(1900, 0, 1), [minDate]);
  const _max = useMemo(
    () =>
      maxDate ? new Date(Math.min(maxDate.getTime(), today.getTime())) : today,
    [maxDate, today],
  );

  const [open, setOpen] = useState(false);
  const [view, setView] = useState<Date>(value ?? _max);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  // close on outside click / esc
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  // helpers
  const monthStart = new Date(view.getFullYear(), view.getMonth(), 1);
  const monthEnd = new Date(view.getFullYear(), view.getMonth() + 1, 0);
  const startDay = monthStart.getDay(); // 0=Sun
  const daysInMonth = monthEnd.getDate();

  const prevMonth = () =>
    setView(new Date(view.getFullYear(), view.getMonth() - 1, 1));
  const nextMonth = () =>
    setView(new Date(view.getFullYear(), view.getMonth() + 1, 1));
  const prevYear = () =>
    setView(new Date(view.getFullYear() - 1, view.getMonth(), 1));
  const nextYear = () =>
    setView(new Date(view.getFullYear() + 1, view.getMonth(), 1));

  function isDisabled(date: Date) {
    return date < _min || date > _max;
  }
  function isSameDate(a: Date, b: Date) {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  }

  const cells: (Date | null)[] = useMemo(() => {
    const arr: (Date | null)[] = [];
    for (let i = 0; i < startDay; i++) arr.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      arr.push(new Date(view.getFullYear(), view.getMonth(), d));
    }
    return arr;
  }, [startDay, daysInMonth, view]);

  const valueStr = toISODate(value);

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      {/* input "invisible" untuk validasi native & FormData */}
      {name && (
        <input
          name={name}
          value={valueStr}
          readOnly
          // required tidak berlaku pada type="hidden", jadi pakai input biasa yang visually hidden:
          className="absolute -left-[9999px] -top-[9999px] h-0 w-0 opacity-0 pointer-events-none"
          required={required}
        />
      )}

      {/* trigger */}
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="flex w-full items-center justify-between rounded-md border-2 border-[#E0E0E0] px-3 py-2 text-left text-sm outline-none focus:border-[#01959F]"
      >
        <span className="flex items-center gap-2 text-gray-700">
          <CalendarIcon className="h-4 w-4 text-gray-500" />
          {value ? (
            <span className="text-gray-900">{fmt(value)}</span>
          ) : (
            <span className="text-gray-400">{placeholder}</span>
          )}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-gray-500 transition ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* popover */}
      {open && (
        <div className="absolute z-30 mt-2 w-[320px] rounded-xl border border-gray-200 bg-white p-3 shadow-xl">
          {/* header nav */}
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={prevYear}
                className="rounded p-1 hover:bg-gray-100"
                aria-label="Previous year"
              >
                <ChevronsLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={prevMonth}
                className="rounded p-1 hover:bg-gray-100"
                aria-label="Previous month"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            </div>

            <div className="select-none text-sm font-semibold">
              {view.toLocaleString("en-US", { month: "short" })}{" "}
              {view.getFullYear()}
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={nextMonth}
                className="rounded p-1 hover:bg-gray-100"
                aria-label="Next month"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={nextYear}
                className="rounded p-1 hover:bg-gray-100"
                aria-label="Next year"
              >
                <ChevronsRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* weekday header */}
          <div className="grid grid-cols-7 gap-1 px-1 pb-1 text-center text-[11px] font-medium text-gray-500">
            {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
              <div key={`${d}-${i}`}>{d}</div>
            ))}
          </div>

          {/* days grid */}
          <div className="grid grid-cols-7 gap-1">
            {cells.map((d, idx) => {
              if (!d) return <div key={`empty-${idx}`} />;
              const disabled = isDisabled(d);
              const selected = value && isSameDate(d, value);
              return (
                <button
                  key={d.toISOString()}
                  type="button"
                  disabled={disabled}
                  onClick={() => {
                    onChange(d);
                    setOpen(false);
                  }}
                  className={[
                    "h-8 rounded-md text-sm",
                    selected
                      ? "bg-[#01959F] font-semibold text-white"
                      : "hover:bg-gray-100",
                    disabled
                      ? "cursor-not-allowed opacity-40 hover:bg-transparent"
                      : "",
                  ].join(" ")}
                >
                  {d.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
