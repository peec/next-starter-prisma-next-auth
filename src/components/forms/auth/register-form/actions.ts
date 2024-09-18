"use server";

import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { sendEmail } from "@/lib/email";
import { APP_NAME } from "@/settings";
import WelcomeRegistation from "@/email/auth/WelcomeRegistation";
import {
  RegisterFormDataInputs,
  RegisterFormDataSchema,
} from "@/components/forms/auth/register-form/schema";

export async function handleRegisterAction(data: RegisterFormDataInputs) {
  const inputRequest = RegisterFormDataSchema.safeParse(data);
  if (!inputRequest.success) {
    return {
      success: false,
      error: "Validation error",
    };
  }
  const input = inputRequest.data;

  if (await prisma.user.findFirst({ where: { email: data.email } })) {
    return {
      success: false,
      error: "You already have an account registered to this email",
      errorCode: "account_exist",
    };
  }

  try {
    const password = await hash(input.password, 12);

    await prisma.user.create({
      data: {
        email: input.email,
        password,
        name: input.name,
      },
    });
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "Could not create account, please try again",
    };
  }

  try {
    await sendEmail({
      to: data.email,
      subject: `Welcome to ${APP_NAME}`,
      body: WelcomeRegistation({ name: input.name }),
    });
  } catch (error) {
    console.error(error);
    // can be silent fail, no need to inform user about this.
  }

  return {
    success: true,
  };
}
