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
import { Organization, OrganizationInvite } from "@prisma/client";
import { getTranslations } from "next-intl/server";

export const OrganizationInvitation = async ({
  organization,
  invitation,
}: {
  organization: Organization;
  invitation: OrganizationInvite;
}) => {
  const t = await getTranslations("emails.organization-invitation");
  return (
    <EmailLayout>
      <Preview>
        {t("preview", {
          organizationName: organization.name,
          appName: APP_NAME,
        })}
      </Preview>
      <Text style={title}>
        {t("preview", {
          organizationName: organization.name,
          appName: APP_NAME,
        })}
      </Text>

      <Section style={section}>
        <Text style={text}>{t("instructions")}</Text>
        <Link
          href={`${emailBaseUrl}/invitation?id=${invitation.id}`}
          style={button}
        >
          {t("acceptInvitation")}
        </Link>
      </Section>
    </EmailLayout>
  );
};

export default OrganizationInvitation;
