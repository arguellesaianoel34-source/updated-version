import { z } from "zod/v4";

export type CommentStatus = "pending" | "approved" | "rejected";

export interface Comment {
  id: string;
  name: string;
  email: string;
  content: string;
  status: CommentStatus;
  createdAt: string;
}

export const insertCommentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  content: z.string().min(10, "Comment must be at least 10 characters"),
  status: z.enum(["pending", "approved", "rejected"]).default("pending"),
});

export type InsertComment = z.infer<typeof insertCommentSchema>;
