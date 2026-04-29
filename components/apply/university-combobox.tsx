"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
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
  id: propId,
}: {
  value: string;
  onChange: (id: string) => void;
  invalid?: boolean;
  placeholder?: string;
  emptyLabel?: string;
  id?: string;
}) {
  const autoId = useId();
  const baseId = propId ?? autoId;
  const listboxId = `${baseId}-listbox`;

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const selected = getUniversityById(value);
  const results = useMemo(() => searchUniversities(query, 16), [query]);

  // Reset active option when results change.
  useEffect(() => {
    setActiveIndex(0);
  }, [query, open]);

  // Close on outside click.
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // Focus search input when opened, scroll active option into view.
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (open) {
      optionRefs.current[activeIndex]?.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex, open]);

  const handleSelect = (uId: string) => {
    onChange(uId);
    setOpen(false);
    setQuery("");
  };

  const handleListboxKey = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, Math.max(results.length - 1, 0)));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
        break;
      case "Enter":
        e.preventDefault();
        if (results[activeIndex]) handleSelect(results[activeIndex].id);
        break;
      case "Escape":
        e.preventDefault();
        setOpen(false);
        break;
      case "Home":
        e.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        e.preventDefault();
        setActiveIndex(Math.max(results.length - 1, 0));
        break;
    }
  };

  const handleTriggerKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen(true);
    }
  };

  const activeOptionId =
    open && results[activeIndex] ? `${baseId}-opt-${results[activeIndex].id}` : undefined;

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        id={baseId}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={handleTriggerKey}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-invalid={invalid || undefined}
        className={cn(
          "field-input flex items-center justify-between text-left",
          invalid && "border-brand-red focus:border-brand-red focus:ring-brand-red/20",
          !selected && "text-navy/55",
        )}
      >
        <span className="truncate">
          {selected ? (
            <>
              <span className="text-navy">{selected.name}</span>
              {selected.country !== "—" && (
                <span className="ml-2 text-xs text-navy/65">{selected.country}</span>
              )}
            </>
          ) : (
            placeholder
          )}
        </span>
        <ChevronDown className="h-4 w-4 shrink-0 text-navy/65" aria-hidden="true" />
      </button>

      {open && (
        <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-xl border border-navy/15 bg-white shadow-soft">
          <div className="flex items-center gap-2 border-b border-navy/10 px-3 py-2.5">
            <Search className="h-4 w-4 text-navy/65" aria-hidden="true" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleListboxKey}
              placeholder={placeholder}
              aria-controls={listboxId}
              aria-activedescendant={activeOptionId}
              className="w-full bg-transparent text-sm text-navy placeholder:text-navy/55 focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="text-navy/65 hover:text-navy"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <ul
            id={listboxId}
            role="listbox"
            aria-label="Universities"
            className="max-h-[min(18rem,50vh)] overflow-y-auto py-1"
          >
            {results.length === 0 && (
              <li className="px-4 py-3 text-sm text-navy/70">{emptyLabel}</li>
            )}
            {results.map((u, i) => (
              <li key={u.id}>
                <button
                  ref={(el) => {
                    optionRefs.current[i] = el;
                  }}
                  type="button"
                  role="option"
                  id={`${baseId}-opt-${u.id}`}
                  aria-selected={u.id === value}
                  onClick={() => handleSelect(u.id)}
                  onMouseEnter={() => setActiveIndex(i)}
                  className={cn(
                    "flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition",
                    i === activeIndex ? "bg-cream-100" : "hover:bg-cream-100",
                    u.id === value && "font-semibold",
                  )}
                >
                  <span className="text-navy">{u.name}</span>
                  {u.country !== "—" && (
                    <span className="ml-3 shrink-0 text-xs text-navy/70">{u.country}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
          <div className="border-t border-navy/10 px-4 py-2 text-[11px] text-navy/65">
            {universities.length}+ ASEAN institutions
          </div>
        </div>
      )}
    </div>
  );
}
