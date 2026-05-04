import { z } from "zod/v4";

export interface Testimonial {
  id: string;
  clientName: string;
  company: string | null;
  content: string;
  rating: number;
  facebookUrl: string | null;
  createdAt: string;
}

export const insertTestimonialSchema = z.object({
  clientName: z.string(),
  company: z.string().nullable().optional(),
  content: z.string(),
  rating: z.number().int().min(1).max(5).default(5),
  facebookUrl: z.string().url().nullable().optional(),
});

export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
