import { z } from "zod";
import { partnerEmailDomains } from "@/lib/data/universities";

const phoneRegex = /^\+?[\d\s\-()]{7,20}$/;

export const identitySchema = z
  .object({
    fullNameTh: z.string().trim().max(120).optional().or(z.literal("")),
    fullNameEn: z.string().trim().min(2, { message: "required" }).max(120),
    email: z.string().trim().email({ message: "invalidEmail" }),
    phone: z.string().trim().regex(phoneRegex, { message: "invalidPhone" }),
    line: z.string().trim().max(60).optional().or(z.literal("")),
    discord: z.string().trim().max(60).optional().or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    const hasLine = !!data.line && data.line.length > 0;
    const hasDiscord = !!data.discord && data.discord.length > 0;
    if (!hasLine && !hasDiscord) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["line"],
        message: "contactRequired",
      });
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["discord"],
        message: "contactRequired",
      });
    }
  });

export type IdentityValues = z.infer<typeof identitySchema>;

export const academicSchema = z.object({
  university: z.string().min(1, { message: "required" }),
  faculty: z.string().min(1, { message: "required" }),
  yearOfStudy: z.string().min(1, { message: "required" }),
  gpa: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine(
      (v) => {
        if (!v) return true;
        const n = Number(v);
        return !Number.isNaN(n) && n >= 0 && n <= 4.5;
      },
      { message: "invalid" },
    ),
});

export type AcademicValues = z.infer<typeof academicSchema>;

const isInstitutionalEmail = (email: string) => {
  const lower = email.trim().toLowerCase();
  if (lower.endsWith(".ac.th")) return true;
  return partnerEmailDomains.some((d) => lower.endsWith("@" + d) || lower.endsWith("." + d));
};

// File handling: in the browser we receive a `File`. On the server (and during
// SSR-render of defaults) `File` may be undefined, so guard for it.
const fileSchema = z
  .any()
  .refine((file) => file instanceof (typeof File !== "undefined" ? File : Object), { message: "required" })
  .refine((file) => !file || file.type === "application/pdf", { message: "fileType" })
  .refine((file) => !file || file.size <= 5 * 1024 * 1024, { message: "fileSize" });

export const recommenderSchema = z.object({
  name: z.string().trim().min(2, { message: "required" }).max(120),
  title: z.string().min(1, { message: "required" }),
  email: z
    .string()
    .trim()
    .email({ message: "invalidEmail" })
    .refine(isInstitutionalEmail, { message: "instEmail" }),
  letter: fileSchema,
});

export type RecommenderValues = z.infer<typeof recommenderSchema>;

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export const essaySchema = z.object({
  essay: z
    .string()
    .trim()
    .refine((v) => countWords(v) >= 200, { message: "essayMin" })
    .refine((v) => countWords(v) <= 500, { message: "essayMax" }),
});

export type EssayValues = z.infer<typeof essaySchema>;

export const logisticsSchema = z.object({
  accommodation: z.enum(["yes", "no"], { errorMap: () => ({ message: "required" }) }),
  dietary: z.array(z.string()).default([]),
  allergies: z.string().trim().min(1, { message: "required" }).max(300),
  accessibility: z.string().trim().max(300).optional().or(z.literal("")),
  emergencyName: z.string().trim().min(2, { message: "required" }).max(120),
  emergencyPhone: z.string().trim().regex(phoneRegex, { message: "invalidPhone" }),
  emergencyRelationship: z.string().trim().min(2, { message: "required" }).max(60),
  consentPdpa: z.boolean().refine((v) => v === true, { message: "consent" }),
  consentPhoto: z.boolean().default(false),
  consentTruthful: z.boolean().refine((v) => v === true, { message: "consent" }),
});

export type LogisticsValues = z.infer<typeof logisticsSchema>;

export type ApplicationDraft = {
  identity?: IdentityValues;
  academic?: AcademicValues;
  recommender?: Omit<RecommenderValues, "letter"> & { letterName?: string; letterSize?: number };
  essay?: EssayValues;
  logistics?: LogisticsValues;
};


