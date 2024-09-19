import { PasswordResetToken, UserVerificationToken } from "@prisma/client";

export function isPasswordResetTokenExpired(
  token: PasswordResetToken | UserVerificationToken,
) {
  if (token.expiresAt < new Date()) {
    return true;
  }
  return false;
}
