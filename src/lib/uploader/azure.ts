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

export async function createWritableContainerSas({
  containerName,
}: {
  containerName: string;
}): Promise<SasToken | null> {
  if (
    !serverEnv.AZURE_STORAGE_ACCOUNT_NAME ||
    !serverEnv.AZURE_STORAGE_ACCOUNT_KEY
  ) {
    return null;
  }
  const blobService = new BlobServiceClient(
    `https://${serverEnv.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net`,
    credentials(),
  );
  const containerClient: ContainerClient =
    blobService.getContainerClient(containerName);
  await containerClient.createIfNotExists();

  const sasToken = generateBlobSASQueryParameters(
    {
      containerName,
      permissions: ContainerSASPermissions.parse("rc"),
      startsOn: new Date(new Date().valueOf() - 60 * 60 * 24 * 1000),
      expiresOn: new Date(new Date().valueOf() + 60 * 60 * 2 * 1000),
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

export function isValidAzureFileUrl(url?: string | null) {
  if (!url) {
    return false;
  }
  return url.startsWith(
    `https://${serverEnv.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net`,
  );
}
