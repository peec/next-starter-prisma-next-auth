import { z } from "zod";

export const editOrganizationFormSchema = z.object({
  name: z.string().min(2),
});
