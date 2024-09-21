"use server";

import { uploadFiles } from "@/lib/uploader/azure";
import { prisma } from "@/lib/prisma";
import { zfd } from "zod-form-data";
import { securedFormAction } from "@/lib/action-utils";

export const uploadProfilePicture = securedFormAction(
  zfd.formData({
    file: zfd
      .file()
      .refine((file) => file.size < 5000000, {
        message: "File can't be bigger than 5MB.",
      })
      .refine(
        (file) =>
          ["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(
            file.type,
          ),
        {
          message: "File format must be either jpg, jpeg, webp or png.",
        },
      ),
  }),
  async (data, { user }) => {
    const files = await uploadFiles("global", [data.file], {
      // compress and convert to webp.
      imageCompress: (sharp) => sharp.resize(300, 300).webp({ quality: 75 }),
      mimeType: "image/webp",
      fileExtension: "webp",
    });
    if (files[0].success) {
      await prisma.user.update({
        data: { image: files[0].url },
        where: { id: user.id },
      });
    }
    return {
      success: true,
    };
  },
);
