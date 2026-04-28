"use client";

import { useLocale } from "@/lib/i18n/provider";
import { cn } from "@/lib/cn";
import Image from "next/image";

export function BrandMark({
  className,
  invert = false,
}: {
  className?: string;
  invert?: boolean;
}) {
  const { t } = useLocale();
  return (
    <div className="flex items-center gap-3">
      <Image src={"/logo.png"} width={250} alt="" height={250}/>
          </div>
  );
}
