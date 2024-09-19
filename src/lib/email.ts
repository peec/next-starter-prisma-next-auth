import { CreateEmailResponseSuccess, Resend } from "resend";
import { serverEnv } from "@/env.server.mjs";
import { render } from "@react-email/render";

export async function sendEmail({
  to,
  subject,
  body,
}: {
  to: string;
  subject: string;
  body: any;
}) {
  if (serverEnv.EMAIL_TO_CONSOLE) {
    console.log("console email", {
      to,
      subject,
      body: await render(body),
    });
    return {
      id: "test",
    } as CreateEmailResponseSuccess;
  }

  // you may replace "Resend" with your own favourite email sender here.
  const resend = new Resend(serverEnv.RESEND_API_KEY);
  const email = await resend.emails.send({
    from: serverEnv.FROM_EMAIL,
    to: to,
    subject: subject,
    react: body,
  });
  if (email.error) {
    throw new Error(
      `Error sending email: (${email.error.name}) ${email.error.message}`,
    );
  }
  return email.data;
}
