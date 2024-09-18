import {
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
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

export const OrganizationInvitation = ({name}: {name: string}) => (
  <EmailLayout>
    <Preview>
      Welcome to
      {APP_NAME}
    </Preview>
    <Text style={title}>
      Hello {name}!
    </Text>
    <Text style={text}>
      You have successfully created an account on {APP_NAME}</Text>

    <Section style={section}>
      <Text style={text}>Login to the dashboard below</Text>
      <Link
        href={`${emailBaseUrl}/dashboard`}
        style={button}
      >
        Dashboard
      </Link>
    </Section>
  </EmailLayout>
);

export default OrganizationInvitation;
