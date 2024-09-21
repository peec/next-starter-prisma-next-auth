import z, { ZodError, ZodIssue, ZodSchema } from "zod";
import { authenticated, authorizedOrganization } from "@/auth";
import { OrganizationMemberRole } from "@prisma/client";

export function securedOrganizationAction<
  T extends ZodSchema,
  SuccessData extends { success: true } = { success: true },
  ErrorData extends { success: false; error: string } = {
    success: false;
    error: string;
  },
>(
  schema: T,
  action: (
    data: z.infer<T>,
    organizationContext: Awaited<ReturnType<typeof authorizedOrganization>>,
  ) => Promise<
    (SuccessData & { success: true }) | (ErrorData & { success: false })
  >,
  options: {
    requiredRoles?: OrganizationMemberRole[];
  } = {},
) {
  return async function (
    organizationId: string,
    values: unknown,
  ): Promise<
    (SuccessData & { success: true }) | (ErrorData & { success: false })
  > {
    try {
      const organizationContext = await authorizedOrganization(
        { id: organizationId },
        options.requiredRoles,
        { action: true },
      );
      const inputRequest = await schema.safeParseAsync(values);
      if (!inputRequest.success) {
        return {
          success: false,
          error: inputRequest.error.message,
        };
      }
      const data = inputRequest.data;

      return action(data, organizationContext);
    } catch (err) {
      console.error(err);
      return {
        success: false,
        error: "Unauthorized",
      };
    }
  };
}

export function securedAction<
  T extends ZodSchema,
  SuccessData extends { success: true } = { success: true },
  ErrorData extends { success: false; error: string } = {
    success: false;
    error: string;
  },
>(
  schema: T,
  action: (
    data: z.infer<T>,
    auth: Awaited<ReturnType<typeof authenticated>>,
  ) => Promise<
    (SuccessData & { success: true }) | (ErrorData & { success: false })
  >,
) {
  return async function (
    values: z.infer<T>,
  ): Promise<
    (SuccessData & { success: true }) | (ErrorData & { success: false })
  > {
    try {
      const auth = await authenticated({ action: true });

      const inputRequest = await schema.safeParseAsync(values);
      if (!inputRequest.success) {
        return {
          success: false,
          error: inputRequest.error.message,
        };
      }
      const data = inputRequest.data;

      return action(data, auth);
    } catch (err) {
      console.error(err);
      return {
        success: false,
        error: "Unauthorized",
      };
    }
  };
}

export function securedFormAction<
  T extends ZodSchema,
  SuccessData extends { success: true } = { success: true },
  ErrorData extends { success: false; error: string } = {
    success: false;
    error: string;
  },
>(
  schema: T,
  action: (
    data: z.infer<T>,
    auth: Awaited<ReturnType<typeof authenticated>>,
  ) => Promise<
    (SuccessData & { success: true }) | (ErrorData & { success: false })
  >,
) {
  return async function (values: FormData): Promise<
    | (SuccessData & { success: true })
    | (ErrorData & {
        success: false;
        validation?: ZodIssue[];
      })
  > {
    try {
      const auth = await authenticated({ action: true });

      const inputRequest = await schema.safeParseAsync(values);
      if (!inputRequest.success) {
        return {
          success: false,
          error: inputRequest.error.message,
          validation: inputRequest.error.issues,
        };
      }
      const data = inputRequest.data;

      return action(data, auth);
    } catch (err) {
      console.error(err);
      return {
        success: false,
        error: "Unauthorized",
      };
    }
  };
}
