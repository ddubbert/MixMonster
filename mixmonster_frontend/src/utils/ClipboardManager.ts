export function copyStringToClipboard(textToCopy: string): Promise<void> {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(textToCopy);
  }

  const textArea = document.createElement('textarea');
  textArea.value = textToCopy;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  textArea.style.top = '-999999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  return new Promise((res, rej) => {
    const copied = document.execCommand('copy');
    textArea.remove();
    if (copied) res();
    else rej();
  });
}

export function copyBlobToClipboard(blob: Blob): Promise<void> {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.write([
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      new ClipboardItem({ [blob.type]: blob }),
    ]);
  }

  return Promise.resolve();
}

export default {
  copyToClipboard: copyStringToClipboard,
};
