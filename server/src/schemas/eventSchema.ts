import { z } from "zod";

export const idSchema = z.coerce.number().int().positive();

export const createEventSchema = z.object({
  title: z.coerce.string().nonempty(),
  description: z.coerce.string().optional(),
  category: z.coerce.string(),
  venue_name: z.coerce.string(),
  city: z.coerce.string(),
  starts_at: z.string().datetime(),
  timezone: z.coerce.string(),
  poster_url: z.string().url().optional(),
});
