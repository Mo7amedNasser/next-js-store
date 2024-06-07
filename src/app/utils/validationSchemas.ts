import { z } from 'zod';

/**
 * If you need to make a field optional add //.optional() method
*/

// Create Product Schema
export const createProductSchema = z.object({
  title: z.string({
    required_error: "Title is required",
    invalid_type_error: "Title should be of type string",
  })
  .min(2, { message: "Title must be greater than 2 characters" })
  .max(50, { message: "Title mustn't be greater than 50 characters" }),
  description: z.string().min(10).max(500),
  category: z.string().min(2).max(10),
  brand: z.string().min(2).max(10),
  image: z.string().min(5),
  price: z.number().min(5),
});

// Create Register Schema
export const registerSchema = z.object({
  username: z.string().min(2).max(15),
  email: z.string().min(3).max(20).email(),
  password: z.string().min(6, { message: "The password should be longer than 6 characters." }),
});
