export function copyToClipboard(textToCopy: string): Promise<void> {
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

export default {
  copyToClipboard,
};
