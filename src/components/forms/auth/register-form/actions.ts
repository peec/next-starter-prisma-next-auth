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

export async function handleRegisterAction(
  values: RegisterFormDataInputs | unknown,
) {
  const inputRequest = RegisterFormDataSchema.safeParse(values);
  if (!inputRequest.success) {
    return {
      success: false,
      error: inputRequest.error.message,
    };
  }
  const data = inputRequest.data;

  if (await prisma.user.findFirst({ where: { email: data.email } })) {
    return {
      success: false,
      error: "You already have an account registered to this email",
      errorCode: "account_exist",
    };
  }

  try {
    const password = await hash(data.password, 12);

    await prisma.user.create({
      data: {
        email: data.email,
        password,
        name: data.name,
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
      body: WelcomeRegistation({ name: data.name }),
    });
  } catch (error) {
    console.error(error);
    // can be silent fail, no need to inform user about this.
  }

  return {
    success: true,
  };
}
