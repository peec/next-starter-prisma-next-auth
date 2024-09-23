import { Link, Preview, Section, Text } from "@react-email/components";
import * as React from "react";
import {
  button,
  emailBaseUrl,
  EmailLayout,
  section,
  text,
  title,
} from "@/email/EmailLayout";
import { APP_NAME } from "@/settings";
import { PasswordResetToken } from "@prisma/client";
import { getTranslations } from "next-intl/server";

export const ResetPassword = async ({
  token,
  name,
}: {
  token: PasswordResetToken;
  name: string;
}) => {
  const t = await getTranslations("emails.reset-password");

  return (
    <EmailLayout>
      <Preview>{t("preview")}</Preview>
      <Text style={title}>{t("hello", { name })}</Text>
      <Text style={text}>{t("message", { appName: APP_NAME })}</Text>

      <Section style={section}>
        <Text style={text}>{t("instructions")}</Text>
        <Link
          href={`${emailBaseUrl}/reset-password?token=${token.token}`}
          style={button}
        >
          {t("resetButton")}
        </Link>
      </Section>
    </EmailLayout>
  );
};

export default ResetPassword;
