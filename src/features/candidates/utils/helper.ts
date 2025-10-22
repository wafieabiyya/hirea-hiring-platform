export function validateLinkedInUrl(value: string) {
  try {
    const url = new URL(value);

    if (!/(^|\.)linkedin\.com$/i.test(url.hostname)) return false;

    return url.pathname.length > 1;
  } catch {
    return false;
  }
}
