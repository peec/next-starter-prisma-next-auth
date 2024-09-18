import { z } from "zod";

export const addOrganizaitonSchema = z.object({
  name: z.string().min(2),
});
