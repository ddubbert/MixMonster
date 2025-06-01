interface Navigator {
  msSaveBlob?: (blob: Blob, filename: string) => boolean;
  msSaveOrOpenBlob?: (blob: Blob, filename: string) => boolean;
}
