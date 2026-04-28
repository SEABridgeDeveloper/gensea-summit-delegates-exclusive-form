"use client";

import { useLocale } from "@/lib/i18n/provider";
import { cn } from "@/lib/cn";

export type ApplyFlow = "delegate" | "venture";

interface ApplyProgressProps {
  current: number;
  flow?: ApplyFlow;
}

export function ApplyProgress({ current, flow = "delegate" }: ApplyProgressProps) {
  const { t, tArray } = useLocale();
  const stepNames = tArray(`apply.${flow}.progress.stepNames`);
  const total = stepNames.length;

  return (
    <div className="w-full">
      <div className="mb-3 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.16em] text-navy/60">
        <span className="flex items-center gap-2">
          <FlowBadge flow={flow} />
          {t("apply.progress.step", { current, total })}
        </span>
        <span className="hidden sm:block">{stepNames[current - 1]}</span>
      </div>

      <div className="flex w-full gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors",
              i + 1 < current && "bg-gold-500",
              i + 1 === current && "bg-gold-400",
              i + 1 > current && "bg-navy/10",
            )}
          />
        ))}
      </div>

      <ol
        className={cn(
          "mt-4 grid gap-2 text-[11px] font-medium text-navy/60 sm:hidden",
          total === 5 ? "grid-cols-5" : total === 4 ? "grid-cols-4" : "grid-cols-6",
        )}
      >
        {stepNames.map((name, i) => (
          <li
            key={name}
            className={cn(
              "truncate text-center",
              i + 1 === current ? "text-navy" : "text-navy/40",
            )}
          >
            {name}
          </li>
        ))}
      </ol>
    </div>
  );
}

function FlowBadge({ flow }: { flow: ApplyFlow }) {
  const { t } = useLocale();
  return (
    <span
      className={cn(
        "rounded-md px-2 py-0.5 text-[10px] font-bold tracking-[0.12em]",
        flow === "delegate"
          ? "bg-navy text-white"
          : "bg-brand-red text-white",
      )}
    >
      {t(`apply.${flow}.label`)}
    </span>
  );
}