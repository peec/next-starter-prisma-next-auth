import { SasToken } from "@/lib/uploader/types";

export function imageUrlFor(
  url?: string | null,
  sasToken?: SasToken | null,
  isPublicContainer?: boolean,
) {
  if (
    sasToken &&
    url &&
    url.startsWith(`https://${sasToken.accountName}.blob.core.windows.net`)
  ) {
    return `${url}${!isPublicContainer ? `?${sasToken.sasToken}` : ""}`;
  }
  return url;
}
