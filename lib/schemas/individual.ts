import { z } from "zod";

const phoneRegex = /^\+?[\d\s\-()]{7,20}$/;

// CV is optional — only validate type/size when a file is provided.
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

export const individualApplicationSchema = z.object({
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
  faculty: z.string().min(1, { message: "required" }),

  cv: optionalFileSchema,

  advisorName: z.string().trim().min(2, { message: "required" }).max(120),
  advisorEmail: z.string().trim().email({ message: "invalidEmail" }),

  motivation: z
    .string()
    .trim()
    .min(1, { message: "required" })
    .max(800, { message: "tooLong800" }),
  // contribution removed — form currently uses a single short-answer question.
});

export type IndividualApplicationValues = z.infer<typeof individualApplicationSchema>;

// Drafts strip the File object before serialising.
export type IndividualDraft = Omit<IndividualApplicationValues, "cv"> & {
  cv?: { name: string; size: number; type: string };
};
