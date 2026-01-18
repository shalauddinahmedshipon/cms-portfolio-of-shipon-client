import { z } from "zod"

export const profileSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),

  designation: z.string().optional(),

  headline: z.string().max(100).optional(),

  bio: z.string().max(1000).optional(),

  location: z.string().optional(),

  resumeUrl: z
    .string()
    .url("Invalid URL")
    .optional()
    .or(z.literal("")),
})
export const contactInfoSchema = z.object({
  email: z.string().email().optional().or(z.literal("")),
  github: z.string().url().optional().or(z.literal("")),
  linkedin: z.string().url().optional().or(z.literal("")),
  facebook: z.string().url().optional().or(z.literal("")),
  whatsapp: z.string().optional(),
  twitter: z.string().url().optional().or(z.literal("")),
})
export const codingProfileSchema = z.object({
  platform: z.string().min(1, "Platform is required"),

  username: z.string().min(1, "Username is required"),

  profileUrl: z.string().url().optional().or(z.literal("")),

  rating: z
    .coerce
    .number()
    .int()
    .min(0)
    .optional(),

  badge: z.string().optional(),

  highlight: z.coerce.boolean().optional(),

  icon: z.instanceof(File).optional(),
})
