"use server";

import { authenticated } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isValidAzureFileUrl } from "@/lib/uploader/azure";

export async function setProfilePicture(url: string) {
  const { user } = await authenticated({ action: true });
  if (!isValidAzureFileUrl(url)) {
    return {
      success: false,
      error: "not a valid file",
    };
  }
  await prisma.user.update({ data: { image: url }, where: { id: user.id } });
  return {
    success: true,
  };
}
