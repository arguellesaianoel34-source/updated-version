import { z } from "zod/v4";

export const contactStatusEnum = ["new", "read", "responded"] as const;
export type ContactStatus = (typeof contactStatusEnum)[number];

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  service: string | null;
  message: string;
  status: ContactStatus;
  createdAt: string;
}

export const insertContactSchema = z.object({
  name: z.string(),
  email: z.string(),
  phone: z.string().nullable().optional(),
  company: z.string().nullable().optional(),
  service: z.string().nullable().optional(),
  message: z.string(),
  status: z.enum(contactStatusEnum).optional(),
});

export type InsertContact = z.infer<typeof insertContactSchema>;
