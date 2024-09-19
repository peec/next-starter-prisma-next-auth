export async function generateResetToken(length = 32) {
  const { randomBytes } = await import("node:crypto");
  return randomBytes(length).toString("hex");
}