// ============================================
// Step 1: Founder
// ============================================
export const founderSchema = z.object({
  fullNameTh: z.string().min(2, "validation.required"),
  fullNameEn: z.string().min(2, "validation.required"),
  email: z.string().email("validation.email"),
  phone: z.string().min(8, "validation.phone"),
  lineId: z.string().optional(),
  role: z.enum(["CEO", "CO_FOUNDER", "CTO", "COO", "OTHER"]),
  roleOther: z.string().optional(),
  coFounderCount: z.coerce.number().int().min(0).max(10),
}).refine(
  (data) => data.role !== "OTHER" || (data.roleOther && data.roleOther.length >= 2),
  { message: "validation.required", path: ["roleOther"] },
);

// ============================================
// Step 2: Venture
// ============================================
export const SECTORS = ["wellness", "food", "ai", "creative", "education"] as const;
export const STAGES = ["idea", "pre_seed", "seed", "series_a_plus"] as const;

export const ventureSchema = z.object({
  name: z.string().min(2, "validation.required"),
  websiteUrl: z.string().url("validation.url").optional().or(z.literal("")),
  sector: z.enum(SECTORS),
  stage: z.enum(STAGES),
  foundedYear: z.coerce
    .number()
    .int()
    .min(2015, "validation.foundedYearMin")
    .max(new Date().getFullYear(), "validation.foundedYearMax"),
  hqCountry: z.string().min(2, "validation.required"),
  hqCity: z.string().min(2, "validation.required"),
  oneLiner: z.string().min(20, "validation.oneLinerMin").max(140, "validation.oneLinerMax"),
  problem: z.string().min(80, "validation.problemMin").max(800, "validation.problemMax"),
  solution: z.string().min(80, "validation.solutionMin").max(800, "validation.solutionMax"),
});

// ============================================
// Step 3: Traction
// ============================================
export const tractionSchema = z.object({
  hasLaunched: z.boolean(),
  launchedDate: z.string().optional(),
  activeUsers: z.coerce.number().int().min(0).optional(),
  monthlyRevenueUsd: z.coerce.number().min(0).optional(),
  totalFundingUsd: z.coerce.number().min(0).optional(),
  partnerships: z.string().max(500).optional(),
  milestones: z
    .string()
    .min(80, "validation.milestonesMin")
    .max(1000, "validation.milestonesMax"),
});

// ============================================
// Step 4: Documents
// ============================================
const MAX_DECK_SIZE = 10 * 1024 * 1024; // 10MB

export const documentsSchema = z.object({
  pitchDeck: z
    .any()
    .refine((v): v is File => v instanceof File, "validation.required")
    .refine(
      (v) => v instanceof File && v.size <= MAX_DECK_SIZE,
      "validation.fileTooLarge",
    )
    .refine(
      (v) => v instanceof File && v.type === "application/pdf",
      "validation.pdfOnly",
    ),
  demoVideoUrl: z.string().url("validation.url").optional().or(z.literal("")),
  nominatedBy: z.string().optional(),
  whyGenSea: z
    .string()
    .min(200, "validation.essayMin")
    .max(1500, "validation.essayMax"),
});

// ============================================
// Step 5: Consent
// ============================================
export const consentSchema = z.object({
  needAccommodation: z.boolean(),
  availableAllDays: z.literal(true, {
    errorMap: () => ({ message: "validation.required" }),
  }),
  interestedInDemoSlot: z.boolean(),
  dietary: z.array(z.string()).optional(),
  allergies: z.string().optional(),
  accessibilityNeeds: z.string().optional(),

  pdpaConsent: z.literal(true, {
    errorMap: () => ({ message: "validation.required" }),
  }),
  ipShareConsent: z.literal(true, {
    errorMap: () => ({ message: "validation.required" }),
  }),
  truthfulnessConfirm: z.literal(true, {
    errorMap: () => ({ message: "validation.required" }),
  }),
  photoConsent: z.boolean().optional(),
});

// ============================================
// Type exports
// ============================================
export type FounderValues = z.infer<typeof founderSchema>;
export type VentureValues = z.infer<typeof ventureSchema>;
export type TractionValues = z.infer<typeof tractionSchema>;
export type DocumentsValues = z.infer<typeof documentsSchema>;
export type ConsentValues = z.infer<typeof consentSchema>;

export type VentureFormState = {
  founder?: FounderValues;
  venture?: VentureValues;
  traction?: TractionValues;
  documents?: DocumentsValues;
  consent?: ConsentValues;
};
