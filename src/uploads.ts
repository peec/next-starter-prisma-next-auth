"use server";

import { uploadFiles } from "@/lib/uploader/azure";
import { prisma } from "@/lib/prisma";
import { zfd } from "zod-form-data";
import {
  securedFormAction,
  securedOrganizationAction,
} from "@/lib/action-utils";
import { getTranslations } from "next-intl/server";
import { mb } from "@/lib/uploader/validation";
import z from "zod";

// validation for profile images, single image uploads etc.
const singleImageValidation = async () => {
  const t = await getTranslations("uploads.validation");
  return zfd.formData({
    file: zfd
      .file()
      .refine((file) => file.size < mb(5), {
        message: t("size", { maxSizeMb: 5 }),
      })
      .refine(
        (file) =>
          ["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(
            file.type,
          ),
        {
          message: t("image-type"),
        },
      ),
  });
};

export const uploadProfilePicture = securedFormAction(
  singleImageValidation,
  async (data, { user }) => {
    const files = await uploadFiles("global", [data.file], {
      // compress and convert to webp.
      imageCompress: (sharp) =>
        sharp.resize({ width: 300 }).webp({ quality: 75 }),
      mimeType: "image/webp",
      fileExtension: "webp",
    });
    if (files[0].success) {
      await prisma.user.update({
        data: { image: files[0].data.url },
        where: { id: user.id },
      });
    }
    return {
      success: true,
    };
  },
);

export const uploadOrganizationLogo = securedOrganizationAction(
  singleImageValidation,
  async (data, { organization }) => {
    const files = await uploadFiles(
      { type: "org", id: organization.id },
      [data.file],
      {
        // compress and convert to webp.
        imageCompress: (sharp) =>
          sharp.resize({ width: 300 }).webp({ quality: 75 }),
        mimeType: "image/webp",
        fileExtension: "webp",
        public: true,
      },
    );
    if (files[0].success) {
      await prisma.organization.update({
        data: { image: files[0].data.url },
        where: { id: organization.id },
      });
    }
    return {
      success: true,
    };
  },
);

const orgDocumentsValidation = async () => {
  const t = await getTranslations("uploads.validation");
  // 1 mb limit for testing purposes..
  const fileValidator = zfd.file().refine((file) => file.size < mb(1), {
    message: t("size", { maxSizeMb: 1 }),
  });
  return zfd.formData({
    files: z.union([z.array(fileValidator), fileValidator]),
  });
};

export const uploadOrganizationDocuments = securedOrganizationAction(
  orgDocumentsValidation,
  async (data, { organization, organizationMember }) => {
    const files = await uploadFiles(
      { type: "org", id: organization.id },
      Array.isArray(data.files) ? data.files : [data.files],
    );
    for (const file of files) {
      if (file.success) {
        await prisma.organizationDocument.create({
          data: {
            orgId: organization.id,
            memberId: organizationMember.id,
            fileName: file.file.name,
            fileUrl: file.data.url,
            azureBlobName: file.data.blobName,
            azureContainer: file.data.containerName,
            size: file.file.size,
            type: file.file.type,
          },
        });
      }
    }
    return {
      success: true,
    };
  },
);
