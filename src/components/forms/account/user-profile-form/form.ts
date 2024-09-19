import { z } from "zod";

export const updateProfileFormSchema = z.object({
  name: z.string().min(2),
});
