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

export const WelcomeRegistration = ({
  name,
  verificationToken,
}: {
  name: string;
  verificationToken: string;
}) => (
  <EmailLayout>
    <Preview>Verify your account on {APP_NAME}</Preview>
    <Text style={title}>Hello {name}!</Text>
    <Text style={text}>
      You have successfully created an account on {APP_NAME}, you will need to
      verify your account before you can log in.
    </Text>

    <Section style={section}>
      <Text style={text}>Verify your account below:</Text>
      <Link
        href={`${emailBaseUrl}/user-verification?token=${verificationToken}`}
        style={button}
      >
        Verify account
      </Link>
    </Section>
  </EmailLayout>
);
