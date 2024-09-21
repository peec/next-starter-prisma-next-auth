import {
  SASProtocol,
  ContainerSASPermissions,
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
  ContainerClient,
  BlobServiceClient,
} from "@azure/storage-blob";
import { serverEnv } from "@/env.server.mjs";
import { SasToken } from "@/lib/uploader/types";
import { uuidv7 } from "uuidv7";
import sharp, { Sharp } from "sharp";

const credentials = () => {
  if (
    !serverEnv.AZURE_STORAGE_ACCOUNT_NAME ||
    !serverEnv.AZURE_STORAGE_ACCOUNT_KEY
  ) {
    throw new Error(
      "uploads needs AZURE_STORAGE_ACCOUNT_NAME and AZURE_STORAGE_ACCOUNT_KEY env vars",
    );
  }
  return new StorageSharedKeyCredential(
    serverEnv.AZURE_STORAGE_ACCOUNT_NAME,
    serverEnv.AZURE_STORAGE_ACCOUNT_KEY,
  );
};

export function createReadableContainerSas({
  containerName,
}: {
  containerName: string;
}): SasToken | null {
  if (
    !serverEnv.AZURE_STORAGE_ACCOUNT_NAME ||
    !serverEnv.AZURE_STORAGE_ACCOUNT_KEY
  ) {
    return null;
  }

  const sasToken = generateBlobSASQueryParameters(
    {
      containerName,
      permissions: ContainerSASPermissions.parse("r"),
      startsOn: new Date(new Date().valueOf() - 60 * 60 * 24 * 1000),
      expiresOn: new Date(new Date().valueOf() + 60 * 60 * 24 * 1000),
      ipRange: { start: "0.0.0.0", end: "255.255.255.255" },
      protocol: SASProtocol.HttpsAndHttp,
      version: "2016-05-31",
    },
    credentials(),
  ).toString();

  return {
    accountName: serverEnv.AZURE_STORAGE_ACCOUNT_NAME!,
    sasToken,
    containerName,
  };
}
export async function uploadFiles(
  type: "global" | { type: "org"; id: string },
  files: File[],
  uploaderOptions: {
    imageCompress?: (sharp: Sharp, file: File) => Sharp;
    fileExtension?: string;
    mimeType?: string;
    /**
     * Heads up, if true, container created will have all files public.
     * Requires "Allow Blob anonymous access" in azure storage account settings.
     */
    public?: boolean;
  } = {},
) {
  const blobService = new BlobServiceClient(
    `https://${serverEnv.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net`,
    credentials(),
  );
  let containerName;
  if (type === "global") {
    containerName = "global";
  } else if (type.type === "org") {
    containerName = `org-${type.id}`;
  } else {
    console.error(type);
    throw new Error(`type not supported in uploader`);
  }

  if (uploaderOptions.public) {
    containerName = `pub-${containerName}`;
  }

  const containerClient: ContainerClient =
    blobService.getContainerClient(containerName);
  await containerClient.createIfNotExists({
    access: uploaderOptions.public ? "blob" : undefined,
  });

  const promise = await Promise.allSettled(
    files.map(async (file) => {
      let buffer = await file.arrayBuffer();
      if (uploaderOptions.imageCompress) {
        let sharpInstance = uploaderOptions.imageCompress(sharp(buffer), file);
        buffer = await sharpInstance.toBuffer();
      }
      let fileExt = uploaderOptions.fileExtension || file.name.split(".").pop();
      let fileType = uploaderOptions.mimeType || file.type;

      const newFileName = uuidv7() + "." + fileExt;
      const blobClient = containerClient.getBlockBlobClient(newFileName);
      const options = { blobHTTPHeaders: { blobContentType: fileType } };

      await blobClient.uploadData(buffer, options);
      const url = `https://${serverEnv.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net/${containerName}/${newFileName}`;
      return url;
    }),
  );
  return promise.map((p, index) =>
    p.status === "fulfilled"
      ? ({
          success: true,
          url: p.value,
          index,
          file: files[index],
        } satisfies FileUploadSuccess)
      : ({
          success: false,
          index,
          file: files[index],
          reason: p.reason,
        } satisfies FileUploadError),
  );
}
export function isValidAzureFileUrl(url?: string | null) {
  if (!url) {
    return false;
  }
  return url.startsWith(
    `https://${serverEnv.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net`,
  );
}
type FileUploadSuccess = {
  url: string;
  success: true;
  index: number;
  file: File;
};
type FileUploadError = {
  success: false;
  index: number;
  file: File;
  reason: any;
};
