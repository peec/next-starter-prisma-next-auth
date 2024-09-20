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

export const OrganizationInvitation = ({
  organization,
  invitation,
}: {
  organization: Organization;
  invitation: OrganizationInvite;
}) => (
  <EmailLayout>
    <Preview>
      You have been invited to join organization {organization.name} on{" "}
      {APP_NAME}
    </Preview>
    <Text style={title}>
      You have been invited to join organization {organization.name} on{" "}
      {APP_NAME}
    </Text>

    <Section style={section}>
      <Text style={text}>To accept the invitation click the link below.</Text>
      <Link
        href={`${emailBaseUrl}/invitation?id=${invitation.id}`}
        style={button}
      >
        Accept invitation
      </Link>
    </Section>
  </EmailLayout>
);

export default OrganizationInvitation;
