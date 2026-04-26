import { z } from "zod"

// List of valid university email domains
const validUniversityDomains = [
  ".ac.th",
  ".edu",
  ".edu.sg",
  ".edu.my",
  ".ac.id",
  ".edu.ph",
  ".edu.vn",
]

const isValidInstitutionalEmail = (email: string): boolean => {
  return validUniversityDomains.some((domain) => email.toLowerCase().endsWith(domain))
}

// Step 1: Student Identity
export const step1Schema = z
  .object({
    nameTh: z.string().min(1, "Required"),
    nameEn: z.string().min(1, "Required"),
    email: z.string().email("Invalid email"),
    phone: z.string().min(1, "Required"),
    lineId: z.string().optional(),
    discord: z.string().optional(),
  })
  .refine((data) => data.lineId || data.discord, {
    message: "At least one of LINE ID or Discord must be filled",
    path: ["lineId"],
  })

// Step 2: Academic Info
export const step2Schema = z.object({
  universityId: z.string().min(1, "Required"),
  faculty: z.string().min(1, "Required"),
  department: z.string().min(1, "Required"),
  yearOfStudy: z.string().min(1, "Required"),
  gpa: z.string().optional(),
})

// Step 3: Recommender
export const step3Schema = z.object({
  profName: z.string().min(1, "Required"),
  profEmail: z.string().email("Invalid email").refine(isValidInstitutionalEmail, {
    message: "Please use an institutional email (e.g. ending in .ac.th)",
  }),
  profTitle: z.string().min(1, "Required"),
  letterFile: z.custom<File>((val) => val instanceof File, "Required").refine(
    (file) => file && file.type === "application/pdf",
    "PDF only"
  ).refine(
    (file) => file && file.size <= 5 * 1024 * 1024,
    "Max 5MB"
  ),
})

// Step 4: Essay
export const step4Schema = z.object({
  essay: z.string().refine(
    (val) => {
      const wordCount = val.trim().split(/\s+/).filter(Boolean).length
      return wordCount >= 200 && wordCount <= 500
    },
    { message: "Essay must be 200-500 words" }
  ),
})

// Step 5: Logistics & Consent
export const step5Schema = z.object({
  needAccommodation: z.enum(["yes", "no"]),
  dietary: z.array(z.string()).optional(),
  allergies: z.string().optional(),
  accessibility: z.string().optional(),
  emergencyName: z.string().min(1, "Required"),
  emergencyPhone: z.string().min(1, "Required"),
  emergencyRelation: z.string().min(1, "Required"),
  consent1: z.literal(true, {
    errorMap: () => ({ message: "Required" }),
  }),
  consent2: z.boolean().optional(),
  consent3: z.literal(true, {
    errorMap: () => ({ message: "Required" }),
  }),
})

// Combined form schema
export const applicationFormSchema = z.object({
  ...step1Schema.shape,
  ...step2Schema.shape,
  ...step3Schema.shape,
  ...step4Schema.shape,
  ...step5Schema.shape,
})

export type ApplicationFormData = z.infer<typeof applicationFormSchema>
export type Step1Data = z.infer<typeof step1Schema>
export type Step2Data = z.infer<typeof step2Schema>
export type Step3Data = z.infer<typeof step3Schema>
export type Step4Data = z.infer<typeof step4Schema>
export type Step5Data = z.infer<typeof step5Schema>
