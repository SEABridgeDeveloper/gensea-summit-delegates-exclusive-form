"use client";

import Image from "next/image";
import { cn } from "@/lib/cn";

export function BrandMark({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Image
        src="/logo.png"
        width={250}
        height={250}
        alt=""
        aria-hidden="true"
        priority
        className="h-10 w-auto md:h-12"
      />
    </div>
  );
}
