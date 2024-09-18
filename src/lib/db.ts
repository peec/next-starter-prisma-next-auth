import { PasswordResetToken } from "@prisma/client";

export function isPasswordResetTokenExpired(token: PasswordResetToken) {
  if (token.expiresAt < new Date()) {
    return true;
  }
  return false;
}
