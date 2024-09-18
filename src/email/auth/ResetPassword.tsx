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

export const OrganizationInvitation = ({
  token,
  name,
}: {
  token: PasswordResetToken;
  name: string;
}) => (
  <EmailLayout>
    <Preview>Forgot password request</Preview>
    <Text style={title}>Hello {name}!</Text>
    <Text style={text}>
      You or someone else have requested to change passsword on {APP_NAME}
    </Text>

    <Section style={section}>
      <Text style={text}>Reset your password below</Text>
      <Link
        href={`${emailBaseUrl}/reset-password?token=${token.token}`}
        style={button}
      >
        Reset password
      </Link>
    </Section>
  </EmailLayout>
);

export default OrganizationInvitation;
