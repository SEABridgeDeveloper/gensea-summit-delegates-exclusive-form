"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { ChevronDown, Plus, Search, X } from "lucide-react";
import {
  searchUniversities,
  getUniversityById,
  universities,
} from "@/lib/data/universities";
import { cn } from "@/lib/cn";

export function UniversityCombobox({
  value,
  onChange,
  onUseTyped,
  invalid,
  placeholder = "Search 140+ ASEAN universities",
  emptyLabel = "No matches. Try a different spelling or pick Other.",
  id: propId,
}: {
  value: string;
  onChange: (id: string) => void;
  /**
   * Called when the user commits a free-text query that isn't in the list.
   * Receives the typed text so the parent can pre-fill the "Other" field.
   * The combobox itself emits `onChange("other")` alongside this.
   */
  onUseTyped?: (text: string) => void;
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

  // Show an inline "Use my own" option when the typed query has no exact name
  // match — gives users a one-click escape hatch to commit free-text instead
  // of scroll-hunting for "Other / Not listed" and re-typing.
  const trimmedQuery = query.trim();
  const showUseTyped =
    trimmedQuery.length > 0 &&
    !results.some((u) => u.name.toLowerCase() === trimmedQuery.toLowerCase());
  const useTypedIndex = showUseTyped ? results.length : -1;
  const totalOptions = results.length + (showUseTyped ? 1 : 0);

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

  const handleSelectTyped = () => {
    const text = trimmedQuery;
    if (!text) return;
    onUseTyped?.(text);
    onChange("other");
    setOpen(false);
    setQuery("");
  };

  const handleListboxKey = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, Math.max(totalOptions - 1, 0)));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
        break;
      case "Enter":
        e.preventDefault();
        if (activeIndex === useTypedIndex) handleSelectTyped();
        else if (results[activeIndex]) handleSelect(results[activeIndex].id);
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
        setActiveIndex(Math.max(totalOptions - 1, 0));
        break;
    }
  };

  const handleTriggerKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen(true);
    }
  };

  const activeOptionId = open
    ? activeIndex === useTypedIndex
      ? `${baseId}-opt-use-typed`
      : results[activeIndex]
        ? `${baseId}-opt-${results[activeIndex].id}`
        : undefined
    : undefined;

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
          invalid && "border-sunset-500 focus:border-sunset-500 focus:ring-sunset-500/30",
          !selected && "text-bone-subtle",
        )}
      >
        <span className="truncate">
          {selected ? (
            <>
              <span className="text-bone">{selected.name}</span>
              {selected.country !== "—" && (
                <span className="ml-2 text-xs text-bone-subtle">{selected.country}</span>
              )}
            </>
          ) : (
            placeholder
          )}
        </span>
        <ChevronDown className="h-4 w-4 shrink-0 text-bone-subtle" aria-hidden="true" />
      </button>

      {open && (
        <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-xl border border-bone-hairline bg-ink-elevated shadow-ink">
          <div className="flex items-center gap-2 border-b border-bone-hairline px-3 py-2.5">
            <Search className="h-4 w-4 text-bone-subtle" aria-hidden="true" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleListboxKey}
              placeholder={placeholder}
              aria-controls={listboxId}
              aria-activedescendant={activeOptionId}
              className="w-full bg-transparent text-sm text-bone placeholder:text-bone-subtle focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="text-bone-subtle hover:text-bone"
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
            {results.length === 0 && !showUseTyped && (
              <li className="px-4 py-3 text-sm text-bone-subtle">{emptyLabel}</li>
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
                    i === activeIndex ? "bg-ink-subtle" : "hover:bg-ink-subtle",
                    u.id === value && "font-semibold",
                  )}
                >
                  <span className="text-bone">{u.name}</span>
                  {u.country !== "—" && (
                    <span className="ml-3 shrink-0 text-xs text-bone-subtle">{u.country}</span>
                  )}
                </button>
              </li>
            ))}
            {showUseTyped && (
              <li>
                <button
                  ref={(el) => {
                    optionRefs.current[useTypedIndex] = el;
                  }}
                  type="button"
                  role="option"
                  id={`${baseId}-opt-use-typed`}
                  aria-selected={false}
                  onClick={handleSelectTyped}
                  onMouseEnter={() => setActiveIndex(useTypedIndex)}
                  className={cn(
                    "flex w-full items-center gap-2 border-t border-bone-hairline px-4 py-2.5 text-left text-sm transition",
                    useTypedIndex === activeIndex ? "bg-ink-subtle" : "hover:bg-ink-subtle",
                  )}
                >
                  <Plus className="h-4 w-4 shrink-0 text-sunset-400" aria-hidden="true" />
                  <span className="truncate text-bone">
                    Use <span className="font-semibold">&ldquo;{trimmedQuery}&rdquo;</span>
                  </span>
                  <span className="ml-auto shrink-0 text-xs text-bone-subtle">Not listed</span>
                </button>
              </li>
            )}
          </ul>
          <div className="border-t border-bone-hairline px-4 py-2 text-[11px] text-bone-subtle">
            {universities.length}+ ASEAN institutions
          </div>
        </div>
      )}
    </div>
  );
}
