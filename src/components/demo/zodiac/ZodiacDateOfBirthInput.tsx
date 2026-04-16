"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  daysInMonth,
  isValidCalendarDate,
} from "./zodiac-sun-sign";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

const selectClass =
  "zd-headline w-full cursor-pointer appearance-none rounded-none border border-[#4d4635]/50 bg-[#161515] px-3 py-2.5 text-left text-[11px] uppercase tracking-[0.12em] text-[#e5e2e1] transition-colors focus:border-[#f1c97d] focus:outline-none focus:ring-0";

type Props = {
  onDateChange?: (date: Date | null) => void;
};

export function ZodiacDateOfBirthInput({ onDateChange }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const [open, setOpen] = useState(false);
  const currentYear = new Date().getFullYear();
  const minYear = currentYear - 120;
  const [month, setMonth] = useState(1);
  const [day, setDay] = useState(1);
  const [year, setYear] = useState<number | null>(null);

  const yearForDayCount = year ?? 2000;
  const dim = daysInMonth(yearForDayCount, month);
  const safeDay = Math.min(day, dim);

  useEffect(() => {
    if (day !== safeDay) setDay(safeDay);
  }, [day, safeDay]);

  const lastEmittedKey = useRef<string | null>(null);

  useEffect(() => {
    if (year === null || !isValidCalendarDate(year, month, safeDay)) {
      if (lastEmittedKey.current !== null) {
        lastEmittedKey.current = null;
        onDateChange?.(null);
      }
      return;
    }
    const key = `${year}-${month}-${safeDay}`;
    if (lastEmittedKey.current === key) return;
    lastEmittedKey.current = key;
    onDateChange?.(new Date(year, month - 1, safeDay));
  }, [year, month, safeDay, onDateChange]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const displayText = useMemo(() => {
    if (year === null || !isValidCalendarDate(year, month, safeDay)) {
      return null;
    }
    const dt = new Date(year, month - 1, safeDay);
    return dt
      .toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
      .toUpperCase();
  }, [year, month, safeDay]);

  const yearOptions = useMemo(() => {
    const out: number[] = [];
    for (let y = currentYear; y >= minYear; y--) out.push(y);
    return out;
  }, [currentYear, minYear]);

  return (
    <div ref={rootRef} className="relative w-full max-w-md">
      <button
        type="button"
        id={`${listId}-trigger`}
        aria-expanded={open}
        aria-controls={`${listId}-panel`}
        aria-haspopup="dialog"
        onClick={() => setOpen((o) => !o)}
        className={`flex w-full items-center border-b py-4 text-left transition-colors hover:border-[#4d4635]/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f1c97d]/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[#131313] ${
          open ? "border-[#f1c97d]" : "border-[#4d4635]/40"
        }`}
        data-open={open}
      >
        <span className="material-symbols-outlined mr-4 shrink-0 text-[#e9c176]">
          calendar_today
        </span>
        <span
          className={`zd-headline flex-1 text-sm uppercase tracking-[0.2em] ${
            displayText ? "text-[#e5e2e1]" : "text-white/25"
          }`}
        >
          {displayText ?? "DATE OF BIRTH"}
        </span>
        <span
          className={`material-symbols-outlined ml-2 text-[#f1c97d]/50 transition-transform ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden
        >
          expand_more
        </span>
      </button>

      {open ? (
        <div
          id={`${listId}-panel`}
          role="group"
          aria-label="Choose date of birth"
          className="absolute left-0 right-0 z-40 mt-3 border border-[#4d4635]/40 bg-[#161515] p-4 shadow-[0_24px_48px_rgba(0,0,0,0.55)] md:p-5"
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
            <label className="block">
              <span className="zd-headline mb-2 block text-[9px] uppercase tracking-[0.2em] text-[#f1c97d]/70">
                Month
              </span>
              <div className="relative">
                <select
                  className={selectClass}
                  value={month}
                  onChange={(e) => setMonth(Number(e.target.value))}
                >
                  {MONTHS.map((name, i) => (
                    <option key={name} value={i + 1}>
                      {name}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#f1c97d]/40 material-symbols-outlined text-lg">
                  unfold_more
                </span>
              </div>
            </label>
            <label className="block">
              <span className="zd-headline mb-2 block text-[9px] uppercase tracking-[0.2em] text-[#f1c97d]/70">
                Day
              </span>
              <div className="relative">
                <select
                  className={selectClass}
                  value={safeDay}
                  onChange={(e) => setDay(Number(e.target.value))}
                >
                  {Array.from({ length: dim }, (_, i) => i + 1).map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#f1c97d]/40 material-symbols-outlined text-lg">
                  unfold_more
                </span>
              </div>
            </label>
            <label className="block">
              <span className="zd-headline mb-2 block text-[9px] uppercase tracking-[0.2em] text-[#f1c97d]/70">
                Year
              </span>
              <div className="relative">
                <select
                  className={selectClass}
                  value={year ?? ""}
                  onChange={(e) => {
                    const v = e.target.value;
                    setYear(v === "" ? null : Number(v));
                  }}
                >
                  <option value="">—</option>
                  {yearOptions.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#f1c97d]/40 material-symbols-outlined text-lg">
                  unfold_more
                </span>
              </div>
            </label>
          </div>
        </div>
      ) : null}
    </div>
  );
}
