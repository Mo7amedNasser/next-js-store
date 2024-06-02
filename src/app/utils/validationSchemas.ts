import { z } from 'zod';

export const createProductSchema = z.object({
  title: z.string().min(2, "Title must be greater than 2 characters").max(50, "Title mustn't be greater than 50 characters"),
  body: z.string().min(10).max(500),
});
