
import { z } from "zod";

export const jobApplicationSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, "Name must contain at least 3 characters"),

  email: z
    .string()
    .trim()
    .email("Enter a valid email address"),

  phone: z
    .string()
    .regex(/^\d{10}$/, "Enter a valid 10-digit phone number"),

  position: z
    .string()
    .min(1, "Please select a position"),

  experience: z
    .string()
    .min(1, "Please select your experience level"),

  portfolio: z.union([
    z.literal(""),
    z.string().url("Enter a valid portfolio URL"),
  ]),

  coverLetter: z
    .string()
    .trim()
    .min(30, "Write at least 30 characters"),

  skills: z
    .array(
      z.object({
        name: z
          .string()
          .trim()
          .min(2, "Each skill must contain at least 2 characters"),
      })
    )
    .min(1, "Add at least one skill"),
});

export type JobApplicationData = z.infer<
  typeof jobApplicationSchema
>;
