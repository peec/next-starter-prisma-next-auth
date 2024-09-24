export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const formattedBytes = parseFloat((bytes / Math.pow(1024, i)).toFixed(2));
  return `${formattedBytes} ${sizes[i]}`;
}
