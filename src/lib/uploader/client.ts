import { BlobServiceClient, ContainerClient } from "@azure/storage-blob";
import { uuidv7 } from "uuidv7";
import {
  createWritableGlobalSas,
  createWritableOrganizationSas,
} from "@/lib/uploader/actions";

export default async function uploadFile({
  sasToken,
  accountName,
  containerName,
  file,
}: {
  sasToken: string;
  accountName: string;
  containerName: string;
  file: File;
}) {
  const blobService = new BlobServiceClient(
    `https://${accountName}.blob.core.windows.net/?${sasToken}`,
  );

  const containerClient: ContainerClient =
    blobService.getContainerClient(containerName);

  const newFileName = uuidv7() + "." + file.name.split(".").pop();
  const blobClient = containerClient.getBlockBlobClient(newFileName);
  const options = { blobHTTPHeaders: { blobContentType: file.type } };

  await blobClient.uploadData(file, options);
  const publicUrl = `https://${accountName}.blob.core.windows.net/${containerName}/${newFileName}`;

  return publicUrl;
}

export async function upload(
  type: { type: "organization"; id: string } | "global",
  files: File[],
) {
  const sasToken =
    type === "global"
      ? await createWritableGlobalSas()
      : await createWritableOrganizationSas(type.id);
  if (!sasToken) {
    throw new Error("Uploads not configured, sasToken missing");
  }
  const promise = await Promise.allSettled(
    files.map((file) =>
      uploadFile({
        ...sasToken,
        file,
      }),
    ),
  );
  return promise.map((p, index) =>
    p.status === "fulfilled"
      ? ({
          success: true,
          url: p.value,
          index,
          file: files[index],
        } as const)
      : ({ success: false, index, file: files[index] } as const),
  );
}
