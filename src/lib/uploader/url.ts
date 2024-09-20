import { SasToken } from "@/lib/uploader/types";

export function imageUrlFor(url?: string | null, sasToken?: SasToken | null) {
  if (
    sasToken &&
    url &&
    url.startsWith(`https://${sasToken.accountName}.blob.core.windows.net`)
  ) {
    return `${url}?${sasToken.sasToken}`;
  }
  return url;
}
