import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
});

export const getUserSchema = z.object({
  id: z.string().uuid('Invalid user ID'),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type GetUserInput = z.infer<typeof getUserSchema>;

