"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Search, X } from "lucide-react";
import {
  searchUniversities,
  getUniversityById,
  universities,
} from "@/lib/data/universities";
import { cn } from "@/lib/cn";

export function UniversityCombobox({
  value,
  onChange,
  invalid,
  placeholder = "Search 140+ ASEAN universities",
  emptyLabel = "No matches. Try a different spelling or pick Other.",
}: {
  value: string;
  onChange: (id: string) => void;
  invalid?: boolean;
  placeholder?: string;
  emptyLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selected = getUniversityById(value);
  const results = useMemo(() => searchUniversities(query, 16), [query]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-invalid={invalid}
        className={cn(
          "field-input flex items-center justify-between text-left",
          invalid && "border-brand-red focus:border-brand-red focus:ring-brand-red/20",
          !selected && "text-navy/40",
        )}
      >
        <span className="truncate">
          {selected ? (
            <>
              <span className="text-navy">{selected.name}</span>
              {selected.country !== "—" && (
                <span className="ml-2 text-xs text-navy/50">{selected.country}</span>
              )}
            </>
          ) : (
            placeholder
          )}
        </span>
        <ChevronDown className="h-4 w-4 shrink-0 text-navy/50" />
      </button>

      {open && (
        <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-xl border border-navy/15 bg-white shadow-soft">
          <div className="flex items-center gap-2 border-b border-navy/10 px-3 py-2.5">
            <Search className="h-4 w-4 text-navy/50" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              className="w-full bg-transparent text-sm text-navy placeholder:text-navy/40 focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear"
                className="text-navy/40 hover:text-navy"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <ul role="listbox" className="max-h-72 overflow-y-auto py-1">
            {results.length === 0 && (
              <li className="px-4 py-3 text-sm text-navy/60">{emptyLabel}</li>
            )}
            {results.map((u) => (
              <li key={u.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={u.id === value}
                  onClick={() => {
                    onChange(u.id);
                    setOpen(false);
                    setQuery("");
                  }}
                  className={cn(
                    "flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition hover:bg-cream-100",
                    u.id === value && "bg-cream-100",
                  )}
                >
                  <span className="text-navy">{u.name}</span>
                  {u.country !== "—" && (
                    <span className="ml-3 shrink-0 text-xs text-navy/45">{u.country}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
          <div className="border-t border-navy/10 px-4 py-2 text-[11px] text-navy/45">
            {universities.length}+ ASEAN institutions
          </div>
        </div>
      )}
    </div>
  );
}
