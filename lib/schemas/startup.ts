import { z } from "zod";

const phoneRegex = /^\+?[\d\s\-()]{7,20}$/;

const pitchDeckSchema = z
  .any()
  .refine(
    (f) => typeof File === "undefined" || f instanceof File,
    { message: "required" },
  )
  .refine(
    (f) => !f || (f as File).type === "application/pdf",
    { message: "pdfOnly" },
  )
  .refine(
    (f) => !f || (f as File).size <= 10 * 1024 * 1024,
    { message: "fileTooLarge" },
  );

const videoFileSchema = z
  .any()
  .optional()
  .refine(
    (f) => !f || typeof File === "undefined" || f instanceof File,
    { message: "fileType" },
  )
  .refine(
    (f) => !f || (f as File).size <= 100 * 1024 * 1024,
    { message: "videoTooLarge" },
  );

export const SECTORS = ["wellness", "food", "ai", "creative", "education"] as const;

export const startupApplicationSchema = z
  .object({
    // Company
    legalName: z.string().trim().min(2, { message: "required" }).max(160),
    foundingDate: z
      .string()
      .trim()
      .min(1, { message: "required" })
      .refine((v) => !Number.isNaN(Date.parse(v)), { message: "invalidDate" }),
    incorporationCountry: z.string().trim().min(2, { message: "required" }).max(80),
    sector: z.enum(SECTORS, { errorMap: () => ({ message: "required" }) }),

    // Founder (lead applicant) — confirms at least one founder meets the eligibility
    founderName: z.string().trim().min(2, { message: "required" }).max(120),
    founderEmail: z.string().trim().email({ message: "invalidEmail" }),
    founderPhone: z.string().trim().regex(phoneRegex, { message: "invalidPhone" }),
    founderAge: z.coerce
      .number({ invalid_type_error: "required" })
      .int()
      .min(18, { message: "ageRange" })
      .max(30, { message: "ageRange" }),
    // Eligibility (graduated within 5y) is communicated via the section disclaimer.
    // Not enforced as a checkbox — see venture form copy.

    pitchDeck: pitchDeckSchema,

    // 2-min video — recommended, not required. Either a URL or a file.
    videoUrl: z
      .string()
      .trim()
      .url({ message: "invalidUrl" })
      .optional()
      .or(z.literal("")),
    videoFile: videoFileSchema,
  });

export type StartupApplicationValues = z.infer<typeof startupApplicationSchema>;

export type StartupDraft = Omit<
  StartupApplicationValues,
  "pitchDeck" | "videoFile"
> & {
  pitchDeck?: { name: string; size: number; type: string };
  videoFile?: { name: string; size: number; type: string };
};
