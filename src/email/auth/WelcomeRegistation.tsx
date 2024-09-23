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
import { getTranslations } from "next-intl/server";

export const WelcomeRegistration = async ({
  name,
  verificationToken,
}: {
  name: string;
  verificationToken: string;
}) => {
  const t = await getTranslations("emails.welcome-registration");
  return (
    <EmailLayout>
      <Preview>{t("preview", { appName: APP_NAME })}</Preview>
      <Text style={title}>{t("hello", { name })}</Text>
      <Text style={text}>{t("message", { appName: APP_NAME })}</Text>

      <Section style={section}>
        <Text style={text}>{t("instructions")}</Text>
        <Link
          href={`${emailBaseUrl}/user-verification?token=${verificationToken}`}
          style={button}
        >
          {t("verifyButton")}
        </Link>
      </Section>
    </EmailLayout>
  );
};
