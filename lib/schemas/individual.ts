import { z } from "zod";

// Strict E.164: leading "+", country code + national digits, 7–15 digits
// total. The PhoneInput component always produces output in this shape.
const phoneRegex = /^\+\d{7,15}$/;

// CV upload is optional — only validate type/size when a file is provided.
const optionalFileSchema = z
  .any()
  .optional()
  .refine(
    (f) => !f || (f as File).type === "application/pdf",
    { message: "fileType" },
  )
  .refine(
    (f) => !f || (f as File).size <= 5 * 1024 * 1024,
    { message: "fileSize" },
  );

// Optional URL — accepts empty string or a valid URL. Used for LinkedIn /
// CV-link / external CV. Empty strings are tolerated so the optional
// field doesn't block submit when left blank.
const optionalUrl = z
  .string()
  .trim()
  .url({ message: "invalidUrl" })
  .optional()
  .or(z.literal(""));

export const individualApplicationSchema = z
  .object({
    fullName: z.string().trim().min(2, { message: "required" }).max(120),
    age: z.coerce
      .number({ invalid_type_error: "required" })
      .int()
      .min(18, { message: "ageRange" })
      .max(30, { message: "ageRange" }),
    nationality: z.string().trim().min(2, { message: "required" }).max(80),
    email: z.string().trim().email({ message: "invalidEmail" }),
    phone: z.string().trim().regex(phoneRegex, { message: "invalidPhone" }),

    university: z.string().min(1, { message: "required" }),
    // Free-text fallback used when `university === "other"` — the picker can't
    // know about every ASEAN institution, so applicants can name theirs
    // manually. Required only when the "Other" path is selected.
    universityOther: z.string().trim().max(160).optional().or(z.literal("")),
    faculty: z.string().min(1, { message: "required" }),

    // CV: either a PDF upload (preferred) or a public link (LinkedIn / Drive).
    cv: optionalFileSchema,
    cvUrl: optionalUrl,

    // LinkedIn / portfolio link — optional, helps reviewers contextualise
    // the application beyond the short answer.
    linkedinUrl: optionalUrl,

    // Faculty referral (was "advisor"). Schema field names retained for
    // API + sheet column compatibility — only UI labels say "Faculty
    // Referral" / "Reference".
    advisorName: z.string().trim().min(2, { message: "required" }).max(120),
    advisorEmail: z.string().trim().email({ message: "invalidEmail" }),

    motivation: z
      .string()
      .trim()
      .min(1, { message: "required" })
      .max(800, { message: "tooLong800" }),
  })
  .superRefine((data, ctx) => {
    // If the applicant picked "Other / Not listed" for their university,
    // require them to name it in the free-text field.
    if (data.university === "other" && !data.universityOther?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "required",
        path: ["universityOther"],
      });
    }
  });

export type IndividualApplicationValues = z.infer<typeof individualApplicationSchema>;

// Drafts strip the File object before serialising.
export type IndividualDraft = Omit<IndividualApplicationValues, "cv"> & {
  cv?: { name: string; size: number; type: string };
};
