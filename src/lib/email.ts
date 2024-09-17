import { FROM_EMAIL } from "@/settings";
import { Resend } from "resend";

export async function sendEmail({
  to,
  subject,
  body,
}: {
  to: string;
  subject: string;
  body: any;
}) {
  // you may replace "Resend" with your own favourite email sender here.
  const resend = new Resend(process.env.RESEND_API_KEY);
  return resend.emails.send({
    from: FROM_EMAIL,
    to: to,
    subject: subject,
    react: body,
  });
}
